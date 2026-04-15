# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

English | [简体中文](README.zh-CN.md)

A teaching-oriented real-time chat room project built with Go, React, PostgreSQL, REST API, and WebSocket.

**Design Philosophy**: Runnable, Understandable, Verifiable, Extendable — not feature-heavy.

## Features

- **Authentication**: JWT + Refresh Token with automatic rotation
- **Real-time Chat**: WebSocket with room-based broadcasting
- **Presence**: Online count, join/leave events, typing indicators
- **History**: Paginated message history with cursor-based loading
- **Security**: Rate limiting, CORS validation, input sanitization
- **Observability**: Prometheus metrics, structured logging, health checks
- **Deployment**: Docker, Kubernetes manifests, GitHub Actions CI/CD

## Quick Start

### Prerequisites

- Go 1.24+
- Node.js 20+
- Docker & Docker Compose

### Run Locally

```bash
# 1. Start PostgreSQL
docker compose up -d postgres

# 2. Start backend (Terminal 1)
go run ./cmd/server

# 3. Start frontend (Terminal 2)
npm --prefix frontend ci
npm --prefix frontend run dev
```

### Access

| Service | URL |
|---------|-----|
| Frontend (Dev) | http://localhost:5173 |
| Backend | http://localhost:8080 |
| Health Check | http://localhost:8080/health |
| Ready Check | http://localhost:8080/ready |
| Version | http://localhost:8080/version |
| Metrics | http://localhost:8080/metrics |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go 1.24, Gin, GORM, gorilla/websocket, zerolog |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| Monitoring | Prometheus, Grafana |
| Deployment | Docker, Kubernetes |

## Project Structure

```
chatroom/
├── cmd/server/              # Application entry point
├── internal/                # Private packages
│   ├── auth/                # JWT, password hashing, tokens
│   ├── config/              # Configuration loading
│   ├── db/                  # Database connection, migrations
│   ├── server/              # HTTP routes and handlers
│   ├── service/             # Business logic layer
│   ├── ws/                  # WebSocket Hub and connections
│   ├── mw/                  # Middleware (auth, rate limit, CORS)
│   ├── metrics/             # Prometheus metrics
│   └── models/              # GORM data models
├── frontend/                # React frontend
├── web/                     # Static fallback UI
├── docs/                    # VitePress documentation site
├── deploy/                  # Docker, Kubernetes configs
└── .github/workflows/       # CI/CD pipelines
```

## Configuration

The backend reads configuration from **environment variables**. It does NOT auto-load `.env` files.

Key configuration options:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 8080 | HTTP port |
| `APP_ENV` | dev | Environment (dev/staging/production) |
| `DATABASE_DSN` | localhost | PostgreSQL connection string |
| `JWT_SECRET` | dev-secret-change-me | JWT signing key (MUST change in production) |
| `ALLOWED_ORIGINS` | - | CORS allowed origins (comma-separated) |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh token lifetime |

See `.env.example` for the complete list.

## Commands

```bash
# Go
make test          # Run tests
make lint          # Lint code
make build         # Build binary
make all           # lint + test + build

# Frontend
npm --prefix frontend run dev     # Development server
npm --prefix frontend run build   # Production build
npm --prefix frontend run test    # Run tests

# Docker
docker compose up -d              # Start all services
docker compose up -d postgres     # Database only
```

## Documentation

- 📖 [Documentation Site](https://lessup.github.io/chatroom/)
- 🚀 [Getting Started](docs/getting-started.md)
- 📚 [API Reference](docs/API.md)
- 🏗️ [Architecture](docs/ARCHITECTURE.md)
- 🎨 [Design Decisions](docs/DESIGN.md)
- ❓ [FAQ](docs/FAQ.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

See [SECURITY.md](SECURITY.md) for security policy and best practices.

## License

[MIT License](LICENSE)
