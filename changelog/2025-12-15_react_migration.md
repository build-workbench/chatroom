# React Frontend Migration & Backend Security

**Date**: 2025-12-15

## Summary

Migration from vanilla JS frontend to React + TypeScript + Vite, with backend security enhancements.

## Changes

### Backend
- Configuration parsing and startup validation with TTL parsing and basic config checks
- API robustness with error handling and input validation (register/login/refresh/create room)
- WebSocket security with stricter Origin validation for production (dev remains permissive)
- Static assets: prefer React build output if exists, fall back to `web/`

### Frontend (React)
- Initialized React app structure with login/register/room list/chat (WS + history pagination + typing)
- Local dev experience: Vite proxy to avoid extra CORS config
- Main `App` interface: room list + create room + history messages (auto-pagination on scroll) + WebSocket real-time + typing indicator + online count/connection status
- Fixed TypeScript build errors: removed explicit `JSX` namespace dependency, added React type declarations

### Tests (Go)
- Added `internal/auth/auth_test.go`
- Added `internal/ws/hub_test.go`
- Added `internal/server/router_test.go`

## Impact

- **Files Changed**:
  - `internal/config/config.go`
  - `cmd/server/main.go`
  - `internal/server/router.go`
  - `internal/ws/conn.go`
  - `frontend/tsconfig.app.json`
  - `frontend/src/App.tsx`
  - `frontend/src/screens/AuthScreen.tsx`
  - `frontend/src/toast.tsx`

- **Breaking Changes**: Frontend completely replaced with React

## Testing

- `go test ./...`

## References

- React 19 migration plan
- Security hardening requirements
