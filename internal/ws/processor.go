package ws

import (
	"chatroom/internal/models"
	"chatroom/internal/sanitize"

	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// MessageProcessor 定义消息处理的接口。
// 将消息验证、清洗、持久化、广播的职责从连接处理器中分离。
//
// 教学说明：这里使用接口而非直接在 conn 上实现，是为了演示"职责分离"--
// conn 只管读写 WebSocket 帧，processor 负责业务逻辑（校验、入库、组装响应）。
// 当前只有一个实现 DefaultMessageProcessor，但接口使得未来可以替换为
// 不同的处理策略（如限流、敏感词过滤）而无需修改 conn 代码。
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
	config MessageProcessorConfig
}

// NewDefaultMessageProcessor 创建默认消息处理器。
func NewDefaultMessageProcessor(db *gorm.DB, room *RoomHub, cfg MessageProcessorConfig) *DefaultMessageProcessor {
	return &DefaultMessageProcessor{
		db:     db,
		room:   room,
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

	return &ProcessResult{
		Message: &OutboundMessage{
			Type:      "message",
			ID:        msg.ID,
			RoomID:    msg.RoomID,
			UserID:    msg.UserID,
			Username:  p.config.Username,
			Content:   msg.Content,
			CreatedAt: msg.CreatedAt,
		},
		Broadcast: true,
	}
}
