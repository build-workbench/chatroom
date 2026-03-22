# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

English | [简体中文](README.zh-CN.md)

A teaching-oriented real-time chat room project built with Go, React, PostgreSQL, REST, and WebSocket.

It is designed for hands-on learning rather than product-grade feature breadth, while still keeping the project runnable, testable, and easy to inspect.

## What’s Included

- User registration, login, and JWT authentication
- Access token + refresh token flow
- Room creation, room listing, and message history pagination
- Real-time messaging, join/leave events, online counts, and typing indicators
- React frontend in `frontend/` and static fallback UI in `web/`
- Docker Compose, Kubernetes manifests, GitHub Actions, and GitHub Release workflow
- Teaching docs site powered by VitePress under `docs/`

## Run Modes

| Mode | What runs | Entry URL | Notes |
|------|-----------|-----------|-------|
| Local dev | Go backend + Vite dev server | `http://localhost:5173` | Best for daily development |
| Built frontend | Go backend + `frontend/dist` | `http://localhost:8080` | Closer to release bundle behavior |
| Static fallback | Go backend + `web/` | `http://localhost:8080` | Used when `frontend/dist` is unavailable |
| Docker Compose | PostgreSQL + app container | `http://localhost:8080` | Fast end-to-end local environment |

The backend serves `frontend/dist` first. If the built frontend is not present, it falls back to `web/`.

## Quick Start

### Prerequisites

- Go 1.24+
- Node.js 20+
- Docker and Docker Compose

### Recommended local setup

```bash
docker compose up -d postgres
go run ./cmd/server
# In another terminal:
npm --prefix frontend ci
npm --prefix frontend run dev
```

Open:

- Frontend dev server: `http://localhost:5173`
- Backend health: `http://localhost:8080/health`
- Backend ready: `http://localhost:8080/ready`
- Backend version: `http://localhost:8080/version`

### Configuration note

The backend reads configuration from process environment variables. `.env.example` is a reference template, but `go run ./cmd/server` does **not** auto-load a `.env` file.

For production-like deployments, pay special attention to:

- `JWT_SECRET`
- `ALLOWED_ORIGINS`
- `DATABASE_DSN`

## Documentation

- [中文主说明](README.zh-CN.md)
- [Docs site source](docs/)
- [Getting Started](docs/getting-started.md)
- [Manual Testing](docs/manual-testing.md)
- [API](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design](docs/DESIGN.md)
- [Monitoring](docs/monitoring/README.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Changelog](CHANGELOG.md)

## Repository Layout

```text
chatroom/
├── cmd/server/          # Backend entry
├── internal/            # Backend services, middleware, config, WebSocket, metrics
├── frontend/            # React main frontend
├── web/                 # Static fallback UI
├── docs/                # VitePress teaching docs
├── deploy/              # Docker and Kubernetes assets
├── changelog/           # Detailed change records
└── .github/workflows/   # CI / release / security / docs automation
```

## License

[MIT License](LICENSE)
