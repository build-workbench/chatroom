# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.3.0] - 2026-04-16

### Added
- Complete bilingual documentation (English/Chinese)
- VitePress documentation site with internationalization support
- English documentation: Getting Started, API, Architecture, Design, FAQ, Manual Testing, Monitoring
- Language switcher between English and Chinese versions

### Changed
- Restructured docs directory: moved Chinese docs to `docs/zh/`, added `docs/en/`
- Standardized all changelog files with professional format
- Updated VitePress config for multi-language support
- Enhanced README with clearer structure and badges

### Documentation
- Professionalized documentation formatting across all docs
- Added comprehensive API documentation in both languages
- Created monitoring guide for Prometheus and Grafana
- Added architecture diagrams and data flow explanations

## [v0.2.0] - 2026-03-08

### Added
- Open source standard files: LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY
- CI/CD pipelines with GitHub Actions
- VitePress documentation site
- Docker multi-stage builds
- Kubernetes deployment manifests
- Health check endpoints (`/health`, `/healthz`, `/ready`, `/version`)
- Prometheus metrics integration
- Rate limiting middleware

### Security
- JWT secret validation for production environments
- CORS origin whitelist validation
- WebSocket origin validation matching HTTP CORS
- Input sanitization and validation

### Changed
- Comprehensive backend refactoring with service layer
- Frontend migrated to React 19 + TypeScript + Vite 7
- WebSocket authentication using one-time tickets
- Unified error handling across the application

### Fixed
- Rate limiter goroutine leak
- WebSocket message deduplication
- Connection cleanup on disconnect

## [v0.1.0] - 2025-01-08

### Added
- User registration and login with JWT authentication
- Chat room creation and management
- WebSocket real-time messaging
- PostgreSQL message persistence
- Vanilla JavaScript frontend
- Basic Docker support

---

## Release Notes

See the [changelog directory](./changelog/) for detailed change records.

[Full Changelog](https://github.com/LessUp/chatroom/commits/master)
