package config

import (
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
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
	AllowedOrigins        []string
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

func getenvCSV(key string) []string {
	raw := os.Getenv(key)
	if raw == "" {
		return nil
	}
	parts := strings.Split(raw, ",")
	values := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			values = append(values, part)
		}
	}
	return values
}

func formatURLHost(hostname, port string) string {
	if port != "" {
		return net.JoinHostPort(hostname, port)
	}
	if strings.Contains(hostname, ":") {
		return "[" + hostname + "]"
	}
	return hostname
}

// NormalizeOrigin 将来源地址标准化为可比较的 origin 字符串。
func NormalizeOrigin(origin string) (string, error) {
	if strings.TrimSpace(origin) == "" {
		return "", errors.New("origin must not be empty")
	}

	u, err := url.Parse(origin)
	if err != nil {
		return "", fmt.Errorf("invalid origin: %w", err)
	}
	if u.Scheme == "" || u.Host == "" {
		return "", errors.New("origin must include scheme and host")
	}
	if u.User != nil {
		return "", errors.New("origin must not include credentials")
	}
	if u.RawQuery != "" || u.Fragment != "" {
		return "", errors.New("origin must not include query or fragment")
	}
	if u.Path != "" && u.Path != "/" {
		return "", errors.New("origin must not include a path")
	}

	scheme := strings.ToLower(u.Scheme)
	if scheme != "http" && scheme != "https" {
		return "", errors.New("origin scheme must be http or https")
	}

	hostname := strings.ToLower(u.Hostname())
	if hostname == "" {
		return "", errors.New("origin must include a host")
	}
	port := u.Port()
	if (scheme == "http" && port == "80") || (scheme == "https" && port == "443") {
		port = ""
	}

	return (&url.URL{Scheme: scheme, Host: formatURLHost(hostname, port)}).String(), nil
}

func requestScheme(r *http.Request) string {
	if forwarded := r.Header.Get("X-Forwarded-Proto"); forwarded != "" {
		candidate := strings.ToLower(strings.TrimSpace(strings.Split(forwarded, ",")[0]))
		if candidate == "http" || candidate == "https" {
			return candidate
		}
	}

	if forwarded := r.Header.Get("Forwarded"); forwarded != "" {
		for _, field := range strings.Split(forwarded, ",") {
			for _, part := range strings.Split(field, ";") {
				part = strings.TrimSpace(part)
				if len(part) < 7 || !strings.EqualFold(part[:6], "proto=") {
					continue
				}
				candidate := strings.Trim(strings.ToLower(part[6:]), "\"")
				if candidate == "http" || candidate == "https" {
					return candidate
				}
			}
		}
	}

	if r.TLS != nil {
		return "https"
	}
	return "http"
}

// RequestOrigin 根据当前请求还原服务端自身的公开 origin。
func RequestOrigin(r *http.Request) string {
	if r == nil || strings.TrimSpace(r.Host) == "" {
		return ""
	}
	origin, err := NormalizeOrigin((&url.URL{Scheme: requestScheme(r), Host: r.Host}).String())
	if err != nil {
		return ""
	}
	return origin
}

// AllowsOrigin 判断给定来源是否满足当前配置的访问策略。
func (c Config) AllowsOrigin(origin string, r *http.Request) bool {
	if c.IsDev() {
		return true
	}

	normalizedOrigin, err := NormalizeOrigin(origin)
	if err != nil {
		return false
	}
	for _, allowedOrigin := range c.AllowedOrigins {
		normalizedAllowed, err := NormalizeOrigin(allowedOrigin)
		if err == nil && normalizedAllowed == normalizedOrigin {
			return true
		}
	}
	return normalizedOrigin == RequestOrigin(r)
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
		AllowedOrigins:        getenvCSV("ALLOWED_ORIGINS"),
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
	for _, origin := range cfg.AllowedOrigins {
		if _, err := NormalizeOrigin(origin); err != nil {
			return fmt.Errorf("ALLOWED_ORIGINS contains %q: %w", origin, err)
		}
	}
	validLevels := map[string]bool{"trace": true, "debug": true, "info": true, "warn": true, "error": true, "fatal": true}
	if !validLevels[cfg.LogLevel] {
		return fmt.Errorf("LOG_LEVEL %q is invalid, expected one of: trace, debug, info, warn, error, fatal", cfg.LogLevel)
	}
	return nil
}
