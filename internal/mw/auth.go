package mw

import (
	"net/http"
	"strings"

	"chatroom/internal/auth"
	"chatroom/internal/config"
	"chatroom/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ExtractBearerToken 从 Authorization 头中提取 Bearer Token。
func ExtractBearerToken(c *gin.Context) string {
	authz := c.GetHeader("Authorization")
	if len(authz) > 7 && strings.EqualFold(authz[:7], "bearer ") {
		return strings.TrimSpace(authz[7:])
	}
	return ""
}

// AuthMiddleware 校验 Bearer Token 并把用户信息塞进 Gin 上下文。
func AuthMiddleware(cfg config.Config, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr := ExtractBearerToken(c)
		if tokenStr == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		claims, err := auth.ParseAccessToken(tokenStr, cfg.JWTSecret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}
		var user models.User
		if err := db.First(&user, claims.UserID).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
			return
		}
		c.Set("userID", user.ID)
		c.Set("user", user)
		c.Next()
	}
}

// GetUserID 用于在 handler 中快速取得当前登录用户 ID。
func GetUserID(c *gin.Context) uint {
	if v, ok := c.Get("userID"); ok {
		if id, ok2 := v.(uint); ok2 {
			return id
		}
	}
	return 0
}
