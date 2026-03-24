package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"

	"chatroom/internal/config"
	"chatroom/internal/models"
	"chatroom/internal/ws"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		if strings.Contains(err.Error(), "requires cgo") {
			t.Skipf("skipping router tests in current environment: %v", err)
		}
		t.Fatalf("failed to connect to test database: %v", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.Room{}, &models.Message{}, &models.RefreshToken{}, &models.WSTicket{})
	if err != nil {
		t.Fatalf("failed to migrate test database: %v", err)
	}

	return db
}

func setupTestRouterWithConfig(t *testing.T, cfg config.Config) (*gorm.DB, *http.Handler) {
	t.Helper()
	db := setupTestDB(t)
	hub := ws.NewHub()
	bi := BuildInfo{Version: "test", GitCommit: "abc123", BuildTime: "now", GoVersion: "go1.24"}
	router, rlStop := SetupRouter(cfg, db, hub, bi)
	t.Cleanup(rlStop)
	var handler http.Handler = router
	return db, &handler
}

func setupTestRouter(t *testing.T) (*gorm.DB, *http.Handler) {
	t.Helper()
	return setupTestRouterWithConfig(t, config.Config{
		Port:                  "8080",
		DatabaseDSN:           "test",
		JWTSecret:             "test-secret",
		Env:                   "test",
		LogLevel:              "info",
		LogFormat:             "console",
		AccessTokenTTLMinutes: 15,
		RefreshTokenTTLDays:   7,
	})
}

func TestHealthEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("GET /health status = %d, want %d", w.Code, http.StatusOK)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if resp["status"] != "ok" {
		t.Errorf("GET /health status = %v, want ok", resp["status"])
	}

	if _, ok := resp["timestamp"]; !ok {
		t.Error("GET /health should include timestamp")
	}
}

func TestCORSAllowsConfiguredOrigin(t *testing.T) {
	_, handler := setupTestRouterWithConfig(t, config.Config{
		Port:                  "8080",
		DatabaseDSN:           "test",
		JWTSecret:             "test-secret",
		Env:                   "prod",
		LogLevel:              "info",
		LogFormat:             "console",
		AccessTokenTTLMinutes: 15,
		RefreshTokenTTLDays:   7,
		AllowedOrigins:        []string{"https://app.example.com"},
	})

	req := httptest.NewRequest(http.MethodOptions, "/api/v1/auth/login", nil)
	req.Host = "chat.example.com"
	req.Header.Set("Origin", "https://app.example.com")
	req.Header.Set("Access-Control-Request-Method", http.MethodPost)
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusNoContent {
		t.Fatalf("OPTIONS /api/v1/auth/login status = %d, want %d", w.Code, http.StatusNoContent)
	}
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "https://app.example.com" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, "https://app.example.com")
	}
}

func TestCORSRejectsSubstringOrigin(t *testing.T) {
	_, handler := setupTestRouterWithConfig(t, config.Config{
		Port:                  "8080",
		DatabaseDSN:           "test",
		JWTSecret:             "test-secret",
		Env:                   "prod",
		LogLevel:              "info",
		LogFormat:             "console",
		AccessTokenTTLMinutes: 15,
		RefreshTokenTTLDays:   7,
	})

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	req.Host = "chat.example.com"
	req.Header.Set("X-Forwarded-Proto", "https")
	req.Header.Set("Origin", "https://chat.example.com.evil.test")
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("GET /health status = %d, want %d", w.Code, http.StatusForbidden)
	}
}

func TestCORSAllowsSameOrigin(t *testing.T) {
	_, handler := setupTestRouterWithConfig(t, config.Config{
		Port:                  "8080",
		DatabaseDSN:           "test",
		JWTSecret:             "test-secret",
		Env:                   "prod",
		LogLevel:              "info",
		LogFormat:             "console",
		AccessTokenTTLMinutes: 15,
		RefreshTokenTTLDays:   7,
	})

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	req.Host = "chat.example.com"
	req.Header.Set("X-Forwarded-Proto", "https")
	req.Header.Set("Origin", "https://chat.example.com")
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("GET /health status = %d, want %d", w.Code, http.StatusOK)
	}
	if got := w.Header().Get("Access-Control-Allow-Origin"); got != "https://chat.example.com" {
		t.Errorf("Access-Control-Allow-Origin = %q, want %q", got, "https://chat.example.com")
	}
}

func TestServeAppRejectsReservedRoutes(t *testing.T) {
	tmpDir := t.TempDir()
	if err := os.WriteFile(filepath.Join(tmpDir, "index.html"), []byte("<html>spa</html>"), 0o600); err != nil {
		t.Fatalf("failed to write index.html: %v", err)
	}

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.NoRoute(func(c *gin.Context) {
		serveApp(c, tmpDir)
	})

	for _, path := range []string{"/api/v1/auth/login", "/health", "/ready", "/metrics", "/ws"} {
		t.Run(path, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, path, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)
			if w.Code != http.StatusNotFound {
				t.Fatalf("GET %s status = %d, want %d", path, w.Code, http.StatusNotFound)
			}
		})
	}
}

func TestServeAppServesSPAIndexForUnknownRoute(t *testing.T) {
	tmpDir := t.TempDir()
	indexPath := filepath.Join(tmpDir, "index.html")
	if err := os.WriteFile(indexPath, []byte("<html>spa</html>"), 0o600); err != nil {
		t.Fatalf("failed to write index.html: %v", err)
	}

	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.NoRoute(func(c *gin.Context) {
		serveApp(c, tmpDir)
	})

	req := httptest.NewRequest(http.MethodGet, "/rooms/general", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("GET /rooms/general status = %d, want %d", w.Code, http.StatusOK)
	}
	if body := w.Body.String(); !strings.Contains(body, "spa") {
		t.Fatalf("GET /rooms/general body = %q, want SPA index content", body)
	}
}

func TestHealthzEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("GET /healthz status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestReadyEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/ready", nil)
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("GET /ready status = %d, want %d", w.Code, http.StatusOK)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if resp["status"] != "ready" {
		t.Errorf("GET /ready status = %v, want ready", resp["status"])
	}
}

func TestVersionEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/version", nil)
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("GET /version status = %d, want %d", w.Code, http.StatusOK)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	requiredFields := []string{"version", "git_commit", "build_time", "go_version"}
	for _, field := range requiredFields {
		if _, ok := resp[field]; !ok {
			t.Errorf("GET /version missing field: %s", field)
		}
	}
}

func TestRegisterEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	tests := []struct {
		name       string
		body       string
		wantStatus int
	}{
		{
			name:       "valid registration",
			body:       `{"username":"testuser","password":"testpass"}`,
			wantStatus: http.StatusCreated,
		},
		{
			name:       "empty username",
			body:       `{"username":"","password":"testpass"}`,
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "empty password",
			body:       `{"username":"testuser","password":""}`,
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "short username",
			body:       `{"username":"a","password":"testpass"}`,
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "short password",
			body:       `{"username":"testuser","password":"abc"}`,
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "invalid json",
			body:       `{invalid}`,
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			(*handler).ServeHTTP(w, req)

			if w.Code != tt.wantStatus {
				t.Errorf("POST /api/v1/auth/register status = %d, want %d, body = %s", w.Code, tt.wantStatus, w.Body.String())
			}
		})
	}
}

func TestRegisterDuplicateUsername(t *testing.T) {
	_, handler := setupTestRouter(t)

	body := `{"username":"duplicate","password":"testpass"}`

	// First registration should succeed
	req1 := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(body))
	req1.Header.Set("Content-Type", "application/json")
	w1 := httptest.NewRecorder()
	(*handler).ServeHTTP(w1, req1)

	if w1.Code != http.StatusCreated {
		t.Fatalf("First registration failed: %d", w1.Code)
	}

	// Second registration should fail
	req2 := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(body))
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()
	(*handler).ServeHTTP(w2, req2)

	if w2.Code != http.StatusConflict {
		t.Errorf("Duplicate registration status = %d, want %d", w2.Code, http.StatusConflict)
	}
}

func TestLoginEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	// Register a user first
	regBody := `{"username":"logintest","password":"testpass"}`
	regReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	(*handler).ServeHTTP(regW, regReq)

	tests := []struct {
		name       string
		body       string
		wantStatus int
	}{
		{
			name:       "valid login",
			body:       `{"username":"logintest","password":"testpass"}`,
			wantStatus: http.StatusOK,
		},
		{
			name:       "wrong password",
			body:       `{"username":"logintest","password":"wrongpass"}`,
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:       "nonexistent user",
			body:       `{"username":"nouser","password":"testpass"}`,
			wantStatus: http.StatusUnauthorized,
		},
		{
			name:       "empty credentials",
			body:       `{"username":"","password":""}`,
			wantStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(tt.body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			(*handler).ServeHTTP(w, req)

			if w.Code != tt.wantStatus {
				t.Errorf("POST /api/v1/auth/login status = %d, want %d", w.Code, tt.wantStatus)
			}
		})
	}
}

func TestLoginReturnsTokens(t *testing.T) {
	_, handler := setupTestRouter(t)

	// Register
	regBody := `{"username":"tokentest","password":"testpass"}`
	regReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	(*handler).ServeHTTP(regW, regReq)

	// Login
	loginBody := `{"username":"tokentest","password":"testpass"}`
	loginReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginW := httptest.NewRecorder()
	(*handler).ServeHTTP(loginW, loginReq)

	if loginW.Code != http.StatusOK {
		t.Fatalf("Login failed: %d", loginW.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(loginW.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if _, ok := resp["access_token"]; !ok {
		t.Error("Login response missing access_token")
	}
	if _, ok := resp["refresh_token"]; !ok {
		t.Error("Login response missing refresh_token")
	}
	if _, ok := resp["user"]; !ok {
		t.Error("Login response missing user")
	}
}

func TestListMessagesReturnsNotFoundForMissingRoom(t *testing.T) {
	_, handler := setupTestRouter(t)

	regBody := `{"username":"alice","password":"testpass"}`
	regReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	(*handler).ServeHTTP(regW, regReq)

	loginBody := `{"username":"alice","password":"testpass"}`
	loginReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginW := httptest.NewRecorder()
	(*handler).ServeHTTP(loginW, loginReq)

	var loginResp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(loginW.Body.Bytes(), &loginResp); err != nil {
		t.Fatalf("failed to parse login response: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/rooms/999/messages", nil)
	req.Header.Set("Authorization", "Bearer "+loginResp.AccessToken)
	w := httptest.NewRecorder()
	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("GET missing room messages status = %d, want %d, body = %s", w.Code, http.StatusNotFound, w.Body.String())
	}
}

func TestListMessagesReturnsEmptyArrayForExistingRoomWithoutMessages(t *testing.T) {
	_, handler := setupTestRouter(t)

	regBody := `{"username":"bob","password":"testpass"}`
	regReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	(*handler).ServeHTTP(regW, regReq)

	loginBody := `{"username":"bob","password":"testpass"}`
	loginReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginW := httptest.NewRecorder()
	(*handler).ServeHTTP(loginW, loginReq)

	var loginResp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(loginW.Body.Bytes(), &loginResp); err != nil {
		t.Fatalf("failed to parse login response: %v", err)
	}

	createReq := httptest.NewRequest(http.MethodPost, "/api/v1/rooms", strings.NewReader(`{"name":"general"}`))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("Authorization", "Bearer "+loginResp.AccessToken)
	createW := httptest.NewRecorder()
	(*handler).ServeHTTP(createW, createReq)

	var createResp struct {
		Room struct {
			ID uint `json:"id"`
		} `json:"room"`
	}
	if err := json.Unmarshal(createW.Body.Bytes(), &createResp); err != nil {
		t.Fatalf("failed to parse room response: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/api/v1/rooms/"+strconv.FormatUint(uint64(createResp.Room.ID), 10)+"/messages", nil)
	req.Header.Set("Authorization", "Bearer "+loginResp.AccessToken)
	w := httptest.NewRecorder()
	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("GET room messages status = %d, want %d, body = %s", w.Code, http.StatusOK, w.Body.String())
	}
	var resp struct {
		Messages []any `json:"messages"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}
	if len(resp.Messages) != 0 {
		t.Fatalf("messages len = %d, want 0", len(resp.Messages))
	}
}

func TestCreateWSTicket(t *testing.T) {
	db, handler := setupTestRouter(t)

	regBody := `{"username":"carol","password":"testpass"}`
	regReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/register", strings.NewReader(regBody))
	regReq.Header.Set("Content-Type", "application/json")
	regW := httptest.NewRecorder()
	(*handler).ServeHTTP(regW, regReq)

	loginBody := `{"username":"carol","password":"testpass"}`
	loginReq := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", strings.NewReader(loginBody))
	loginReq.Header.Set("Content-Type", "application/json")
	loginW := httptest.NewRecorder()
	(*handler).ServeHTTP(loginW, loginReq)

	var loginResp struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(loginW.Body.Bytes(), &loginResp); err != nil {
		t.Fatalf("failed to parse login response: %v", err)
	}

	createReq := httptest.NewRequest(http.MethodPost, "/api/v1/rooms", strings.NewReader(`{"name":"tickets"}`))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("Authorization", "Bearer "+loginResp.AccessToken)
	createW := httptest.NewRecorder()
	(*handler).ServeHTTP(createW, createReq)

	var createResp struct {
		Room struct {
			ID uint `json:"id"`
		} `json:"room"`
	}
	if err := json.Unmarshal(createW.Body.Bytes(), &createResp); err != nil {
		t.Fatalf("failed to parse room response: %v", err)
	}

	ticketReq := httptest.NewRequest(http.MethodPost, "/api/v1/ws/tickets", strings.NewReader(`{"room_id":`+strconv.FormatUint(uint64(createResp.Room.ID), 10)+`}`))
	ticketReq.Header.Set("Content-Type", "application/json")
	ticketReq.Header.Set("Authorization", "Bearer "+loginResp.AccessToken)
	ticketW := httptest.NewRecorder()
	(*handler).ServeHTTP(ticketW, ticketReq)

	if ticketW.Code != http.StatusOK {
		t.Fatalf("POST /api/v1/ws/tickets status = %d, want %d, body = %s", ticketW.Code, http.StatusOK, ticketW.Body.String())
	}
	var ticketResp struct {
		Ticket string `json:"ticket"`
	}
	if err := json.Unmarshal(ticketW.Body.Bytes(), &ticketResp); err != nil {
		t.Fatalf("failed to parse ticket response: %v", err)
	}
	if ticketResp.Ticket == "" {
		t.Fatal("expected non-empty ws ticket")
	}
	var count int64
	if err := db.Model(&models.WSTicket{}).Count(&count).Error; err != nil {
		t.Fatalf("failed to count ws tickets: %v", err)
	}
	if count != 1 {
		t.Fatalf("ws ticket count = %d, want 1", count)
	}
}

func TestMetricsEndpoint(t *testing.T) {
	_, handler := setupTestRouter(t)

	req := httptest.NewRequest(http.MethodGet, "/metrics", nil)
	w := httptest.NewRecorder()

	(*handler).ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("GET /metrics status = %d, want %d", w.Code, http.StatusOK)
	}

	// Prometheus metrics should contain some standard metrics
	body := w.Body.String()
	if !strings.Contains(body, "go_") {
		t.Error("GET /metrics should contain Go runtime metrics")
	}
}
