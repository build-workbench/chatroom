package mw

import (
	"net/http"

	"chatroom/internal/config"

	"github.com/gin-gonic/gin"
)

// CORS 返回一个支持跨域请求的中间件，dev 环境允许所有来源。
func CORS(cfg config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "" {
			c.Next()
			return
		}

		if !cfg.AllowsOrigin(origin, c.Request) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "origin not allowed"})
			return
		}

		c.Header("Vary", "Origin")
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
