package server

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"chatroom/internal/config"
	"chatroom/internal/metrics"
	"chatroom/internal/mw"
	"chatroom/internal/service"
	"chatroom/internal/ws"

	"github.com/gin-gonic/gin"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"golang.org/x/time/rate"
	"gorm.io/gorm"
)

// BuildInfo 携带构建时注入的版本信息，由 main 包通过 ldflags 设置后传入。
type BuildInfo struct {
	Version   string
	GitCommit string
	BuildTime string
	GoVersion string
}

func resolveAppRoot() string {
	baseDirs := []string{"."}
	if exePath, err := os.Executable(); err == nil {
		baseDirs = append(baseDirs, filepath.Dir(exePath))
	}
	baseDirs = append(baseDirs, "..", filepath.Join("..", ".."))

	seen := make(map[string]struct{}, len(baseDirs))
	for _, baseDir := range baseDirs {
		absBase, err := filepath.Abs(baseDir)
		if err != nil {
			continue
		}
		if _, ok := seen[absBase]; ok {
			continue
		}
		seen[absBase] = struct{}{}

		distDir := filepath.Join(absBase, "frontend", "dist")
		if _, err := os.Stat(filepath.Join(distDir, "index.html")); err == nil {
			return distDir
		}
	}
	for _, baseDir := range baseDirs {
		absBase, err := filepath.Abs(baseDir)
		if err != nil {
			continue
		}
		webDir := filepath.Join(absBase, "web")
		if _, err := os.Stat(filepath.Join(webDir, "index.html")); err == nil {
			return webDir
		}
	}
	return filepath.Join(".", "web")
}

func serveApp(c *gin.Context, rootDir string) {
	if c.Request.Method != http.MethodGet && c.Request.Method != http.MethodHead {
		c.Status(http.StatusNotFound)
		return
	}

	indexFile := filepath.Join(rootDir, "index.html")
	path := strings.TrimPrefix(filepath.Clean(c.Request.URL.Path), "/")
	if path == "." {
		path = ""
	}

	if path == "" {
		c.File(indexFile)
		return
	}

	if strings.HasPrefix(path, "api/") || path == "metrics" || path == "health" || path == "healthz" || path == "ready" || path == "version" || strings.HasPrefix(path, "ws") {
		c.Status(http.StatusNotFound)
		return
	}

	target := filepath.Join(rootDir, path)
	if fi, err := os.Stat(target); err == nil && !fi.IsDir() {
		c.File(target)
		return
	}

	if strings.Contains(path, ".") {
		c.Status(http.StatusNotFound)
		return
	}

	c.File(indexFile)
}

// SetupRouter 统一初始化 Gin 中间件、REST API 以及 WebSocket 端点。
// 返回的 cleanup 函数应在优雅停服时调用，用于释放后台 goroutine。
func SetupRouter(cfg config.Config, db *gorm.DB, hub *ws.Hub, bi BuildInfo) (*gin.Engine, func()) {
	userSvc := service.NewUserService(db, cfg)
	roomSvc := service.NewRoomService(db, hub)
	msgSvc := service.NewMessageService(db)

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(mw.CORS(cfg))
	r.Use(metrics.GinMiddleware())
	// 控制单个 IP+路由的速率，避免教学环境被刷爆。
	rlMW, rlStop := mw.RateLimit(rate.Every(time.Second/20), 40)
	r.Use(rlMW)

	rt := ws.NewRealtime(db, hub, cfg)
	hub.SetRealtime(rt)
	h := NewHandler(userSvc, roomSvc, msgSvc, db, cfg, bi)

	r.GET("/health", h.Health)
	r.GET("/healthz", h.Healthz)
	r.GET("/ready", h.Ready)
	r.GET("/version", h.Version)
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))

	api := r.Group("/api/v1")

	api.POST("/auth/register", h.Register)
	api.POST("/auth/login", h.Login)
	api.POST("/auth/refresh", h.RefreshToken)

	// 需要 Bearer Token 的业务接口。
	authed := api.Group("")
	authed.Use(mw.AuthMiddleware(cfg, db))

	authed.POST("/rooms", h.CreateRoom)
	authed.GET("/rooms", h.ListRooms)
	authed.GET("/rooms/:id/messages", h.ListMessages)
	authed.POST("/ws/tickets", h.CreateWSTicket)

	r.GET("/ws", ws.Serve(hub, db, cfg))

	appRoot := resolveAppRoot()
	r.NoRoute(func(c *gin.Context) {
		serveApp(c, appRoot)
	})
	return r, func() {
		rt.Close()
		rlStop()
	}
}
