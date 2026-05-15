package service

import (
	"time"

	"chatroom/internal/db"
	"chatroom/internal/models"
	"chatroom/internal/repository"
	"chatroom/internal/ws"

	"gorm.io/gorm"
)

// RoomService 封装房间相关的业务逻辑。
type RoomService struct {
	roomRepo repository.RoomRepository
	hub      *ws.Hub
}

func NewRoomService(roomRepo repository.RoomRepository, hub *ws.Hub) *RoomService {
	return &RoomService{roomRepo: roomRepo, hub: hub}
}

// RoomDTO 是对外输出的房间数据。
type RoomDTO struct {
	ID     uint   `json:"id"`
	Name   string `json:"name"`
	Online int    `json:"online"`
}

// Create 创建新房间，房间名不可重复。
// 依赖数据库唯一索引检测重复房间名，避免 check-then-create 竞态。
func (s *RoomService) Create(name string, ownerID uint) (*RoomDTO, error) {
	room := &models.Room{Name: name, OwnerID: ownerID}
	if err := s.roomRepo.Create(room); err != nil {
		if db.IsUniqueViolation(err) {
			return nil, ErrRoomNameTaken
		}
		return nil, ErrInternal
	}
	return &RoomDTO{ID: room.ID, Name: room.Name, Online: 0}, nil
}

// List 返回房间列表，附带各房间的在线人数。
func (s *RoomService) List(limit int) ([]RoomDTO, error) {
	if limit <= 0 || limit > 200 {
		limit = 100
	}
	rooms, err := s.roomRepo.List(limit)
	if err != nil {
		return nil, ErrInternal
	}
	counts, err := s.roomRepo.CountOnlineByRoom(45 * time.Second)
	if err != nil {
		return nil, ErrInternal
	}
	out := make([]RoomDTO, 0, len(rooms))
	for _, r := range rooms {
		online, ok := counts[r.ID]
		if !ok {
			online = s.hub.Online(r.ID)
		}
		out = append(out, RoomDTO{ID: r.ID, Name: r.Name, Online: online})
	}
	return out, nil
}

// Exists 检查房间是否存在。
func (s *RoomService) Exists(roomID uint) (*RoomDTO, error) {
	room, err := s.roomRepo.FindByID(roomID)
	if err != nil {
		if db.IsNotFound(err) {
			return nil, ErrRoomNotFound
		}
		return nil, ErrInternal
	}
	return &RoomDTO{ID: room.ID, Name: room.Name, Online: s.hub.Online(room.ID)}, nil
}

// --- 兼容旧 API 的构造函数（后续可移除）---

// RoomServiceLegacy 使用 gorm.DB 的旧构造函数，用于渐进式迁移。
type RoomServiceLegacy struct {
	db  *gorm.DB
	hub *ws.Hub
}

func NewRoomServiceLegacy(gormDB *gorm.DB, hub *ws.Hub) *RoomServiceLegacy {
	return &RoomServiceLegacy{db: gormDB, hub: hub}
}

func (s *RoomServiceLegacy) Create(name string, ownerID uint) (*RoomDTO, error) {
	room := models.Room{Name: name, OwnerID: ownerID}
	if err := s.db.Create(&room).Error; err != nil {
		if db.IsUniqueViolation(err) {
			return nil, ErrRoomNameTaken
		}
		return nil, ErrInternal
	}
	return &RoomDTO{ID: room.ID, Name: room.Name, Online: 0}, nil
}

func (s *RoomServiceLegacy) List(limit int) ([]RoomDTO, error) {
	if limit <= 0 || limit > 200 {
		limit = 100
	}
	var rooms []models.Room
	if err := s.db.Order("id desc").Limit(limit).Find(&rooms).Error; err != nil {
		return nil, ErrInternal
	}
	counts, err := s.onlineCountsByRoom(45 * time.Second)
	if err != nil {
		return nil, ErrInternal
	}
	out := make([]RoomDTO, 0, len(rooms))
	for _, r := range rooms {
		online, ok := counts[r.ID]
		if !ok {
			online = s.hub.Online(r.ID)
		}
		out = append(out, RoomDTO{ID: r.ID, Name: r.Name, Online: online})
	}
	return out, nil
}

func (s *RoomServiceLegacy) Exists(roomID uint) (*RoomDTO, error) {
	var room models.Room
	if err := s.db.First(&room, roomID).Error; err != nil {
		if db.IsNotFound(err) {
			return nil, ErrRoomNotFound
		}
		return nil, ErrInternal
	}
	return &RoomDTO{ID: room.ID, Name: room.Name, Online: s.hub.Online(room.ID)}, nil
}

func (s *RoomServiceLegacy) onlineCountsByRoom(activeWindow time.Duration) (map[uint]int, error) {
	threshold := time.Now().Add(-activeWindow)
	var rows []struct {
		RoomID uint
		Count  int
	}
	if err := s.db.Model(&models.WSSession{}).
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
