package service

import (
	"time"

	"chatroom/internal/models"
	"chatroom/internal/repository"

	"gorm.io/gorm"
)

// MessageService 封装消息相关的业务逻辑。
type MessageService struct {
	msgRepo  repository.MessageRepository
	userRepo repository.UserRepository
}

func NewMessageService(msgRepo repository.MessageRepository, userRepo repository.UserRepository) *MessageService {
	return &MessageService{msgRepo: msgRepo, userRepo: userRepo}
}

// MessageDTO 是对外输出的消息数据。
type MessageDTO struct {
	Type      string    `json:"type"`
	ID        uint      `json:"id"`
	RoomID    uint      `json:"room_id"`
	UserID    uint      `json:"user_id"`
	Username  string    `json:"username"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// ListByRoom 分页查询指定房间的消息，按 id 升序返回。
func (s *MessageService) ListByRoom(roomID uint, limit int, beforeID uint) ([]MessageDTO, error) {
	if limit <= 0 || limit > 200 {
		limit = 50
	}

	msgs, err := s.msgRepo.ListByRoom(roomID, limit, beforeID)
	if err != nil {
		return nil, ErrInternal
	}

	// 反转为升序
	for i, j := 0, len(msgs)-1; i < j; i, j = i+1, j-1 {
		msgs[i], msgs[j] = msgs[j], msgs[i]
	}

	// 批量获取用户名
	usernames, err := s.resolveUsernames(msgs)
	if err != nil {
		return nil, ErrInternal
	}

	out := make([]MessageDTO, 0, len(msgs))
	for _, m := range msgs {
		out = append(out, MessageDTO{
			Type:      "message",
			ID:        m.ID,
			RoomID:    m.RoomID,
			UserID:    m.UserID,
			Username:  usernames[m.UserID],
			Content:   m.Content,
			CreatedAt: m.CreatedAt,
		})
	}
	return out, nil
}

// resolveUsernames 批量获取消息涉及的用户名。
func (s *MessageService) resolveUsernames(msgs []models.Message) (map[uint]string, error) {
	seen := make(map[uint]struct{}, len(msgs))
	userIDs := make([]uint, 0, len(msgs))
	for _, m := range msgs {
		if _, ok := seen[m.UserID]; ok {
			continue
		}
		seen[m.UserID] = struct{}{}
		userIDs = append(userIDs, m.UserID)
	}

	usernames := make(map[uint]string, len(userIDs))
	if len(userIDs) > 0 {
		users, err := s.userRepo.FindByIDs(userIDs)
		if err != nil {
			return nil, err
		}
		for id, u := range users {
			usernames[id] = u.Username
		}
	}
	return usernames, nil
}

// --- 兼容旧 API 的构造函数（后续可移除）---

// MessageServiceLegacy 使用 gorm.DB 的旧构造函数，用于渐进式迁移。
type MessageServiceLegacy struct {
	db *gorm.DB
}

func NewMessageServiceLegacy(gormDB *gorm.DB) *MessageServiceLegacy {
	return &MessageServiceLegacy{db: gormDB}
}

func (s *MessageServiceLegacy) ListByRoom(roomID uint, limit int, beforeID uint) ([]MessageDTO, error) {
	if limit <= 0 || limit > 200 {
		limit = 50
	}

	q := s.db.Where("room_id = ?", roomID)
	if beforeID > 0 {
		q = q.Where("id < ?", beforeID)
	}

	var msgs []models.Message
	if err := q.Order("id desc").Limit(limit).Find(&msgs).Error; err != nil {
		return nil, ErrInternal
	}

	// 反转为升序
	for i, j := 0, len(msgs)-1; i < j; i, j = i+1, j-1 {
		msgs[i], msgs[j] = msgs[j], msgs[i]
	}

	// 批量获取用户名
	usernames, err := s.resolveUsernamesLegacy(msgs)
	if err != nil {
		return nil, ErrInternal
	}

	out := make([]MessageDTO, 0, len(msgs))
	for _, m := range msgs {
		out = append(out, MessageDTO{
			Type:      "message",
			ID:        m.ID,
			RoomID:    m.RoomID,
			UserID:    m.UserID,
			Username:  usernames[m.UserID],
			Content:   m.Content,
			CreatedAt: m.CreatedAt,
		})
	}
	return out, nil
}

func (s *MessageServiceLegacy) resolveUsernamesLegacy(msgs []models.Message) (map[uint]string, error) {
	seen := make(map[uint]struct{}, len(msgs))
	userIDs := make([]uint, 0, len(msgs))
	for _, m := range msgs {
		if _, ok := seen[m.UserID]; ok {
			continue
		}
		seen[m.UserID] = struct{}{}
		userIDs = append(userIDs, m.UserID)
	}

	usernames := make(map[uint]string, len(userIDs))
	if len(userIDs) > 0 {
		var users []models.User
		if err := s.db.Select("id", "username").Where("id IN ?", userIDs).Find(&users).Error; err != nil {
			return nil, err
		}
		for _, u := range users {
			usernames[u.ID] = u.Username
		}
	}
	return usernames, nil
}
