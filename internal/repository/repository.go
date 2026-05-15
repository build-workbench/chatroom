package repository

import (
	"chatroom/internal/models"
	"time"

	"gorm.io/gorm"
)

// UserRepository 定义用户数据访问接口。
type UserRepository interface {
	// Create 创建新用户，返回创建后的用户（包含 ID）。
	Create(user *models.User) error
	// FindByUsername 根据用户名查找用户。
	FindByUsername(username string) (*models.User, error)
	// FindByID 根据 ID 查找用户。
	FindByID(id uint) (*models.User, error)
	// FindByIDs 批量查找用户，返回 ID -> User 映射。
	FindByIDs(ids []uint) (map[uint]*models.User, error)
}

// RoomRepository 定义房间数据访问接口。
type RoomRepository interface {
	// Create 创建新房间，返回创建后的房间（包含 ID）。
	Create(room *models.Room) error
	// FindByID 根据 ID 查找房间。
	FindByID(id uint) (*models.Room, error)
	// List 列出房间，按 ID 降序，限制数量。
	List(limit int) ([]models.Room, error)
	// CountOnlineByRoom 统计各房间的在线会话数。
	CountOnlineByRoom(activeWindow time.Duration) (map[uint]int, error)
}

// MessageRepository 定义消息数据访问接口。
type MessageRepository interface {
	// Create 创建新消息，返回创建后的消息（包含 ID 和时间戳）。
	Create(msg *models.Message) error
	// ListByRoom 分页查询指定房间的消息，按 ID 降序。
	ListByRoom(roomID uint, limit int, beforeID uint) ([]models.Message, error)
}

// RefreshTokenRepository 定义刷新令牌数据访问接口。
type RefreshTokenRepository interface {
	// Save 保存刷新令牌。
	Save(token *models.RefreshToken) error
	// Validate 验证刷新令牌，返回有效的令牌记录。
	Validate(token string) (*models.RefreshToken, error)
	// Revoke 撤销刷新令牌。
	Revoke(token string) error
}

// WSTicketRepository 定义 WebSocket 票据数据访问接口。
type WSTicketRepository interface {
	// Save 保存 WebSocket 票据。
	Save(ticket *models.WSTicket) error
	// Consume 消费 WebSocket 票据，标记为已使用。
	Consume(ticketID string, userID, roomID uint) error
}

// WSSessionRepository 定义 WebSocket 会话数据访问接口。
type WSSessionRepository interface {
	// Upsert 创建或更新会话。
	Upsert(session *models.WSSession) error
	// Delete 删除会话。
	Delete(sessionID string) error
}

// --- GORM 实现 ---

// GormUserRepository 是 UserRepository 的 GORM 实现。
type GormUserRepository struct {
	db *gorm.DB
}

func NewGormUserRepository(db *gorm.DB) *GormUserRepository {
	return &GormUserRepository{db: db}
}

func (r *GormUserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *GormUserRepository) FindByUsername(username string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *GormUserRepository) FindByIDs(ids []uint) (map[uint]*models.User, error) {
	if len(ids) == 0 {
		return make(map[uint]*models.User), nil
	}
	var users []models.User
	if err := r.db.Where("id IN ?", ids).Find(&users).Error; err != nil {
		return nil, err
	}
	result := make(map[uint]*models.User, len(users))
	for i := range users {
		result[users[i].ID] = &users[i]
	}
	return result, nil
}

// GormRoomRepository 是 RoomRepository 的 GORM 实现。
type GormRoomRepository struct {
	db *gorm.DB
}

func NewGormRoomRepository(db *gorm.DB) *GormRoomRepository {
	return &GormRoomRepository{db: db}
}

func (r *GormRoomRepository) Create(room *models.Room) error {
	return r.db.Create(room).Error
}

func (r *GormRoomRepository) FindByID(id uint) (*models.Room, error) {
	var room models.Room
	if err := r.db.First(&room, id).Error; err != nil {
		return nil, err
	}
	return &room, nil
}

func (r *GormRoomRepository) List(limit int) ([]models.Room, error) {
	var rooms []models.Room
	if err := r.db.Order("id desc").Limit(limit).Find(&rooms).Error; err != nil {
		return nil, err
	}
	return rooms, nil
}

func (r *GormRoomRepository) CountOnlineByRoom(activeWindow time.Duration) (map[uint]int, error) {
	threshold := time.Now().Add(-activeWindow)
	var rows []struct {
		RoomID uint
		Count  int
	}
	if err := r.db.Model(&models.WSSession{}).
		Select("room_id, COUNT(*) as count").
		Where("last_seen_at > ?", threshold).
		Group("room_id").
		Scan(&rows).Error; err != nil {
		return nil, err
	}
	counts := make(map[uint]int, len(rows))
	for _, row := range rows {
		counts[row.RoomID] = row.Count
	}
	return counts, nil
}

// GormMessageRepository 是 MessageRepository 的 GORM 实现。
type GormMessageRepository struct {
	db *gorm.DB
}

func NewGormMessageRepository(db *gorm.DB) *GormMessageRepository {
	return &GormMessageRepository{db: db}
}

func (r *GormMessageRepository) Create(msg *models.Message) error {
	return r.db.Create(msg).Error
}

func (r *GormMessageRepository) ListByRoom(roomID uint, limit int, beforeID uint) ([]models.Message, error) {
	q := r.db.Where("room_id = ?", roomID)
	if beforeID > 0 {
		q = q.Where("id < ?", beforeID)
	}
	var msgs []models.Message
	if err := q.Order("id desc").Limit(limit).Find(&msgs).Error; err != nil {
		return nil, err
	}
	return msgs, nil
}

// GormRefreshTokenRepository 是 RefreshTokenRepository 的 GORM 实现。
type GormRefreshTokenRepository struct {
	db *gorm.DB
}

func NewGormRefreshTokenRepository(db *gorm.DB) *GormRefreshTokenRepository {
	return &GormRefreshTokenRepository{db: db}
}

func (r *GormRefreshTokenRepository) Save(token *models.RefreshToken) error {
	return r.db.Create(token).Error
}

func (r *GormRefreshTokenRepository) Validate(token string) (*models.RefreshToken, error) {
	var rt models.RefreshToken
	err := r.db.Where("token = ? AND revoked_at IS NULL AND expires_at > ?", token, time.Now()).First(&rt).Error
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func (r *GormRefreshTokenRepository) Revoke(token string) error {
	now := time.Now()
	return r.db.Model(&models.RefreshToken{}).Where("token = ?", token).Update("revoked_at", &now).Error
}

// GormWSTicketRepository 是 WSTicketRepository 的 GORM 实现。
type GormWSTicketRepository struct {
	db *gorm.DB
}

func NewGormWSTicketRepository(db *gorm.DB) *GormWSTicketRepository {
	return &GormWSTicketRepository{db: db}
}

func (r *GormWSTicketRepository) Save(ticket *models.WSTicket) error {
	return r.db.Create(ticket).Error
}

func (r *GormWSTicketRepository) Consume(ticketID string, userID, roomID uint) error {
	now := time.Now().UTC()
	result := r.db.Model(&models.WSTicket{}).
		Where("ticket_id = ? AND user_id = ? AND room_id = ? AND consumed_at IS NULL AND expires_at > ?", ticketID, userID, roomID, now).
		Updates(map[string]any{"consumed_at": now})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected != 1 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// GormWSSessionRepository 是 WSSessionRepository 的 GORM 实现。
type GormWSSessionRepository struct {
	db *gorm.DB
}

func NewGormWSSessionRepository(db *gorm.DB) *GormWSSessionRepository {
	return &GormWSSessionRepository{db: db}
}

func (r *GormWSSessionRepository) Upsert(session *models.WSSession) error {
	return r.db.Save(session).Error
}

func (r *GormWSSessionRepository) Delete(sessionID string) error {
	return r.db.Delete(&models.WSSession{}, "session_id = ?", sessionID).Error
}
