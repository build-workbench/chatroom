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

// AuthMiddleware 校验 Bearer Token 并把用户信息塞进 Gin 上下文。
func AuthMiddleware(cfg config.Config, db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		authz := c.GetHeader("Authorization")
		if authz == "" || !strings.HasPrefix(strings.ToLower(authz), "bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}
		tokenStr := strings.TrimSpace(authz[len("Bearer "):])
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
