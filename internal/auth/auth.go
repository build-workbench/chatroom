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

// --- 数据库操作接口（用于兼容旧代码）---

// WSTicketSaver 定义 WebSocket 票据保存接口。
type WSTicketSaver interface {
	SaveWSTicket(ticket *models.WSTicket) error
}

// WSTicketConsumer 定义 WebSocket 票据消费接口。
type WSTicketConsumer interface {
	ConsumeWSTicket(ticketID string, userID, roomID uint) error
}

// RefreshTokenSaver 定义刷新令牌保存接口。
type RefreshTokenSaver interface {
	SaveRefreshToken(token *models.RefreshToken) error
}

// RefreshTokenValidator 定义刷新令牌验证接口。
type RefreshTokenValidator interface {
	ValidateRefreshToken(token string) (*models.RefreshToken, error)
}

// RefreshTokenRevoker 定义刷新令牌撤销接口。
type RefreshTokenRevoker interface {
	RevokeRefreshToken(token string) error
}

// --- GORM 适配器（用于兼容旧代码）---

// GormAdapter 提供 gorm.DB 到各种接口的适配。
type GormAdapter struct {
	db *gorm.DB
}

func NewGormAdapter(db *gorm.DB) *GormAdapter {
	return &GormAdapter{db: db}
}

func (g *GormAdapter) SaveWSTicket(ticket *models.WSTicket) error {
	return g.db.Create(ticket).Error
}

func (g *GormAdapter) ConsumeWSTicket(ticketID string, userID, roomID uint) error {
	now := time.Now().UTC()
	result := g.db.Model(&models.WSTicket{}).
		Where("ticket_id = ? AND user_id = ? AND room_id = ? AND consumed_at IS NULL AND expires_at > ?", ticketID, userID, roomID, now).
		Updates(map[string]any{"consumed_at": now})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected != 1 {
		return errors.New("invalid ws ticket")
	}
	return nil
}

func (g *GormAdapter) SaveRefreshToken(token *models.RefreshToken) error {
	return g.db.Create(token).Error
}

func (g *GormAdapter) ValidateRefreshToken(token string) (*models.RefreshToken, error) {
	var rt models.RefreshToken
	err := g.db.Where("token = ? AND revoked_at IS NULL AND expires_at > ?", token, time.Now()).First(&rt).Error
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func (g *GormAdapter) RevokeRefreshToken(token string) error {
	now := time.Now()
	return g.db.Model(&models.RefreshToken{}).Where("token = ?", token).Update("revoked_at", &now).Error
}

// --- 兼容旧代码的组合函数 ---

// SaveWSTicket 保存 WebSocket 票据到数据库。
// 已废弃：使用 repository.WSTicketRepository.Save 替代。
func SaveWSTicket(saver WSTicketSaver, ticketID string, userID, roomID uint, expiresAt time.Time) error {
	rec := models.WSTicket{TicketID: ticketID, UserID: userID, RoomID: roomID, ExpiresAt: expiresAt}
	return saver.SaveWSTicket(&rec)
}

// ConsumeWSTicket 消费 WebSocket 票据。
// 已废弃：使用 repository.WSTicketRepository.Consume 替代。
func ConsumeWSTicket(consumer WSTicketConsumer, ticketID string, userID, roomID uint) error {
	return consumer.ConsumeWSTicket(ticketID, userID, roomID)
}

// SaveRefreshToken 保存刷新令牌到数据库。
// 已废弃：使用 repository.RefreshTokenRepository.Save 替代。
func SaveRefreshToken(saver RefreshTokenSaver, userID uint, token string, expiresAt time.Time) error {
	rt := models.RefreshToken{UserID: userID, Token: token, ExpiresAt: expiresAt}
	return saver.SaveRefreshToken(&rt)
}

// ValidateRefreshToken 验证刷新令牌。
// 已废弃：使用 repository.RefreshTokenRepository.Validate 替代。
func ValidateRefreshToken(validator RefreshTokenValidator, token string) (*models.RefreshToken, error) {
	return validator.ValidateRefreshToken(token)
}

// RevokeRefreshToken 撤销刷新令牌。
// 已废弃：使用 repository.RefreshTokenRepository.Revoke 替代。
func RevokeRefreshToken(revoker RefreshTokenRevoker, token string) error {
	return revoker.RevokeRefreshToken(token)
}

// GenerateAndStoreWSTicket 生成并存储 WebSocket 票据（兼容旧代码）。
func GenerateAndStoreWSTicket(db *gorm.DB, userID, roomID uint, secret string, ttlSeconds int) (string, error) {
	token, ticketID, expiresAt, err := GenerateWSTicket(userID, roomID, secret, ttlSeconds)
	if err != nil {
		return "", err
	}
	if err := SaveWSTicket(NewGormAdapter(db), ticketID, userID, roomID, expiresAt); err != nil {
		return "", err
	}
	return token, nil
}

// ValidateAndConsumeWSTicket 验证并消费 WebSocket 票据（兼容旧代码）。
func ValidateAndConsumeWSTicket(db *gorm.DB, tokenStr, secret string, roomID uint) (*WSTicketClaims, error) {
	claims, err := ParseWSTicket(tokenStr, secret)
	if err != nil {
		return nil, err
	}
	if claims.RoomID != roomID {
		return nil, errors.New("invalid ws ticket")
	}
	if err := ConsumeWSTicket(NewGormAdapter(db), claims.ID, claims.UserID, claims.RoomID); err != nil {
		return nil, err
	}
	return claims, nil
}
