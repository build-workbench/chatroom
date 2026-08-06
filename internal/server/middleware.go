package server

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"chatroom/internal/auth"
	"chatroom/internal/config"
	"chatroom/internal/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
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

type keyLimiter struct {
	lim *rate.Limiter
	ts  time.Time
}

type RL struct {
	mu   sync.Mutex
	m    map[string]*keyLimiter
	r    rate.Limit
	b    int
	ttl  time.Duration
	stop chan struct{}
}

func NewRateLimiter(r rate.Limit, burst int, ttl time.Duration) *RL {
	return &RL{m: make(map[string]*keyLimiter), r: r, b: burst, ttl: ttl, stop: make(chan struct{})}
}

func (rl *RL) get(key string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	kl, ok := rl.m[key]
	if ok {
		kl.ts = time.Now()
		return kl.lim
	}
	lim := rate.NewLimiter(rl.r, rl.b)
	rl.m[key] = &keyLimiter{lim: lim, ts: time.Now()}
	return lim
}

func (rl *RL) gc() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-rl.stop:
			return
		case <-ticker.C:
			now := time.Now()
			rl.mu.Lock()
			for k, v := range rl.m {
				if now.Sub(v.ts) > rl.ttl {
					delete(rl.m, k)
				}
			}
			rl.mu.Unlock()
		}
	}
}

// Stop 停止 GC goroutine，用于优雅停服。
func (rl *RL) Stop() {
	select {
	case <-rl.stop:
	default:
		close(rl.stop)
	}
}

// RateLimit 返回一个基于 IP+路径的令牌桶限速中间件，以及一个用于优雅停服时
// 停止 GC goroutine 的 cleanup 函数。
func RateLimit(r rate.Limit, burst int) (middleware gin.HandlerFunc, cleanup func()) {
	rl := NewRateLimiter(r, burst, 2*time.Minute)
	go rl.gc()
	middleware = func(c *gin.Context) {
		ip := clientIP(c.Request.RemoteAddr)
		key := ip + "|" + c.FullPath()
		if key == "|" {
			key = ip + "|" + c.Request.URL.Path
		}
		lim := rl.get(key)
		if !lim.Allow() {
			c.AbortWithStatusJSON(429, gin.H{"error": "too many requests"})
			return
		}
		c.Next()
	}
	return middleware, rl.Stop
}

func clientIP(remote string) string {
	host, _, err := net.SplitHostPort(remote)
	if err != nil {
		return remote
	}
	return host
}
