# Release Readiness & Security Hardening

**Date**: 2026-03-13

## Summary

Security hardening and release readiness fixes, including CORS policy tightening and production deployment preparations.

## Changes

### Security
- **CORS Policy**: Tightened `internal/mw/cors.go` cross-origin policy, removed `strings.Contains(origin, host)` fuzzy matching
- **Origin Validation**: Added `ALLOWED_ORIGINS` config parsing, origin normalization, same-origin detection, and proto-forwarding logic in `internal/config/config.go`
- **WebSocket Security**: WebSocket upgrade now uses same origin validation rules as HTTP CORS in `internal/ws/conn.go`
- **Config Updates**: Updated `.env.example` and `deploy/k8s/configmap.yaml` with `ALLOWED_ORIGINS` examples

### Frontend
- **API Error Handling**: `frontend/src/api.ts` now preserves status codes and error messages, with better token refresh failure handling
- **Auth Improvements**: `frontend/src/hooks/useAuth.ts` refined login/register error messages with rate limit and service error feedback
- **Chat Enhancements**: `frontend/src/hooks/useChat.ts` improved room list, create room, history message, and pagination error messages
- **Socket Reliability**: `frontend/src/socket.ts` improved WebSocket failure feedback and timeout handling
- **Error Deduplication**: `frontend/src/hooks/useChatSocket.ts` prevents toast spam from duplicate WebSocket errors
- **Auth Screen**: `frontend/src/screens/AuthScreen.tsx` added username/password length hints and post-registration guidance

### Deployment
- **Static Hosting**: `internal/server/router.go` added `resolveAppRoot()` to prioritize `frontend/dist` with fallback to `web/`
- **Route Testing**: Added tests confirming `/api`, `/health`, `/ready`, `/metrics`, `/ws` paths aren't swallowed by SPA fallback

### Testing
- **Config Tests**: Added `internal/config/config_test.go` covering allowlist, strict same-origin, invalid origin, and SPA fallback scenarios
- **Router Tests**: Enhanced `internal/server/router_test.go` with route protection tests

## Impact

- **Security**: Production-ready CORS and Origin validation
- **UX**: Better error visibility and user feedback
- **Deployment**: More reliable static asset serving

## Testing

Completed automated verification:
- `go test -race -coverprofile=coverage.out -covermode=atomic ./...`
- `go test ./internal/config ./internal/server ./internal/ws`
- `go build -ldflags="-s -w" -o bin/chatroom ./cmd/server`
- `npm --prefix frontend run test`
- `npm --prefix frontend run lint`
- `npx --prefix frontend tsc --noEmit`
- `npm --prefix frontend run build`

Results:
- Backend tests passed, `internal/server` coverage 50.0%, `internal/config` coverage 77.1%
- Frontend tests, lint, typecheck, build all passed

## References

- Security hardening requirements
- Production deployment checklist
