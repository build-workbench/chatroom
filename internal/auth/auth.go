package auth

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"strconv"
	"time"

	"chatroom/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// Claims 表示访问令牌的声明。
type Claims struct {
	UserID uint `json:"uid"`
	jwt.RegisteredClaims
}

// WSTicketClaims 表示 WebSocket 票据的声明。
type WSTicketClaims struct {
	UserID uint   `json:"uid"`
	RoomID uint   `json:"rid"`
	Type   string `json:"typ"`
	jwt.RegisteredClaims
}

// --- 密码哈希（纯函数）---

// HashPassword 对密码进行哈希处理。
func HashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}

// VerifyPassword 验证密码是否匹配哈希值。
func VerifyPassword(hash, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw)) == nil
}

// --- 访问令牌（纯函数）---

// GenerateAccessToken 生成访问令牌。
func GenerateAccessToken(userID uint, secret string, ttlMinutes int) (string, error) {
	now := time.Now()
	claims := Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.FormatUint(uint64(userID), 10),
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Duration(ttlMinutes) * time.Minute)),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ParseAccessToken 解析并验证访问令牌。
func ParseAccessToken(tokenStr, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("invalid token")
}

// --- WebSocket 票据（纯函数部分）---

// GenerateWSTicket 生成 WebSocket 票据令牌。
// 返回：签名后的令牌、票据 ID、过期时间。
func GenerateWSTicket(userID, roomID uint, secret string, ttlSeconds int) (token, ticketID string, expiresAt time.Time, err error) {
	now := time.Now().UTC()
	ticketID, err = GenerateRefreshToken()
	if err != nil {
		return "", "", time.Time{}, err
	}
	expiresAt = now.Add(time.Duration(ttlSeconds) * time.Second)
	claims := WSTicketClaims{
		UserID: userID,
		RoomID: roomID,
		Type:   "ws_ticket",
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.FormatUint(uint64(userID), 10),
			ID:        ticketID,
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(now),
		},
	}
	signed := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err = signed.SignedString([]byte(secret))
	if err != nil {
		return "", "", time.Time{}, err
	}
	return token, ticketID, expiresAt, nil
}

// ParseWSTicket 解析并验证 WebSocket 票据令牌。
func ParseWSTicket(tokenStr, secret string) (*WSTicketClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &WSTicketClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*WSTicketClaims); ok && token.Valid && claims.Type == "ws_ticket" {
		return claims, nil
	}
	return nil, errors.New("invalid ws ticket")
}

// --- 刷新令牌（纯函数）---

// GenerateRefreshToken 生成随机刷新令牌。
func GenerateRefreshToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// --- 数据库操作 ---

// SaveRefreshToken 保存刷新令牌到数据库。
func SaveRefreshToken(db *gorm.DB, userID uint, token string, expiresAt time.Time) error {
	return db.Create(&models.RefreshToken{UserID: userID, Token: token, ExpiresAt: expiresAt}).Error
}

// ValidateRefreshToken 验证刷新令牌。
func ValidateRefreshToken(db *gorm.DB, token string) (*models.RefreshToken, error) {
	var rt models.RefreshToken
	err := db.Where("token = ? AND revoked_at IS NULL AND expires_at > ?", token, time.Now()).First(&rt).Error
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

// RevokeRefreshToken 撤销刷新令牌。
func RevokeRefreshToken(db *gorm.DB, token string) error {
	now := time.Now()
	return db.Model(&models.RefreshToken{}).Where("token = ?", token).Update("revoked_at", &now).Error
}

// GenerateAndStoreWSTicket 生成并存储 WebSocket 票据。
func GenerateAndStoreWSTicket(db *gorm.DB, userID, roomID uint, secret string, ttlSeconds int) (string, error) {
	token, ticketID, expiresAt, err := GenerateWSTicket(userID, roomID, secret, ttlSeconds)
	if err != nil {
		return "", err
	}
	rec := models.WSTicket{TicketID: ticketID, UserID: userID, RoomID: roomID, ExpiresAt: expiresAt}
	if err := db.Create(&rec).Error; err != nil {
		return "", err
	}
	return token, nil
}

// ValidateAndConsumeWSTicket 验证并消费 WebSocket 票据。
func ValidateAndConsumeWSTicket(db *gorm.DB, tokenStr, secret string, roomID uint) (*WSTicketClaims, error) {
	claims, err := ParseWSTicket(tokenStr, secret)
	if err != nil {
		return nil, err
	}
	if claims.RoomID != roomID {
		return nil, errors.New("invalid ws ticket")
	}
	now := time.Now().UTC()
	result := db.Model(&models.WSTicket{}).
		Where("ticket_id = ? AND user_id = ? AND room_id = ? AND consumed_at IS NULL AND expires_at > ?", claims.ID, claims.UserID, claims.RoomID, now).
		Updates(map[string]any{"consumed_at": now})
	if result.Error != nil {
		return nil, result.Error
	}
	if result.RowsAffected != 1 {
		return nil, errors.New("invalid ws ticket")
	}
	return claims, nil
}
