package ws

import (
	"strings"
	"testing"

	"chatroom/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupProcessorTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Skipf("skipping: sqlite unavailable: %v", err)
	}
	if err := db.AutoMigrate(&models.Message{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	return db
}

func newTestProcessor(db *gorm.DB) *DefaultMessageProcessor {
	return NewDefaultMessageProcessor(db, nil, MessageProcessorConfig{
		RoomID:     1,
		UserID:     1,
		Username:   "tester",
		MaxSize:    1 << 20,
		MaxContent: 2000,
	})
}

func TestProcess_EmptyContent(t *testing.T) {
	db := setupProcessorTestDB(t)
	p := newTestProcessor(db)

	if result := p.Process(""); result != nil {
		t.Errorf("Process(\"\") = %v, want nil", result)
	}
}

func TestProcess_ValidMessage(t *testing.T) {
	db := setupProcessorTestDB(t)
	p := newTestProcessor(db)

	result := p.Process("hello world")
	if result == nil {
		t.Fatal("Process(\"hello world\") = nil, want result")
	}
	if !result.Broadcast {
		t.Error("Broadcast = false, want true")
	}
	if result.Message.Type != "message" {
		t.Errorf("Type = %q, want \"message\"", result.Message.Type)
	}
	if result.Message.Content != "hello world" {
		t.Errorf("Content = %q, want \"hello world\"", result.Message.Content)
	}
	if result.Message.ID == 0 {
		t.Error("ID = 0, want non-zero (should be persisted)")
	}
	if result.Message.Username != "tester" {
		t.Errorf("Username = %q, want \"tester\"", result.Message.Username)
	}

	// 验证消息已持久化
	var count int64
	db.Model(&models.Message{}).Count(&count)
	if count != 1 {
		t.Errorf("persisted count = %d, want 1", count)
	}
}

func TestProcess_XSSSanitized(t *testing.T) {
	db := setupProcessorTestDB(t)
	p := newTestProcessor(db)

	result := p.Process("<script>alert('xss')</script>")
	if result == nil {
		t.Fatal("Process returned nil")
	}
	if result.Message.Content != "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;" {
		t.Errorf("Content = %q, want HTML-escaped", result.Message.Content)
	}
}

func TestProcess_ContentTooLong(t *testing.T) {
	db := setupProcessorTestDB(t)
	p := newTestProcessor(db)

	long := strings.Repeat("a", 2001)

	result := p.Process(long)
	if result == nil {
		t.Fatal("Process returned nil for long content")
	}
	if result.Broadcast {
		t.Error("Broadcast = true, want false (should be error to sender only)")
	}
	if result.Message.Type != "error" {
		t.Errorf("Type = %q, want \"error\"", result.Message.Type)
	}
}

func TestProcess_PersistFailure(t *testing.T) {
	// 用一个已关闭的 DB 模拟持久化失败
	db := setupProcessorTestDB(t)
	sqlDB, _ := db.DB()
	sqlDB.Close()

	p := newTestProcessor(db)
	result := p.Process("test message")
	if result == nil {
		t.Fatal("Process returned nil")
	}
	if result.Broadcast {
		t.Error("Broadcast = true, want false")
	}
	if result.Message.Type != "error" {
		t.Errorf("Type = %q, want \"error\"", result.Message.Type)
	}
}
