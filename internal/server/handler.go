package server

import (
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"chatroom/internal/auth"
	"chatroom/internal/config"
	"chatroom/internal/mw"
	"chatroom/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

// UserService 定义用户业务接口。
type UserService interface {
	Register(username, password string) (*service.RegisterResult, error)
	Login(username, password string) (*service.LoginResult, error)
	RefreshTokens(oldRT string) (*service.RefreshResult, error)
}

// RoomService 定义房间业务接口。
type RoomService interface {
	Create(name string, ownerID uint) (*service.RoomDTO, error)
	List(limit int) ([]service.RoomDTO, error)
	Exists(roomID uint) (*service.RoomDTO, error)
}

// MessageService 定义消息业务接口。
type MessageService interface {
	ListByRoom(roomID uint, limit int, beforeID uint) ([]service.MessageDTO, error)
}

// Handler 聚合所有 HTTP handler，依赖注入 service 层。
type Handler struct {
	userSvc UserService
	roomSvc RoomService
	msgSvc  MessageService
	db      *gorm.DB
	cfg     config.Config
	bi      BuildInfo
}

func NewHandler(userSvc UserService, roomSvc RoomService, msgSvc MessageService, db *gorm.DB, cfg config.Config, bi BuildInfo) *Handler {
	return &Handler{userSvc: userSvc, roomSvc: roomSvc, msgSvc: msgSvc, db: db, cfg: cfg, bi: bi}
}

// --- 请求结构体 ---

type registerRequest struct {
	Username string `json:"username" binding:"required,min=2,max=64"`
	Password string `json:"password" binding:"required,min=4,max=128"`
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type refreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type createRoomRequest struct {
	Name string `json:"name" binding:"required,max=128"`
}

type createWSTicketRequest struct {
	RoomID uint `json:"room_id" binding:"required"`
}

// --- 运维端点 ---

// Health 返回存活状态。
func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "ok",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}

// Healthz 返回简洁的存活状态。
func (h *Handler) Healthz(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// Ready 检查数据库连通性，返回就绪状态。
func (h *Handler) Ready(c *gin.Context) {
	checks := make(map[string]string)

	sqlDB, err := h.db.DB()
	if err != nil {
		checks["database"] = "unhealthy"
		c.JSON(http.StatusServiceUnavailable, gin.H{"status": "not_ready", "checks": checks})
		return
	}
	if err := sqlDB.Ping(); err != nil {
		checks["database"] = "unhealthy"
		c.JSON(http.StatusServiceUnavailable, gin.H{"status": "not_ready", "checks": checks})
		return
	}
	checks["database"] = "healthy"
	c.JSON(http.StatusOK, gin.H{"status": "ready", "checks": checks})
}

// Version 返回构建版本信息。
func (h *Handler) Version(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"version":    h.bi.Version,
		"git_commit": h.bi.GitCommit,
		"build_time": h.bi.BuildTime,
		"go_version": h.bi.GoVersion,
	})
}

// --- 统一错误响应辅助 ---

func badRequest(c *gin.Context, msg string) {
	c.JSON(http.StatusBadRequest, gin.H{"error": msg})
}

func serverError(c *gin.Context, msg string) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
}

// --- Handler 方法 ---

// Register 处理用户注册请求。
func (h *Handler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "invalid payload")
		return
	}
	req.Username = strings.TrimSpace(req.Username)
	if req.Username == "" {
		badRequest(c, "invalid payload")
		return
	}
	result, err := h.userSvc.Register(req.Username, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrUsernameTaken) {
			c.JSON(http.StatusConflict, gin.H{"error": "username taken"})
			return
		}
		log.Error().Err(err).Str("username", req.Username).Msg("register")
		serverError(c, "failed to create user")
		return
	}
	c.JSON(http.StatusCreated, gin.H{"id": result.ID, "username": result.Username})
}

// Login 处理用户登录请求。
func (h *Handler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "invalid payload")
		return
	}
	req.Username = strings.TrimSpace(req.Username)
	if req.Username == "" {
		badRequest(c, "invalid payload")
		return
	}
	result, err := h.userSvc.Login(req.Username, req.Password)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		log.Error().Err(err).Str("username", req.Username).Msg("login")
		serverError(c, "login failed")
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"access_token":  result.AccessToken,
		"refresh_token": result.RefreshToken,
		"user":          gin.H{"id": result.User.ID, "username": result.User.Username},
	})
}

// RefreshToken 处理 token 刷新请求。
func (h *Handler) RefreshToken(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "invalid payload")
		return
	}
	result, err := h.userSvc.RefreshTokens(req.RefreshToken)
	if err != nil {
		log.Warn().Err(err).Msg("refresh token")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid refresh token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"access_token": result.AccessToken, "refresh_token": result.RefreshToken})
}

// CreateRoom 处理创建房间请求。
func (h *Handler) CreateRoom(c *gin.Context) {
	var req createRoomRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		badRequest(c, "invalid payload")
		return
	}
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		badRequest(c, "invalid payload")
		return
	}
	room, err := h.roomSvc.Create(req.Name, mw.GetUserID(c))
	if err != nil {
		if errors.Is(err, service.ErrRoomNameTaken) {
			c.JSON(http.StatusConflict, gin.H{"error": "room name taken"})
			return
		}
		log.Error().Err(err).Uint("owner_id", mw.GetUserID(c)).Str("name", req.Name).Msg("create room")
		serverError(c, "failed to create room")
		return
	}
	c.JSON(http.StatusCreated, gin.H{"room": gin.H{"id": room.ID, "name": room.Name}})
}

// ListRooms 处理获取房间列表请求。
func (h *Handler) ListRooms(c *gin.Context) {
	rooms, err := h.roomSvc.List(100)
	if err != nil {
		log.Error().Err(err).Msg("list rooms")
		serverError(c, "failed to list rooms")
		return
	}
	c.JSON(http.StatusOK, gin.H{"rooms": rooms})
}

// ListMessages 处理获取房间消息列表请求。
func (h *Handler) ListMessages(c *gin.Context) {
	roomID, err := strconv.Atoi(c.Param("id"))
	if err != nil || roomID <= 0 {
		badRequest(c, "invalid room id")
		return
	}
	if _, err := h.roomSvc.Exists(uint(roomID)); err != nil {
		if errors.Is(err, service.ErrRoomNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
			return
		}
		log.Error().Err(err).Int("room_id", roomID).Msg("check room before list messages")
		serverError(c, "failed to list messages")
		return
	}
	limit := 50
	if limitStr := c.Query("limit"); limitStr != "" {
		if v, e := strconv.Atoi(limitStr); e == nil && v > 0 && v <= 200 {
			limit = v
		}
	}
	var beforeID uint
	if bid := c.Query("before_id"); bid != "" {
		if v, e := strconv.Atoi(bid); e == nil && v > 0 {
			beforeID = uint(v)
		}
	}
	msgs, err := h.msgSvc.ListByRoom(uint(roomID), limit, beforeID)
	if err != nil {
		log.Error().Err(err).Int("room_id", roomID).Msg("list messages")
		serverError(c, "failed to list messages")
		return
	}
	c.JSON(http.StatusOK, gin.H{"messages": msgs})
}

func (h *Handler) CreateWSTicket(c *gin.Context) {
	var req createWSTicketRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.RoomID == 0 {
		badRequest(c, "invalid payload")
		return
	}
	if _, err := h.roomSvc.Exists(req.RoomID); err != nil {
		if errors.Is(err, service.ErrRoomNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
			return
		}
		log.Error().Err(err).Uint("room_id", req.RoomID).Msg("check room before issue ws ticket")
		serverError(c, "failed to create ws ticket")
		return
	}
	ticket, err := auth.GenerateAndStoreWSTicket(h.db, mw.GetUserID(c), req.RoomID, h.cfg.JWTSecret, h.cfg.WSTicketTTLSeconds)
	if err != nil {
		log.Error().Err(err).Uint("room_id", req.RoomID).Uint("user_id", mw.GetUserID(c)).Msg("create ws ticket")
		serverError(c, "failed to create ws ticket")
		return
	}
	c.JSON(http.StatusOK, gin.H{"ticket": ticket, "expires_in": h.cfg.WSTicketTTLSeconds})
}
