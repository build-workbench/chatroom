package auth

import (
	"errors"

	"chatroom/internal/models"
)

// WSTicketService 封装 WebSocket 票据的生成和验证逻辑。
type WSTicketService struct {
	repo   WSTicketRepository
	secret string
	ttl    int
}

// WSTicketRepository 定义 WebSocket 票据的持久化接口。
type WSTicketRepository interface {
	Save(ticket *models.WSTicket) error
	Consume(ticketID string, userID, roomID uint) error
}

// NewWSTicketService 创建 WebSocket 票据服务。
func NewWSTicketService(repo WSTicketRepository, secret string, ttlSeconds int) *WSTicketService {
	return &WSTicketService{repo: repo, secret: secret, ttl: ttlSeconds}
}

// GenerateAndStore 生成并存储 WebSocket 票据。
func (s *WSTicketService) GenerateAndStore(userID, roomID uint) (string, error) {
	token, ticketID, expiresAt, err := GenerateWSTicket(userID, roomID, s.secret, s.ttl)
	if err != nil {
		return "", err
	}
	if err := s.repo.Save(&models.WSTicket{TicketID: ticketID, UserID: userID, RoomID: roomID, ExpiresAt: expiresAt}); err != nil {
		return "", err
	}
	return token, nil
}

// ValidateAndConsume 验证并消费 WebSocket 票据。
func (s *WSTicketService) ValidateAndConsume(tokenStr string, roomID uint) (*WSTicketClaims, error) {
	claims, err := ParseWSTicket(tokenStr, s.secret)
	if err != nil {
		return nil, err
	}
	if claims.RoomID != roomID {
		return nil, ErrInvalidTicket
	}
	if err := s.repo.Consume(claims.ID, claims.UserID, claims.RoomID); err != nil {
		return nil, ErrInvalidTicket
	}
	return claims, nil
}

// ErrInvalidTicket 表示无效的票据。
var ErrInvalidTicket = errors.New("invalid ws ticket")
