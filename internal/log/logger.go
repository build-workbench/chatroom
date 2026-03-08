package log

import (
	"os"
	"time"

	"chatroom/internal/config"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

// Init 根据配置设置 Zerolog 输出格式与日志级别。
// 开发环境默认使用更易读的控制台模式，生产环境默认输出 JSON。
func Init(cfg config.Config) {
	zerolog.TimeFieldFormat = time.RFC3339

	// 设置日志级别
	level, err := zerolog.ParseLevel(cfg.LogLevel)
	if err != nil {
		level = zerolog.InfoLevel
	}
	zerolog.SetGlobalLevel(level)

	// 选择输出格式
	useConsole := cfg.LogFormat == "console" || (cfg.LogFormat == "" && cfg.IsDev())
	if useConsole {
		cw := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339}
		log.Logger = zerolog.New(cw).With().Timestamp().Logger()
		return
	}
	log.Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
}
