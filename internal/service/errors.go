package service

import (
	"errors"
	"strings"
)

// 业务层通用错误，handler 可根据错误类型映射到合适的 HTTP 状态码。
var (
	ErrUsernameTaken      = errors.New("username taken")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrRoomNotFound       = errors.New("room not found")
	ErrRoomNameTaken      = errors.New("room name taken")
)

// isUniqueViolation 判断数据库错误是否为唯一约束冲突。
func isUniqueViolation(err error) bool {
	if err == nil {
		return false
	}
	msg := strings.ToLower(err.Error())
	// PostgreSQL: "duplicate key value violates unique constraint"
	// SQLite: "UNIQUE constraint failed"
	return strings.Contains(msg, "unique") || strings.Contains(msg, "duplicate key")
}
