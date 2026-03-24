package ws

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"

	"chatroom/internal/auth"
	"chatroom/internal/config"
	"chatroom/internal/metrics"
	"chatroom/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

const (
	// maxMessageSize 单条 WebSocket 消息最大字节数。
	maxMessageSize = 1 << 20 // 1 MB
	// maxContentLength 单条聊天消息最大字符数。
	maxContentLength = 2000
	// pongWait 等待客户端 Pong 的超时时间。
	pongWait = 60 * time.Second
	// pingInterval 向客户端发送 Ping 的间隔，必须小于 pongWait。
	pingInterval = 30 * time.Second
	// writeWait 每次写操作的截止时间。
	writeWait = 10 * time.Second
	// sendBufSize 每个客户端发送缓冲区大小。
	sendBufSize = 256
)

type Client struct {
	room      *RoomHub
	conn      *websocket.Conn
	send      chan []byte
	db        *gorm.DB
	hub       *Hub
	sessionID string
	userID    uint
	uname     string
}

func newUpgrader(cfg config.Config) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			if origin == "" {
				return false
			}
			return cfg.AllowsOrigin(origin, r)
		},
		Subprotocols: []string{"chatroom.v1"},
	}
}

type InboundMessage struct {
	Type     string `json:"type"`
	Content  string `json:"content"`
	IsTyping bool   `json:"is_typing"`
}

type OutboundMessage struct {
	Type      string    `json:"type"`
	ID        uint      `json:"id"`
	RoomID    uint      `json:"room_id"`
	UserID    uint      `json:"user_id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type wsTypingEvent struct {
	Type     string `json:"type"`
	RoomID   uint   `json:"room_id"`
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	IsTyping bool   `json:"is_typing"`
}

type wsSimpleMsg struct {
	Type    string `json:"type"`
	Content string `json:"content,omitempty"`
}

func extractWSTicket(r *http.Request) string {
	for _, proto := range websocket.Subprotocols(r) {
		if strings.HasPrefix(proto, "ticket.") {
			return strings.TrimPrefix(proto, "ticket.")
		}
	}
	return ""
}

// Serve 返回 Gin 处理函数，用于校验用户、加入房间并启动读写循环。
func Serve(h *Hub, db *gorm.DB, cfg config.Config) gin.HandlerFunc {
	upgrader := newUpgrader(cfg)
	return func(c *gin.Context) {
		roomIDStr := c.Query("room_id")
		rid64, err := strconv.ParseUint(roomIDStr, 10, 64)
		if err != nil || rid64 == 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid room_id"})
			return
		}
		var room models.Room
		if err := db.First(&room, uint(rid64)).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
			return
		}

		ticket := extractWSTicket(c.Request)
		if ticket == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "missing ws ticket"})
			return
		}
		claims, err := auth.ValidateAndConsumeWSTicket(db, ticket, cfg.JWTSecret, uint(rid64))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid ws ticket"})
			return
		}

		var user models.User
		if err := db.First(&user, claims.UserID).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, http.Header{"Sec-WebSocket-Protocol": []string{"chatroom.v1"}})
		if err != nil {
			log.Error().Err(err).Uint64("room_id", rid64).Str("remote", c.Request.RemoteAddr).Msg("ws upgrade")
			return
		}
		rh := h.GetRoom(uint(rid64))
		client := &Client{
			room:      rh,
			conn:      conn,
			send:      make(chan []byte, sendBufSize),
			db:        db,
			hub:       h,
			sessionID: claims.ID,
			userID:    user.ID,
			uname:     user.Username,
		}
		rh.register <- client

		go client.writePump()
		client.readPump()
	}
}

// readPump 负责读取客户端信息、校验输入并推送到房间广播。
func (c *Client) readPump() {
	defer func() {
		c.room.unregister <- c
		_ = c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		if c.hub != nil {
			c.hub.trackHeartbeat(c.sessionID)
		}
		return c.conn.SetReadDeadline(time.Now().Add(pongWait))
	})
	for {
		_, data, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
				log.Warn().Err(err).Uint("user_id", c.userID).Uint("room_id", c.room.roomID).Msg("ws unexpected close")
			}
			break
		}
		var in InboundMessage
		if err := json.Unmarshal(data, &in); err != nil {
			continue
		}

		switch in.Type {
		case "ping":
			if c.hub != nil {
				c.hub.trackHeartbeat(c.sessionID)
			}
			if b, err := json.Marshal(wsSimpleMsg{Type: "pong"}); err == nil {
				select {
				case c.send <- b:
				default:
				}
			}

		case "typing":
			evt := wsTypingEvent{Type: "typing", RoomID: c.room.roomID, UserID: c.userID, Username: c.uname, IsTyping: in.IsTyping}
			if b, err := json.Marshal(evt); err == nil {
				c.room.broadcast <- b
				if c.hub != nil {
					c.hub.publish(c.room.roomID, b)
				}
			}

		case "message":
			c.handleMessage(in.Content)

		default:
			c.handleMessage(in.Content)
		}
	}
}

// handleMessage 校验并持久化聊天消息，然后广播给房间内的所有客户端。
func (c *Client) handleMessage(content string) {
	if content == "" {
		return
	}
	if len(content) > maxContentLength {
		if b, err := json.Marshal(wsSimpleMsg{Type: "error", Content: "消息长度不能超过2000字符"}); err == nil {
			select {
			case c.send <- b:
			default:
			}
		}
		return
	}
	msg := models.Message{RoomID: c.room.roomID, UserID: c.userID, Content: content}
	if err := c.db.Create(&msg).Error; err != nil {
		log.Error().Err(err).Uint("room_id", c.room.roomID).Uint("user_id", c.userID).Msg("ws persist message")
		if b, err := json.Marshal(wsSimpleMsg{Type: "error", Content: "消息发送失败"}); err == nil {
			select {
			case c.send <- b:
			default:
			}
		}
		return
	}
	out := OutboundMessage{Type: "message", ID: msg.ID, RoomID: msg.RoomID, UserID: msg.UserID, Username: c.uname, Content: msg.Content, CreatedAt: msg.CreatedAt}
	b, _ := json.Marshal(out)
	metrics.WsMessagesTotal.Inc()
	c.room.broadcast <- b
	if c.hub != nil {
		c.hub.publish(c.room.roomID, b)
	}
}

// writePump 周期性发送服务端数据与心跳，防止浏览器断线。
func (c *Client) writePump() {
	ticker := time.NewTicker(pingInterval)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			_, _ = w.Write(message)
			_ = w.Close()

			n := len(c.send)
			for i := 0; i < n; i++ {
				msg, ok := <-c.send
				if !ok {
					return
				}
				_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
				if err := c.conn.WriteMessage(websocket.TextMessage, msg); err != nil {
					return
				}
			}
		case <-ticker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
