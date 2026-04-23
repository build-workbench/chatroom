package ws

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"chatroom/internal/config"
	"chatroom/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/rs/zerolog/log"
	"gorm.io/gorm"
)

const wsNotifyChannel = "chatroom_ws_events"

type distributedEnvelope struct {
	SourcePod string          `json:"source_pod"`
	RoomID    uint            `json:"room_id"`
	Payload   json.RawMessage `json:"payload"`
}

type Realtime struct {
	db      *gorm.DB
	hub     *Hub
	cfg     config.Config
	enabled bool
	stop    chan struct{}
}

func NewRealtime(db *gorm.DB, hub *Hub, cfg config.Config) *Realtime {
	rt := &Realtime{
		db:      db,
		hub:     hub,
		cfg:     cfg,
		enabled: db != nil && db.Name() == "postgres",
		stop:    make(chan struct{}),
	}
	if rt.enabled {
		go rt.listen()
	}
	return rt
}

func (rt *Realtime) Close() {
	select {
	case <-rt.stop:
		return
	default:
		close(rt.stop)
	}
}

func (rt *Realtime) Publish(roomID uint, payload []byte) error {
	if rt == nil || !rt.enabled {
		return nil
	}
	env, err := json.Marshal(distributedEnvelope{
		SourcePod: rt.cfg.PodID,
		RoomID:    roomID,
		Payload:   payload,
	})
	if err != nil {
		return err
	}
	return rt.db.Exec("SELECT pg_notify(?, ?)", wsNotifyChannel, string(env)).Error
}

func (rt *Realtime) RegisterSession(sessionID string, roomID, userID uint) error {
	if rt == nil {
		return nil
	}
	now := time.Now().UTC()
	rec := models.WSSession{
		SessionID:  sessionID,
		RoomID:     roomID,
		UserID:     userID,
		PodID:      rt.cfg.PodID,
		LastSeenAt: now,
	}
	return rt.db.Create(&rec).Error
}

func (rt *Realtime) TouchSession(sessionID string) error {
	if rt == nil || sessionID == "" {
		return nil
	}
	return rt.db.Model(&models.WSSession{}).
		Where("session_id = ?", sessionID).
		Updates(map[string]any{"last_seen_at": time.Now().UTC()}).Error
}

func (rt *Realtime) DeleteSession(sessionID string) error {
	if rt == nil || sessionID == "" {
		return nil
	}
	return rt.db.Where("session_id = ?", sessionID).Delete(&models.WSSession{}).Error
}

func (rt *Realtime) CountRoomOnline(roomID uint, activeWindow time.Duration) (int, error) {
	if rt == nil {
		return 0, nil
	}
	var count int64
	err := rt.db.Model(&models.WSSession{}).
		Where("room_id = ? AND last_seen_at > ?", roomID, time.Now().UTC().Add(-activeWindow)).
		Count(&count).Error
	return int(count), err
}

func (rt *Realtime) listen() {
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, rt.cfg.DatabaseDSN)
	if err != nil {
		log.Warn().Err(err).Msg("ws realtime listener disabled")
		return
	}
	defer conn.Close(ctx)
	if _, err := conn.Exec(ctx, "LISTEN "+wsNotifyChannel); err != nil {
		log.Warn().Err(err).Msg("ws realtime listen failed")
		return
	}
	for {
		select {
		case <-rt.stop:
			return
		default:
		}

		waitCtx, cancel := context.WithTimeout(ctx, time.Second)
		notification, err := conn.WaitForNotification(waitCtx)
		cancel()
		if err != nil {
			if errors.Is(err, context.DeadlineExceeded) || errors.Is(err, context.Canceled) {
				continue
			}
			log.Warn().Err(err).Msg("ws realtime wait notification")
			continue
		}
		if notification == nil {
			continue
		}
		var env distributedEnvelope
		if err := json.Unmarshal([]byte(notification.Payload), &env); err != nil {
			log.Warn().Err(err).Msg("ws realtime decode notification")
			continue
		}
		if env.SourcePod == rt.cfg.PodID {
			continue
		}
		rt.hub.BroadcastExisting(env.RoomID, env.Payload)
	}
}
