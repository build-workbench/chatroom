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

type Claims struct {
	UserID uint `json:"uid"`
	jwt.RegisteredClaims
}

type WSTicketClaims struct {
	UserID uint   `json:"uid"`
	RoomID uint   `json:"rid"`
	Type   string `json:"typ"`
	jwt.RegisteredClaims
}

func HashPassword(pw string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	return string(b), err
}

func VerifyPassword(hash, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pw)) == nil
}

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

func ParseAccessToken(tokenStr, secret string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(token *jwt.Token) (interface{}, error) {
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

func ParseWSTicket(tokenStr, secret string) (*WSTicketClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &WSTicketClaims{}, func(token *jwt.Token) (interface{}, error) {
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

func SaveWSTicket(db *gorm.DB, ticketID string, userID, roomID uint, expiresAt time.Time) error {
	rec := models.WSTicket{TicketID: ticketID, UserID: userID, RoomID: roomID, ExpiresAt: expiresAt}
	return db.Create(&rec).Error
}

func ConsumeWSTicket(db *gorm.DB, ticketID string, userID, roomID uint) error {
	if db == nil {
		return errors.New("invalid ws ticket")
	}
	now := time.Now().UTC()
	result := db.Model(&models.WSTicket{}).
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

func GenerateAndStoreWSTicket(db *gorm.DB, userID, roomID uint, secret string, ttlSeconds int) (string, error) {
	token, ticketID, expiresAt, err := GenerateWSTicket(userID, roomID, secret, ttlSeconds)
	if err != nil {
		return "", err
	}
	if err := SaveWSTicket(db, ticketID, userID, roomID, expiresAt); err != nil {
		return "", err
	}
	return token, nil
}

func ValidateAndConsumeWSTicket(db *gorm.DB, tokenStr, secret string, roomID uint) (*WSTicketClaims, error) {
	claims, err := ParseWSTicket(tokenStr, secret)
	if err != nil {
		return nil, err
	}
	if claims.RoomID != roomID {
		return nil, errors.New("invalid ws ticket")
	}
	if err := ConsumeWSTicket(db, claims.ID, claims.UserID, claims.RoomID); err != nil {
		return nil, err
	}
	return claims, nil
}

func GenerateRefreshToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func SaveRefreshToken(db *gorm.DB, userID uint, token string, expiresAt time.Time) error {
	rt := models.RefreshToken{UserID: userID, Token: token, ExpiresAt: expiresAt}
	return db.Create(&rt).Error
}

func ValidateRefreshToken(db *gorm.DB, token string) (*models.RefreshToken, error) {
	var rt models.RefreshToken
	err := db.Where("token = ? AND revoked_at IS NULL AND expires_at > ?", token, time.Now()).First(&rt).Error
	if err != nil {
		return nil, err
	}
	return &rt, nil
}

func RevokeRefreshToken(db *gorm.DB, token string) error {
	now := time.Now()
	return db.Model(&models.RefreshToken{}).Where("token = ?", token).Update("revoked_at", &now).Error
}
