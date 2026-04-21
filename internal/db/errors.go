package db

import (
	"errors"
	"strings"

	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
)

// IsUniqueViolation 判断数据库错误是否为唯一约束冲突。
// 支持 PostgreSQL（使用错误码）和 SQLite（使用错误消息）。
func IsUniqueViolation(err error) bool {
	if err == nil {
		return false
	}
	// 尝试获取 PostgreSQL 错误
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.Code == pgerrcode.UniqueViolation
	}
	// SQLite 不支持 pgconn.PgError，回退到消息匹配
	// SQLite 的唯一约束错误包含 "UNIQUE constraint failed"
	msg := strings.ToLower(err.Error())
	return strings.Contains(msg, "unique constraint failed") ||
		strings.Contains(msg, "duplicate key")
}
