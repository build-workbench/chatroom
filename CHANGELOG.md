# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Open source standard files (LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md)
- GitHub issue and PR templates
- CI/CD workflows with GitHub Actions
- golangci-lint configuration
- EditorConfig for consistent coding style
- Makefile for common development tasks
- Multi-stage Dockerfile for production builds
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
