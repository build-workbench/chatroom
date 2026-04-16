# Code Optimization

**Date**: 2026-02-13

## Summary

Backend handler extraction and WebSocket performance improvements.

## Changes

### Backend

#### Handler Extraction (Separation of Concerns)
- Extracted inline handler logic from `internal/server/router.go` into separate `internal/server/handler.go`
- New `Handler` struct injecting `UserService`, `RoomService`, `MessageService`
- `router.go` now only handles route registration and middleware, reduced from 282 to 144 lines

#### WebSocket writePump Batch Writes
- `internal/ws/conn.go` `writePump` added batch drain logic
- Each write loop now sends accumulated messages from send channel, reducing system call overhead

#### Rate Limiter GC Goroutine Leak Fix
- `internal/mw/ratelimit.go` GC goroutine previously used `time.Sleep` infinite loop, couldn't be stopped
- Changed to `time.Ticker` + `stop` channel pattern, added `Stop()` method for graceful shutdown

### Frontend

#### Textarea Auto-Resize
- `frontend/src/components/MessageInput.tsx` added `autoResize` logic
- Textarea auto-expands on multi-line input (max 120px), resets after sending

#### Message Deduplication
- `frontend/src/App.tsx` WebSocket `message` event handler added id-based deduplication
- Prevents duplicate messages between history loading and WebSocket real-time push

## Impact

- **Performance**: Reduced system calls in WebSocket writes
- **Stability**: Fixed goroutine leak in rate limiter
- **UX**: Better input experience and no duplicate messages

## Testing

- WebSocket batch write performance tests
- Rate limiter shutdown verification
- Message deduplication testing

## References

- Performance optimization requirements
- Goroutine leak detection
