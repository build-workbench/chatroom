# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For detailed change records, see the [changelog/](changelog/) directory.

---

## [Unreleased]

### Added

- Database cleanup task for expired tokens, tickets, and sessions
- `ReadHeaderTimeout` configuration to prevent Slowloris attacks

### Changed

- Improved code documentation and error handling in WebSocket layer
- Enhanced VitePress documentation site with better navigation structure

---

## [0.2.0] - 2026-03-08

### Added

**Open Source Standards**

- LICENSE (MIT), CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub issue templates (bug report, feature request) and PR template
- EditorConfig for consistent coding style across editors
- Dependabot configuration for automated dependency updates

**CI/CD & Deployment**

- GitHub Actions workflows: CI, Release, Pages, Security
- golangci-lint configuration with comprehensive linter set
- Makefile for common development tasks
- Multi-stage Dockerfile (frontend → backend → runtime)
- Kubernetes deployment manifests (Deployment, Service, ConfigMap)
- Health check endpoints (`/health`, `/healthz`, `/ready`, `/version`)

**Features**

- VitePress teaching docs site under `docs/`
- `LOG_LEVEL` and `LOG_FORMAT` environment variables
- `Config.IsDev()` convenience method
- `TableName()` methods on all GORM models
- JSON tags on all model fields (sensitive fields use `json:"-"`)
- WebSocket constants (`maxMessageSize`, `pongWait`, etc.)
- Binding validation tags on handler request structs
- Unified `badRequest()` / `serverError()` response helpers

### Changed

**Backend Refactoring**

- `internal/log/logger.go`: Accept full `Config` struct with log level/format support
- `internal/config/config.go`: Add `getenvInt()` helper, validate `LOG_LEVEL`
- `internal/ws/hub.go`: Extract `broadcastToClients()`, `broadcastEvent()`, `updateOnline()`
- `internal/ws/conn.go`: Replace magic numbers with named constants
- `internal/server/handler.go`: Extract request structs with binding tags
- `internal/db/db.go`: Extract connection pool constants, add retry logging

**Frontend**

- Fixed `frontend/src/socket.ts` mixed tab/space indentation
- Improved error handling and user feedback

**Infrastructure**

- Dockerfile: 3-stage build, Alpine 3.21
- docker-compose.yml: Prometheus v2.53.0, Grafana 11.3.0
- CI workflows: golangci-lint-action v6, docker/build-push-action v6

### Security

**CORS & WebSocket Origin Validation**

- Strict origin validation in `internal/mw/cors.go`
- `ALLOWED_ORIGINS` configuration with normalization
- WebSocket upgrade uses same origin validation as HTTP CORS
- Support for `X-Forwarded-Proto` and `Forwarded` headers

**Frontend Error Handling**

- Improved login/register error feedback
- Rate limit and server error notifications
- WebSocket reconnection feedback with attempt count

### Fixed

- SPA static asset fallback resolution
- Reserved routes (`/api`, `/health`, `/ws`) not caught by SPA fallback

### Removed

- Deprecated `exportloopref` linter (unnecessary since Go 1.22+)

---

## [0.1.0] - 2025-01-08

### Added

**Core Features**

- User registration and login with JWT authentication
- Access token + refresh token authentication flow
- Chat room creation and management
- Real-time messaging via WebSocket
- Join/leave/typing events
- Message persistence with PostgreSQL
- Prometheus metrics endpoint
- Rate limiting middleware
- Structured logging with zerolog
- React frontend with TypeScript
- Development scripts

**Architecture**

- Go 1.24 with Gin framework
- GORM for database access
- gorilla/websocket for WebSocket handling
- PostgreSQL 16 for data persistence
- React 19 with Vite

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 0.2.0 | 2026-03-08 | Open source standards, CI/CD, docs site, security hardening |
| 0.1.0 | 2025-01-08 | Initial release with core chat features |

---

## Upgrade Guide

### From 0.1.0 to 0.2.0

**Required Configuration Changes**:

```bash
# New environment variables (optional with defaults)
LOG_LEVEL=info
LOG_FORMAT=console

# Production environment (required for production)
APP_ENV=production
JWT_SECRET=<your-secure-secret>
ALLOWED_ORIGINS=https://your-domain.com
```

**Breaking Changes**:

- None (backward compatible)

**Migration Steps**:

1. Pull latest code
2. Review `.env.example` for new configuration options
3. Set `APP_ENV=production` for production deployments
4. Configure `ALLOWED_ORIGINS` if using CORS

---

[Unreleased]: https://github.com/LessUp/chatroom/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/LessUp/chatroom/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/LessUp/chatroom/releases/tag/v0.1.0
