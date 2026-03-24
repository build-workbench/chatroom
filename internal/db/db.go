package db

import (
	"time"

	"chatroom/internal/models"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	maxRetries     = 10
	maxIdleConns   = 5
	maxOpenConns   = 20
	connMaxLife    = time.Hour
	baseRetryDelay = 500 * time.Millisecond
	retryIncrement = 200 * time.Millisecond
)

// Connect 负责建立到 Postgres 的连接，并带有简单的重试来等待容器就绪。
func Connect(dsn string) (*gorm.DB, error) {
	var gdb *gorm.DB
	var err error
	for i := range maxRetries {
		gdb, err = gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
		if err == nil {
			sqlDB, err2 := gdb.DB()
			if err2 == nil {
				sqlDB.SetMaxIdleConns(maxIdleConns)
				sqlDB.SetMaxOpenConns(maxOpenConns)
				sqlDB.SetConnMaxLifetime(connMaxLife)
				return gdb, nil
			}
			err = err2
		}
		delay := baseRetryDelay + time.Duration(i)*retryIncrement
		log.Warn().Err(err).Int("attempt", i+1).Dur("retry_in", delay).Msg("db connect retry")
		time.Sleep(delay)
	}
	return nil, err
}

// Migrate 自动迁移教学环境涉及的全部表结构。
func Migrate(gdb *gorm.DB) error {
	return gdb.AutoMigrate(&models.User{}, &models.Room{}, &models.Message{}, &models.RefreshToken{}, &models.WSSession{}, &models.WSTicket{})
}
