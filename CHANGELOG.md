# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Aligned README, docs, contribution guide, roadmap references, and workflow branch references with the current `master` default branch
- Clarified that `.env.example` is a configuration template and that the backend reads process environment variables directly
- Expanded README coverage for run modes, `ALLOWED_ORIGINS`, docs entry points, and deployment guidance
- Updated docs site metadata and edit links for the current GitHub Pages deployment
- Hardened production CORS and WebSocket origin validation with strict same-origin / allowlist checks
- Improved frontend auth, room, history, and socket error feedback for release-readiness
- Stabilized SPA static asset fallback resolution and added regression tests for reserved route handling

## [0.2.0] - 2026-03-08

### Added
- Open source standard files (LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- GitHub issue and PR templates
- CI/CD workflows with GitHub Actions
- golangci-lint configuration
- EditorConfig for consistent coding style
- Makefile for common development tasks
- Multi-stage Dockerfile for production builds (now includes frontend build stage)
- Kubernetes deployment manifests
- Health check endpoints (/health, /ready, /version)
- API documentation
- Architecture documentation
- Grafana dashboard for monitoring
- Comprehensive test coverage
- `.env.example` for local setup
- Frontend unit tests using Node built-in test runner
- Release bundles that include runnable frontend static assets
- A VitePress-based teaching docs site under `docs/`
- GitHub Pages deployment workflow for the docs site
- `LOG_LEVEL` and `LOG_FORMAT` environment variables for configurable logging
- `Config.IsDev()` convenience method
- `TableName()` methods on all GORM models for explicit table naming
- JSON tags on all model fields (sensitive fields use `json:"-"`)
- WebSocket constants (`maxMessageSize`, `pongWait`, `pingInterval`, `writeWait`, `sendBufSize`)
- Database connection retry logging with attempt count and delay
- Binding validation tags (`required`, `min`, `max`) on handler request structs
- Unified `badRequest()` / `serverError()` response helpers
- Modern linters `copyloopvar` and `intrange` in golangci-lint config

### Changed
- Updated README with teaching-friendly documentation and manual testing steps
- Enhanced docker-compose.yml with application service
- Improved security configuration with JWT secret validation
- Translated `AGENTS.md` to Chinese
- Replaced the frontend template README with project-specific guidance
- Added frontend tests to CI
- Adjusted release workflow to validate tests before packaging
- Stabilized backend websocket and router tests across environments
- Reorganized project documentation into an online teaching docs experience
- **Refactored** `internal/log/logger.go` to accept full `Config` struct with log level/format support
- **Refactored** `internal/config/config.go` with `getenvInt()` helper, `Validate()` now checks `LOG_LEVEL`
- **Refactored** `internal/ws/hub.go` — extracted `broadcastToClients()`, `broadcastEvent()`, `updateOnline()` to eliminate code duplication
- **Refactored** `internal/ws/conn.go` — replaced magic numbers with named constants, proper error returns from `SetReadDeadline`/`SetWriteDeadline`
- **Refactored** `internal/server/handler.go` — extracted request structs with binding tags, unified error response helpers
- **Refactored** `internal/db/db.go` — extracted connection pool constants, added retry logging
- Updated Dockerfile: 3-stage build (frontend + backend + runtime), Alpine 3.21
- Updated docker-compose.yml: Prometheus v2.53.0, Grafana 11.3.0
- Updated CI workflows: golangci-lint-action v6, docker/build-push-action v6, softprops/action-gh-release v2
- Fixed `frontend/src/socket.ts` mixed tab/space indentation
- Updated `.gitignore` to preserve `.env.example` and ignore `.windsurf/` / `Thumbs.db`

### Removed
- Deprecated `exportloopref` linter (unnecessary since Go 1.22+)

## [0.1.0] - 2025-01-08

### Added
- Initial release
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

### Technical Stack
- Go 1.24 with Gin framework
- GORM for database access
- gorilla/websocket for WebSocket handling
- PostgreSQL 16 for data persistence
- React 19 with Vite
