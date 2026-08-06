---
title: 变更日志
---

# 变更日志

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- 删除分布式消息同步：`internal/ws/realtime.go`、`WSSession` 模型、`PodID` 配置、`internal/repository` 包
- 删除 Prometheus 监控：`internal/metrics` 包、`/metrics` 端点、`deploy/prometheus`、docker-compose 中的 prometheus/grafana 服务
- 删除 `internal/mw` 包（合并入 `internal/server`）、`internal/log` 包（合并入 `internal/config`）
- 删除 `internal/auth/ticket.go`（合并入 `internal/auth/auth.go`）
- 删除 docs 中的 whitepaper、deep-dives、decisions、deployment/learning-path/development-guide 等过度设计或与代码不符的文档

### Changed
- 简化 `internal/auth`：移除 `GormAdapter` 与接口适配层，DB 操作直接接收 `*gorm.DB`
- 简化 `internal/service`：移除 repository 版双套实现，单一 service 直接依赖 `*gorm.DB`
- 简化 `internal/ws/processor` 与 `conn`：移除 hub 引用、sessionID、trackHeartbeat、publish
- `config.InitLog` 取代独立的 `clog.Init`
- 重写 docs 站点首页、系统架构、数据流、数据模型、FAQ、本地开发文档，去除虚构的基准数据与 K8s/多实例描述
- 更新 README、AGENTS、docker-compose、.env.example 以反映单实例定位

## [v1.0.0] - 2026-05-01

### Changed
- Enhanced password validation: minimum length increased from 4 to 8 characters
- Fixed token refresh race condition in frontend API client
- Updated CODE_OF_CONDUCT with proper contact information

### Removed
- Cleaned up redundant files: build artifacts, node_modules, plugin data
- Removed outdated `docs/monitoring/` (use `docs/zh/monitoring/` instead)

### Documentation
- Synchronized VERSION and CHANGELOG to v1.0.0
- Project now in archive-ready state

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

