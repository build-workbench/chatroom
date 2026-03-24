package ws

import (
	"encoding/json"
	"sync"
	"sync/atomic"
	"time"

	"chatroom/internal/metrics"
)

// Hub 管理房间级别的子 Hub，实现延迟创建与并发安全。
type Hub struct {
	mu           sync.RWMutex
	rooms        map[uint]*RoomHub
	realtime     *Realtime
	cleanupAfter time.Duration
}

func NewHub() *Hub {
	return &Hub{rooms: make(map[uint]*RoomHub), cleanupAfter: 3 * time.Minute}
}

func (h *Hub) SetRealtime(rt *Realtime) { h.realtime = rt }

// GetRoom 若房间未初始化则懒加载一个 RoomHub。
func (h *Hub) GetRoom(roomID uint) *RoomHub {
	h.mu.RLock()
	room := h.rooms[roomID]
	h.mu.RUnlock()
	if room != nil {
		return room
	}

	h.mu.Lock()
	defer h.mu.Unlock()
	room = h.rooms[roomID]
	if room != nil {
		return room
	}
	room = NewRoomHub(roomID)
	room.parent = h
	h.rooms[roomID] = room
	go room.run()
	return room
}

func (h *Hub) BroadcastExisting(roomID uint, data []byte) {
	h.mu.RLock()
	room := h.rooms[roomID]
	h.mu.RUnlock()
	if room == nil {
		return
	}
	room.broadcast <- data
}

func (h *Hub) Online(roomID uint) int {
	h.mu.RLock()
	room := h.rooms[roomID]
	h.mu.RUnlock()
	if room == nil {
		return 0
	}
	return room.Online()
}

func (h *Hub) countOnline(roomID uint) int {
	if h.realtime != nil {
		if n, err := h.realtime.CountRoomOnline(roomID, 45*time.Second); err == nil {
			return n
		}
	}
	return h.Online(roomID)
}

func (h *Hub) publish(roomID uint, data []byte) {
	if h.realtime != nil {
		_ = h.realtime.Publish(roomID, data)
	}
}

func (h *Hub) trackRegister(client *Client) {
	if h.realtime != nil {
		_ = h.realtime.RegisterSession(client.sessionID, client.room.roomID, client.userID)
	}
}

func (h *Hub) trackHeartbeat(sessionID string) {
	if h.realtime != nil {
		_ = h.realtime.TouchSession(sessionID)
	}
}

func (h *Hub) trackUnregister(sessionID string) {
	if h.realtime != nil {
		_ = h.realtime.DeleteSession(sessionID)
	}
}

func (h *Hub) cleanupRoomLater(room *RoomHub) {
	if h.cleanupAfter <= 0 {
		return
	}
	time.AfterFunc(h.cleanupAfter, func() {
		if room.Online() != 0 {
			return
		}
		room.Stop()
		h.mu.Lock()
		if h.rooms[room.roomID] == room {
			delete(h.rooms, room.roomID)
		}
		h.mu.Unlock()
	})
}

// Shutdown 关闭所有 RoomHub goroutine，用于优雅停服。
func (h *Hub) Shutdown() {
	h.mu.Lock()
	defer h.mu.Unlock()
	for id, room := range h.rooms {
		room.Stop()
		delete(h.rooms, id)
	}
}

type RoomHub struct {
	parent     *Hub
	roomID     uint
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte
	stop       chan struct{}
	online     int32
}

func NewRoomHub(roomID uint) *RoomHub {
	return &RoomHub{
		roomID:     roomID,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte, 256),
		stop:       make(chan struct{}),
	}
}

// broadcastToClients 向房间内所有客户端发送数据，慢客户端会被清理。
func (rh *RoomHub) broadcastToClients(data []byte) {
	for cli := range rh.clients {
		select {
		case cli.send <- data:
		default:
			close(cli.send)
			delete(rh.clients, cli)
			metrics.WsConnections.Dec()
		}
	}
}

// wsPresenceEvent 用于 join/leave 广播的类型安全结构体。
type wsPresenceEvent struct {
	Type     string `json:"type"`
	RoomID   uint   `json:"room_id"`
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Online   int    `json:"online"`
}

// broadcastEvent 序列化事件并广播给房间内所有客户端。
func (rh *RoomHub) broadcastEvent(evt interface{}) {
	b, err := json.Marshal(evt)
	if err != nil {
		return
	}
	rh.broadcastToClients(b)
}

// updateOnline 更新并返回当前在线人数。
func (rh *RoomHub) updateOnline() int {
	n := int32(len(rh.clients))
	atomic.StoreInt32(&rh.online, n)
	return int(n)
}

func (rh *RoomHub) run() {
	for {
		select {
		case <-rh.stop:
			for c := range rh.clients {
				close(c.send)
				delete(rh.clients, c)
			}
			atomic.StoreInt32(&rh.online, 0)
			return

		case c := <-rh.register:
			rh.clients[c] = true
			rh.updateOnline()
			metrics.WsConnections.Inc()
			if rh.parent != nil {
				rh.parent.trackRegister(c)
			}
			online := rh.Online()
			if rh.parent != nil {
				online = rh.parent.countOnline(rh.roomID)
			}
			evt := wsPresenceEvent{Type: "join", RoomID: rh.roomID, UserID: c.userID, Username: c.uname, Online: online}
			rh.broadcastEvent(evt)
			if rh.parent != nil {
				if b, err := json.Marshal(evt); err == nil {
					rh.parent.publish(rh.roomID, b)
				}
			}

		case c := <-rh.unregister:
			if _, ok := rh.clients[c]; !ok {
				break
			}
			delete(rh.clients, c)
			close(c.send)
			rh.updateOnline()
			metrics.WsConnections.Dec()
			if rh.parent != nil {
				rh.parent.trackUnregister(c.sessionID)
			}
			online := rh.Online()
			if rh.parent != nil {
				online = rh.parent.countOnline(rh.roomID)
			}
			evt := wsPresenceEvent{Type: "leave", RoomID: rh.roomID, UserID: c.userID, Username: c.uname, Online: online}
			rh.broadcastEvent(evt)
			if rh.parent != nil {
				if b, err := json.Marshal(evt); err == nil {
					rh.parent.publish(rh.roomID, b)
				}
				if len(rh.clients) == 0 {
					rh.parent.cleanupRoomLater(rh)
				}
			}

		case msg := <-rh.broadcast:
			rh.broadcastToClients(msg)
		}
	}
}

// Stop 停止 RoomHub 的 run goroutine。
func (rh *RoomHub) Stop() {
	select {
	case <-rh.stop:
	default:
		close(rh.stop)
	}
}

// Online 返回房间在线客户端数量，供 REST 接口复用。
func (rh *RoomHub) Online() int { return int(atomic.LoadInt32(&rh.online)) }
