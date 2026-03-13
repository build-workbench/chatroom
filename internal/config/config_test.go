package config

import (
	"net/http/httptest"
	"os"
	"testing"
)

func TestLoad_Defaults(t *testing.T) {
	// Clear environment variables
	os.Unsetenv("APP_PORT")
	os.Unsetenv("DATABASE_DSN")
	os.Unsetenv("JWT_SECRET")
	os.Unsetenv("APP_ENV")
	os.Unsetenv("ACCESS_TOKEN_TTL_MINUTES")
	os.Unsetenv("REFRESH_TOKEN_TTL_DAYS")
	os.Unsetenv("LOG_LEVEL")
	os.Unsetenv("LOG_FORMAT")
	os.Unsetenv("ALLOWED_ORIGINS")

	cfg := Load()

	if cfg.Port != "8080" {
		t.Errorf("Load() Port = %v, want 8080", cfg.Port)
	}
	if cfg.Env != "dev" {
		t.Errorf("Load() Env = %v, want dev", cfg.Env)
	}
	if cfg.AccessTokenTTLMinutes != 15 {
		t.Errorf("Load() AccessTokenTTLMinutes = %v, want 15", cfg.AccessTokenTTLMinutes)
	}
	if cfg.RefreshTokenTTLDays != 7 {
		t.Errorf("Load() RefreshTokenTTLDays = %v, want 7", cfg.RefreshTokenTTLDays)
	}
	if cfg.LogLevel != "info" {
		t.Errorf("Load() LogLevel = %v, want info", cfg.LogLevel)
	}
	if cfg.LogFormat != "console" {
		t.Errorf("Load() LogFormat = %v, want console", cfg.LogFormat)
	}
	if len(cfg.AllowedOrigins) != 0 {
		t.Errorf("Load() AllowedOrigins = %v, want empty", cfg.AllowedOrigins)
	}
}

func TestLoad_FromEnv(t *testing.T) {
	os.Setenv("APP_PORT", "9090")
	os.Setenv("DATABASE_DSN", "postgres://test:test@localhost/test")
	os.Setenv("JWT_SECRET", "my-secret")
	os.Setenv("APP_ENV", "prod")
	os.Setenv("ACCESS_TOKEN_TTL_MINUTES", "30")
	os.Setenv("REFRESH_TOKEN_TTL_DAYS", "14")
	os.Setenv("ALLOWED_ORIGINS", "https://chat.example.com, https://app.example.com:8443")
	defer func() {
		os.Unsetenv("APP_PORT")
		os.Unsetenv("DATABASE_DSN")
		os.Unsetenv("JWT_SECRET")
		os.Unsetenv("APP_ENV")
		os.Unsetenv("ACCESS_TOKEN_TTL_MINUTES")
		os.Unsetenv("REFRESH_TOKEN_TTL_DAYS")
		os.Unsetenv("ALLOWED_ORIGINS")
	}()

	cfg := Load()

	if cfg.Port != "9090" {
		t.Errorf("Load() Port = %v, want 9090", cfg.Port)
	}
	if cfg.DatabaseDSN != "postgres://test:test@localhost/test" {
		t.Errorf("Load() DatabaseDSN = %v, want postgres://test:test@localhost/test", cfg.DatabaseDSN)
	}
	if cfg.JWTSecret != "my-secret" {
		t.Errorf("Load() JWTSecret = %v, want my-secret", cfg.JWTSecret)
	}
	if cfg.Env != "prod" {
		t.Errorf("Load() Env = %v, want prod", cfg.Env)
	}
	if cfg.AccessTokenTTLMinutes != 30 {
		t.Errorf("Load() AccessTokenTTLMinutes = %v, want 30", cfg.AccessTokenTTLMinutes)
	}
	if cfg.RefreshTokenTTLDays != 14 {
		t.Errorf("Load() RefreshTokenTTLDays = %v, want 14", cfg.RefreshTokenTTLDays)
	}
	if len(cfg.AllowedOrigins) != 2 {
		t.Fatalf("Load() AllowedOrigins len = %d, want 2", len(cfg.AllowedOrigins))
	}
	if cfg.AllowedOrigins[0] != "https://chat.example.com" {
		t.Errorf("Load() AllowedOrigins[0] = %q, want https://chat.example.com", cfg.AllowedOrigins[0])
	}
	if cfg.AllowedOrigins[1] != "https://app.example.com:8443" {
		t.Errorf("Load() AllowedOrigins[1] = %q, want https://app.example.com:8443", cfg.AllowedOrigins[1])
	}
}

func TestLoad_InvalidTTL(t *testing.T) {
	os.Setenv("ACCESS_TOKEN_TTL_MINUTES", "invalid")
	os.Setenv("REFRESH_TOKEN_TTL_DAYS", "-5")
	defer func() {
		os.Unsetenv("ACCESS_TOKEN_TTL_MINUTES")
		os.Unsetenv("REFRESH_TOKEN_TTL_DAYS")
	}()

	cfg := Load()

	// Should fall back to defaults
	if cfg.AccessTokenTTLMinutes != 15 {
		t.Errorf("Load() AccessTokenTTLMinutes = %v, want 15 (default)", cfg.AccessTokenTTLMinutes)
	}
	if cfg.RefreshTokenTTLDays != 7 {
		t.Errorf("Load() RefreshTokenTTLDays = %v, want 7 (default)", cfg.RefreshTokenTTLDays)
	}
}

func TestNormalizeOrigin(t *testing.T) {
	tests := []struct {
		name    string
		origin  string
		want    string
		wantErr bool
	}{
		{name: "normalizes host casing", origin: "HTTPS://Chat.Example.com", want: "https://chat.example.com"},
		{name: "drops default https port", origin: "https://chat.example.com:443", want: "https://chat.example.com"},
		{name: "keeps custom port", origin: "https://chat.example.com:8443", want: "https://chat.example.com:8443"},
		{name: "rejects path", origin: "https://chat.example.com/app", wantErr: true},
		{name: "rejects query", origin: "https://chat.example.com?x=1", wantErr: true},
		{name: "rejects unsupported scheme", origin: "ws://chat.example.com", wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := NormalizeOrigin(tt.origin)
			if (err != nil) != tt.wantErr {
				t.Fatalf("NormalizeOrigin() error = %v, wantErr %v", err, tt.wantErr)
			}
			if got != tt.want {
				t.Errorf("NormalizeOrigin() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestRequestOrigin(t *testing.T) {
	req := httptest.NewRequest("GET", "http://internal.test/health", nil)
	req.Host = "chat.example.com"
	req.Header.Set("X-Forwarded-Proto", "https")

	if got := RequestOrigin(req); got != "https://chat.example.com" {
		t.Errorf("RequestOrigin() = %q, want %q", got, "https://chat.example.com")
	}
}

func TestAllowsOrigin(t *testing.T) {
	req := httptest.NewRequest("GET", "http://internal.test/health", nil)
	req.Host = "chat.example.com"
	req.Header.Set("X-Forwarded-Proto", "https")

	cfg := Config{Env: "prod", AllowedOrigins: []string{"https://app.example.com", "https://chat.example.com"}}
	if !cfg.AllowsOrigin("https://app.example.com", req) {
		t.Error("AllowsOrigin() should accept explicit allowlist origin")
	}
	if !cfg.AllowsOrigin("https://chat.example.com", req) {
		t.Error("AllowsOrigin() should accept same-origin request")
	}
	if cfg.AllowsOrigin("https://chat.example.com.evil.test", req) {
		t.Error("AllowsOrigin() should reject substring-matched origin")
	}
	if cfg.AllowsOrigin("https://evil.test", req) {
		t.Error("AllowsOrigin() should reject unknown origin")
	}
}

func TestValidate(t *testing.T) {
	tests := []struct {
		name    string
		cfg     Config
		wantErr bool
	}{
		{
			name: "valid dev config",
			cfg: Config{
				Port:        "8080",
				DatabaseDSN: "postgres://localhost/test",
				JWTSecret:   "dev-secret-change-me",
				Env:         "dev",
				LogLevel:    "info",
			},
			wantErr: false,
		},
		{
			name: "valid prod config",
			cfg: Config{
				Port:           "8080",
				DatabaseDSN:    "postgres://localhost/test",
				JWTSecret:      "production-secret-key",
				Env:            "prod",
				LogLevel:       "info",
				AllowedOrigins: []string{"https://chat.example.com"},
			},
			wantErr: false,
		},
		{
			name: "empty port",
			cfg: Config{
				Port:        "",
				DatabaseDSN: "postgres://localhost/test",
				JWTSecret:   "secret",
				Env:         "dev",
				LogLevel:    "info",
			},
			wantErr: true,
		},
		{
			name: "empty dsn",
			cfg: Config{
				Port:        "8080",
				DatabaseDSN: "",
				JWTSecret:   "secret",
				Env:         "dev",
				LogLevel:    "info",
			},
			wantErr: true,
		},
		{
			name: "default secret in prod",
			cfg: Config{
				Port:        "8080",
				DatabaseDSN: "postgres://localhost/test",
				JWTSecret:   "dev-secret-change-me",
				Env:         "prod",
				LogLevel:    "info",
			},
			wantErr: true,
		},
		{
			name: "default secret in test env",
			cfg: Config{
				Port:        "8080",
				DatabaseDSN: "postgres://localhost/test",
				JWTSecret:   "dev-secret-change-me",
				Env:         "test",
				LogLevel:    "info",
			},
			wantErr: true,
		},
		{
			name: "invalid log level",
			cfg: Config{
				Port:        "8080",
				DatabaseDSN: "postgres://localhost/test",
				JWTSecret:   "dev-secret-change-me",
				Env:         "dev",
				LogLevel:    "invalid",
			},
			wantErr: true,
		},
		{
			name: "invalid allowed origin",
			cfg: Config{
				Port:           "8080",
				DatabaseDSN:    "postgres://localhost/test",
				JWTSecret:      "production-secret-key",
				Env:            "prod",
				LogLevel:       "info",
				AllowedOrigins: []string{"https://chat.example.com/app"},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := Validate(tt.cfg)
			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidate_ProductionJWTSecret(t *testing.T) {
	// This test specifically validates Property 6: Production JWT Secret Validation
	cfg := Config{
		Port:        "8080",
		DatabaseDSN: "postgres://localhost/test",
		JWTSecret:   "dev-secret-change-me", // Default value
		Env:         "prod",
		LogLevel:    "info",
	}

	err := Validate(cfg)
	if err == nil {
		t.Error("Validate() should reject default JWT secret in production")
	}
}
