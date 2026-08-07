package server

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"chatroom/internal/config"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRateLimit_AllowsUnderBurst(t *testing.T) {
	mw, cleanup := RateLimit(rate.Limit(100), 5)
	defer cleanup()

	for range 5 {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest(http.MethodGet, "/test", nil)
		c.Request.RemoteAddr = "1.2.3.4:1234"
		mw(c)
		if w.Code == 429 {
			t.Fatal("request within burst was rate-limited")
		}
	}
}

func TestRateLimit_BlocksOverBurst(t *testing.T) {
	mw, cleanup := RateLimit(rate.Limit(1), 3)
	defer cleanup()

	blocked := false
	for range 10 {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest(http.MethodGet, "/test", nil)
		c.Request.RemoteAddr = "1.2.3.4:1234"
		mw(c)
		if w.Code == 429 {
			blocked = true
			break
		}
	}
	if !blocked {
		t.Error("expected at least one 429 after exceeding burst, got none")
	}
}

func TestRateLimit_PerKeyIsolation(t *testing.T) {
	mw, cleanup := RateLimit(rate.Limit(1), 2)
	defer cleanup()

	// IP A 耗尽 burst
	for range 2 {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest(http.MethodGet, "/test", nil)
		c.Request.RemoteAddr = "1.1.1.1:1234"
		mw(c)
	}

	// IP B 应该不受影响
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/test", nil)
	c.Request.RemoteAddr = "2.2.2.2:5678"
	mw(c)
	if w.Code == 429 {
		t.Error("IP B was rate-limited due to IP A's consumption")
	}
}

func TestCORS_DevAllowsAll(t *testing.T) {
	cfg := config.Config{Env: "dev"}
	mw := CORS(cfg)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	c.Request.Header.Set("Origin", "http://evil.com")
	mw(c)

	if w.Code == http.StatusForbidden {
		t.Error("dev mode should allow all origins")
	}
	if w.Header().Get("Access-Control-Allow-Origin") != "http://evil.com" {
		t.Errorf("ACAO = %q, want http://evil.com", w.Header().Get("Access-Control-Allow-Origin"))
	}
}

func TestCORS_NoOriginHeader(t *testing.T) {
	cfg := config.Config{Env: "production", AllowedOrigins: []string{"https://example.com"}}
	mw := CORS(cfg)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	// 不设置 Origin 头
	mw(c)

	// 无 Origin 头时应直接放行（非跨域请求）
	if w.Code == http.StatusForbidden {
		t.Error("request without Origin should not be blocked")
	}
}

func TestCORS_ProductionBlocksUnknownOrigin(t *testing.T) {
	cfg := config.Config{Env: "production", AllowedOrigins: []string{"https://example.com"}}
	mw := CORS(cfg)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	c.Request.Header.Set("Origin", "https://evil.com")
	mw(c)

	if w.Code != http.StatusForbidden {
		t.Errorf("status = %d, want 403 for unknown origin in production", w.Code)
	}
}

func TestCORS_ProductionAllowsKnownOrigin(t *testing.T) {
	cfg := config.Config{Env: "production", AllowedOrigins: []string{"https://example.com"}}
	mw := CORS(cfg)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
	c.Request.Header.Set("Origin", "https://example.com")
	mw(c)

	if w.Code == http.StatusForbidden {
		t.Error("known origin should be allowed in production")
	}
}

func TestExtractBearerToken(t *testing.T) {
	tests := []struct {
		header string
		want   string
	}{
		{"Bearer abc123", "abc123"},
		{"bearer xyz", "xyz"},
		{"BEARER token", "token"},
		{"Basic abc", ""},
		{"", ""},
		{"short", ""},
	}

	for _, tt := range tests {
		w := httptest.NewRecorder()
		c, _ := gin.CreateTestContext(w)
		c.Request = httptest.NewRequest(http.MethodGet, "/", nil)
		if tt.header != "" {
			c.Request.Header.Set("Authorization", tt.header)
		}
		got := ExtractBearerToken(c)
		if got != tt.want {
			t.Errorf("ExtractBearerToken(%q) = %q, want %q", tt.header, got, tt.want)
		}
	}
}

func TestClientIP(t *testing.T) {
	tests := []struct {
		remote string
		want   string
	}{
		{"1.2.3.4:1234", "1.2.3.4"},
		{"[::1]:8080", "::1"},
		{"no-port", "no-port"},
	}

	for _, tt := range tests {
		got := clientIP(tt.remote)
		if got != tt.want {
			t.Errorf("clientIP(%q) = %q, want %q", tt.remote, got, tt.want)
		}
	}
}
