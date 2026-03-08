package config

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
)

// Config 描述启动服务所需的关键参数。
type Config struct {
	Port                  string
	DatabaseDSN           string
	JWTSecret             string
	Env                   string
	LogLevel              string
	LogFormat             string
	AccessTokenTTLMinutes int
	RefreshTokenTTLDays   int
}

// IsDev 返回当前是否处于开发环境。
func (c Config) IsDev() bool { return c.Env == "dev" }

func getenv(key, def string) string {
	v := os.Getenv(key)
	if v == "" {
		return def
	}
	return v
}

func getenvInt(key string, def int) int {
	s := os.Getenv(key)
	if s == "" {
		return def
	}
	v, err := strconv.Atoi(s)
	if err != nil || v <= 0 {
		return def
	}
	return v
}

// Load 从环境变量读取配置，并为教学场景准备合理的默认值。
func Load() Config {
	return Config{
		Port:                  getenv("APP_PORT", "8080"),
		DatabaseDSN:           getenv("DATABASE_DSN", "host=localhost user=postgres password=postgres dbname=chatroom port=5432 sslmode=disable TimeZone=UTC"),
		JWTSecret:             getenv("JWT_SECRET", "dev-secret-change-me"),
		Env:                   getenv("APP_ENV", "dev"),
		LogLevel:              strings.ToLower(getenv("LOG_LEVEL", "info")),
		LogFormat:             strings.ToLower(getenv("LOG_FORMAT", "console")),
		AccessTokenTTLMinutes: getenvInt("ACCESS_TOKEN_TTL_MINUTES", 15),
		RefreshTokenTTLDays:   getenvInt("REFRESH_TOKEN_TTL_DAYS", 7),
	}
}

// Validate 校验配置合法性，返回首个遇到的错误。
func Validate(cfg Config) error {
	if cfg.Port == "" {
		return errors.New("APP_PORT must not be empty")
	}
	if cfg.DatabaseDSN == "" {
		return errors.New("DATABASE_DSN must not be empty")
	}
	if cfg.Env != "dev" && cfg.JWTSecret == "dev-secret-change-me" {
		return errors.New("JWT_SECRET is using the default value")
	}
	validLevels := map[string]bool{"trace": true, "debug": true, "info": true, "warn": true, "error": true, "fatal": true}
	if !validLevels[cfg.LogLevel] {
		return fmt.Errorf("LOG_LEVEL %q is invalid, expected one of: trace, debug, info, warn, error, fatal", cfg.LogLevel)
	}
	return nil
}
