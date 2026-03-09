# ChatRoom

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

English | [简体中文](README.zh-CN.md)

A real-time chat room project for hands-on practice and teaching.

Backend: Go, Gin, GORM, WebSocket. Frontend: React + TypeScript. Designed to help you quickly understand:

- Account registration, login, and JWT authentication
- REST API + WebSocket collaboration patterns
- Rooms, messages, online counts, typing indicators
- Go backend tests, frontend unit tests, CI & GitHub Release basics

## Features

- User registration / login / token refresh
- Room creation and listing
- WebSocket real-time messaging
- Online count and join/leave events
- Typing indicators
- Message history pagination
- Health check, version info, Prometheus metrics

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Go 1.24, Gin, GORM, gorilla/websocket |
| Frontend | React 19, TypeScript, Vite |
| Database | PostgreSQL 16 |
| Logging | Zerolog |
| Monitoring | Prometheus |
| Automation | GitHub Actions |

## Quick Start

### Prerequisites

- Go 1.24+, Node.js 20+, Docker & Docker Compose

### Option 1: Local Dev (Recommended)

```bash
docker compose up -d postgres
cp .env.example .env
go run ./cmd/server
# In another terminal:
npm --prefix frontend ci && npm --prefix frontend run dev
```

- Frontend: http://localhost:5173
- Backend health: http://localhost:8080/health

### Option 2: Docker Compose

```bash
docker compose up -d
# Visit http://localhost:8080
```

## Testing

```bash
go test ./...                      # Backend
npm --prefix frontend run test     # Frontend
npm --prefix frontend run build    # Frontend build
```

## Project Structure

```
chatroom/
├── cmd/server/          # Backend entry
├── internal/            # Backend business logic
├── frontend/            # React main frontend
├── web/                 # Static fallback UI
├── docs/                # Design & API docs
├── deploy/              # Docker / K8s files
├── changelog/           # Change records
└── .github/workflows/   # CI / Release / Security
```

## Documentation

- [API Docs](docs/API.md) · [Architecture](docs/ARCHITECTURE.md) · [Design](docs/DESIGN.md)
- [Monitoring](docs/monitoring/README.md) · [Contributing](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## License

[MIT License](LICENSE)
