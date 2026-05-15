package ws

import (
	"encoding/json"

	"chatroom/internal/metrics"
	"chatroom/internal/models"
	"chatroom/internal/sanitize"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// MessageProcessor 定义消息处理的接口。
// 将消息验证、清洗、持久化、广播的职责从连接处理器中分离。
type MessageProcessor interface {
	// Process 处理消息，返回处理结果和错误。
	// 如果返回 nil，表示消息已成功处理并广播。
	Process(content string) *ProcessResult
}

// ProcessResult 表示消息处理结果。
type ProcessResult struct {
	Message   *OutboundMessage
	Broadcast bool
}

// MessageProcessorConfig 是消息处理器的配置。
type MessageProcessorConfig struct {
	RoomID     uint
	UserID     uint
	Username   string
	MaxSize    int64
	MaxContent int
}

// DefaultMessageProcessor 是默认的消息处理器实现。
type DefaultMessageProcessor struct {
	db     *gorm.DB
	room   *RoomHub
	hub    *Hub
	config MessageProcessorConfig
}

// NewDefaultMessageProcessor 创建默认消息处理器。
func NewDefaultMessageProcessor(db *gorm.DB, room *RoomHub, hub *Hub, cfg MessageProcessorConfig) *DefaultMessageProcessor {
	return &DefaultMessageProcessor{
		db:     db,
		room:   room,
		hub:    hub,
		config: cfg,
	}
}

// Process 处理消息。
func (p *DefaultMessageProcessor) Process(content string) *ProcessResult {
	if content == "" {
		return nil
	}

	// 对消息内容进行 XSS 过滤
	sanitizedContent := sanitize.Content(content)
	if len(sanitizedContent) > p.config.MaxContent {
		return &ProcessResult{
			Message: &OutboundMessage{
				Type:    "error",
				Content: "消息长度不能超过2000字符",
			},
			Broadcast: false,
		}
	}

	msg := models.Message{
		RoomID:  p.config.RoomID,
		UserID:  p.config.UserID,
		Content: sanitizedContent,
	}
	if err := p.db.Create(&msg).Error; err != nil {
		log.Error().Err(err).Uint("room_id", p.config.RoomID).Uint("user_id", p.config.UserID).Msg("ws persist message")
		return &ProcessResult{
			Message: &OutboundMessage{
				Type:    "error",
				Content: "消息发送失败",
			},
			Broadcast: false,
		}
	}

	out := &OutboundMessage{
		Type:      "message",
		ID:        msg.ID,
		RoomID:    msg.RoomID,
		UserID:    msg.UserID,
		Username:  p.config.Username,
		Content:   msg.Content,
		CreatedAt: msg.CreatedAt,
	}

	metrics.WsMessagesTotal.Inc()
	return &ProcessResult{
		Message:   out,
		Broadcast: true,
	}
}

// BroadcastMessage 广播消息到房间。
func BroadcastMessage(room *RoomHub, hub *Hub, msg *OutboundMessage) {
	b, err := json.Marshal(msg)
	if err != nil {
		return // OutboundMessage fields are JSON-safe
	}
	room.broadcast <- b
	if hub != nil {
		hub.publish(room.roomID, b)
	}
}
