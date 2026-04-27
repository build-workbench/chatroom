package db

import (
	"time"

	"chatroom/internal/config"
	"chatroom/internal/models"

	"github.com/rs/zerolog/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	maxRetries     = 10
	baseRetryDelay = 500 * time.Millisecond
	retryIncrement = 200 * time.Millisecond
)

// Connect 负责建立到 Postgres 的连接，并带有简单的重试来等待容器就绪。
func Connect(dsn string, cfg config.Config) (*gorm.DB, error) {
	var gdb *gorm.DB
	var err error
	for i := range maxRetries {
		gdb, err = gorm.Open(postgres.Open(dsn), &gorm.Config{Logger: logger.Default.LogMode(logger.Silent)})
		if err == nil {
			sqlDB, err2 := gdb.DB()
			if err2 == nil {
				sqlDB.SetMaxIdleConns(cfg.DBMaxIdleConns)
				sqlDB.SetMaxOpenConns(cfg.DBMaxOpenConns)
				sqlDB.SetConnMaxLifetime(time.Hour)
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

// StartCleanup 启动后台定时清理任务，清理过期的 token 和 ticket。
// 返回停止清理的函数，应在优雅停服时调用。
func StartCleanup(gdb *gorm.DB) (stop func()) {
	ticker := time.NewTicker(time.Hour)
	stopCh := make(chan struct{})

	go func() {
		for {
			select {
			case <-stopCh:
				ticker.Stop()
				return
			case <-ticker.C:
				runCleanup(gdb)
			}
		}
	}()

	return func() { close(stopCh) }
}

func runCleanup(gdb *gorm.DB) {
	now := time.Now().UTC()

	// 清理过期的 refresh tokens（包括已吊销的）
	if result := gdb.Where("expires_at < ? OR revoked_at IS NOT NULL", now.Add(-24*time.Hour)).
		Delete(&models.RefreshToken{}); result.Error != nil {
		log.Warn().Err(result.Error).Msg("cleanup refresh tokens")
	} else if result.RowsAffected > 0 {
		log.Debug().Int64("count", result.RowsAffected).Msg("cleaned up refresh tokens")
	}

	// 清理过期或已消费的 WS tickets
	if result := gdb.Where("expires_at < ? OR consumed_at IS NOT NULL", now.Add(-24*time.Hour)).
		Delete(&models.WSTicket{}); result.Error != nil {
		log.Warn().Err(result.Error).Msg("cleanup ws tickets")
	} else if result.RowsAffected > 0 {
		log.Debug().Int64("count", result.RowsAffected).Msg("cleaned up ws tickets")
	}

	// 清理超时的 WS sessions（心跳超时 45 秒，保留 5 分钟兜底）
	if result := gdb.Where("last_seen_at < ?", now.Add(-5*time.Minute)).
		Delete(&models.WSSession{}); result.Error != nil {
		log.Warn().Err(result.Error).Msg("cleanup ws sessions")
	} else if result.RowsAffected > 0 {
		log.Debug().Int64("count", result.RowsAffected).Msg("cleaned up ws sessions")
	}
}
