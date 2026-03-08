package models

import "time"

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Username     string    `gorm:"uniqueIndex;size:64;not null" json:"username"`
	PasswordHash string    `gorm:"not null" json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func (User) TableName() string { return "users" }

type Room struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex;size:128;not null" json:"name"`
	OwnerID   uint      `gorm:"not null" json:"owner_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Room) TableName() string { return "rooms" }

type Message struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	RoomID    uint      `gorm:"index:idx_msg_room_id;not null" json:"room_id"`
	UserID    uint      `gorm:"index;not null" json:"user_id"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func (Message) TableName() string { return "messages" }

type RefreshToken struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	UserID    uint       `gorm:"index;not null" json:"user_id"`
	Token     string     `gorm:"uniqueIndex;size:128;not null" json:"-"`
	ExpiresAt time.Time  `gorm:"index;not null" json:"expires_at"`
	RevokedAt *time.Time `json:"revoked_at,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

func (RefreshToken) TableName() string { return "refresh_tokens" }
