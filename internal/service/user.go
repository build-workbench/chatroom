package service

import (
	"errors"
	"time"

	"chatroom/internal/auth"
	"chatroom/internal/config"
	"chatroom/internal/db"
	"chatroom/internal/models"
	"chatroom/internal/repository"

	"gorm.io/gorm"
)

// UserService 封装用户相关的业务逻辑。
type UserService struct {
	userRepo repository.UserRepository
	rtRepo   repository.RefreshTokenRepository
	cfg      config.Config
}

func NewUserService(userRepo repository.UserRepository, rtRepo repository.RefreshTokenRepository, cfg config.Config) *UserService {
	return &UserService{userRepo: userRepo, rtRepo: rtRepo, cfg: cfg}
}

// RegisterResult 注册成功后返回的数据。
type RegisterResult struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
}

// Register 注册新用户，返回用户 ID 和用户名。
// 依赖数据库唯一索引检测重复用户名，避免 check-then-create 竞态。
func (s *UserService) Register(username, password string) (*RegisterResult, error) {
	hash, err := auth.HashPassword(password)
	if err != nil {
		return nil, err
	}
	user := &models.User{Username: username, PasswordHash: hash}
	if err := s.userRepo.Create(user); err != nil {
		if db.IsUniqueViolation(err) {
			return nil, ErrUsernameTaken
		}
		return nil, ErrInternal
	}
	return &RegisterResult{ID: user.ID, Username: user.Username}, nil
}

// LoginResult 登录成功后返回的数据。
type LoginResult struct {
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
	User         models.User `json:"-"`
}

// Login 校验用户名密码并签发 token 对。
func (s *UserService) Login(username, password string) (*LoginResult, error) {
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		if db.IsNotFound(err) {
			return nil, ErrInvalidCredentials
		}
		return nil, ErrInternal
	}
	if !auth.VerifyPassword(user.PasswordHash, password) {
		return nil, ErrInvalidCredentials
	}
	at, err := auth.GenerateAccessToken(user.ID, s.cfg.JWTSecret, s.cfg.AccessTokenTTLMinutes)
	if err != nil {
		return nil, err
	}
	rt, err := auth.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}
	exp := time.Now().Add(time.Duration(s.cfg.RefreshTokenTTLDays) * 24 * time.Hour)
	if err := s.rtRepo.Save(&models.RefreshToken{UserID: user.ID, Token: rt, ExpiresAt: exp}); err != nil {
		return nil, ErrInternal
	}
	return &LoginResult{AccessToken: at, RefreshToken: rt, User: *user}, nil
}

// RefreshResult 刷新 token 后返回的新 token 对。
type RefreshResult struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// RefreshTokens 验证旧 refresh token 并签发新 token 对（旋转刷新）。
func (s *UserService) RefreshTokens(oldRT string) (*RefreshResult, error) {
	rec, err := s.rtRepo.Validate(oldRT)
	if err != nil {
		if db.IsNotFound(err) {
			return nil, ErrInvalidToken
		}
		return nil, ErrInternal
	}
	if err := s.rtRepo.Revoke(oldRT); err != nil {
		return nil, ErrInternal
	}
	at, err := auth.GenerateAccessToken(rec.UserID, s.cfg.JWTSecret, s.cfg.AccessTokenTTLMinutes)
	if err != nil {
		return nil, err
	}
	newRT, err := auth.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}
	exp := time.Now().Add(time.Duration(s.cfg.RefreshTokenTTLDays) * 24 * time.Hour)
	if err := s.rtRepo.Save(&models.RefreshToken{UserID: rec.UserID, Token: newRT, ExpiresAt: exp}); err != nil {
		return nil, ErrInternal
	}
	return &RefreshResult{AccessToken: at, RefreshToken: newRT}, nil
}

// --- 兼容旧 API 的构造函数（后续可移除）---

// UserServiceLegacy 使用 gorm.DB 的旧构造函数，用于渐进式迁移。
type UserServiceLegacy struct {
	db  *gorm.DB
	cfg config.Config
}

func NewUserServiceLegacy(gormDB *gorm.DB, cfg config.Config) *UserServiceLegacy {
	return &UserServiceLegacy{db: gormDB, cfg: cfg}
}

func (s *UserServiceLegacy) Register(username, password string) (*RegisterResult, error) {
	hash, err := auth.HashPassword(password)
	if err != nil {
		return nil, err
	}
	user := models.User{Username: username, PasswordHash: hash}
	if err := s.db.Create(&user).Error; err != nil {
		if db.IsUniqueViolation(err) {
			return nil, ErrUsernameTaken
		}
		return nil, ErrInternal
	}
	return &RegisterResult{ID: user.ID, Username: user.Username}, nil
}

func (s *UserServiceLegacy) Login(username, password string) (*LoginResult, error) {
	var user models.User
	if err := s.db.Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidCredentials
		}
		return nil, ErrInternal
	}
	if !auth.VerifyPassword(user.PasswordHash, password) {
		return nil, ErrInvalidCredentials
	}
	at, err := auth.GenerateAccessToken(user.ID, s.cfg.JWTSecret, s.cfg.AccessTokenTTLMinutes)
	if err != nil {
		return nil, err
	}
	rt, err := auth.GenerateRefreshToken()
	if err != nil {
		return nil, err
	}
	exp := time.Now().Add(time.Duration(s.cfg.RefreshTokenTTLDays) * 24 * time.Hour)
	if err := auth.SaveRefreshToken(auth.NewGormAdapter(s.db), user.ID, rt, exp); err != nil {
		return nil, ErrInternal
	}
	return &LoginResult{AccessToken: at, RefreshToken: rt, User: user}, nil
}

func (s *UserServiceLegacy) RefreshTokens(oldRT string) (*RefreshResult, error) {
	var result RefreshResult
	err := s.db.Transaction(func(tx *gorm.DB) error {
		adapter := auth.NewGormAdapter(tx)
		rec, err := auth.ValidateRefreshToken(adapter, oldRT)
		if err != nil {
			return err
		}
		if err := auth.RevokeRefreshToken(adapter, oldRT); err != nil {
			return err
		}
		at, err := auth.GenerateAccessToken(rec.UserID, s.cfg.JWTSecret, s.cfg.AccessTokenTTLMinutes)
		if err != nil {
			return err
		}
		newRT, err := auth.GenerateRefreshToken()
		if err != nil {
			return err
		}
		exp := time.Now().Add(time.Duration(s.cfg.RefreshTokenTTLDays) * 24 * time.Hour)
		if err := auth.SaveRefreshToken(adapter, rec.UserID, newRT, exp); err != nil {
			return err
		}
		result.AccessToken = at
		result.RefreshToken = newRT
		return nil
	})
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrInvalidToken
		}
		return nil, ErrInternal
	}
	return &result, nil
}
