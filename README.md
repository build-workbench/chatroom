# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LessUp/chatroom)](https://github.com/LessUp/chatroom/releases)
[![Go Report Card](https://goreportcard.com/badge/github.com/LessUp/chatroom)](https://goreportcard.com/report/github.com/LessUp/chatroom)

English | [简体中文](README.zh-CN.md)

A **teaching-oriented** real-time chat room application demonstrating modern full-stack development practices with Go, React, PostgreSQL, WebSocket, and production-ready CI/CD.

**Design Philosophy**: Runnable → Understandable → Verifiable → Extendable

## 🚀 Quick Start

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

### Access URLs

| Service | URL |
|---------|-----|
| Frontend (Dev) | http://localhost:5173 |
| Backend | http://localhost:8080 |

## ✨ Features

| Category | Features |
|----------|----------|
| **Authentication** | JWT + Refresh Token with automatic rotation, secure WebSocket ticket |
| **Real-time Chat** | Room-based WebSocket broadcasting, typing indicators, presence |
| **Message History** | Cursor-based pagination, persistent storage in PostgreSQL |
| **Security** | Rate limiting, CORS validation, input sanitization, bcrypt passwords |
| **Observability** | Prometheus metrics, structured logging (zerolog), health checks |
| **Deployment** | Docker multi-stage builds, Kubernetes manifests, GitHub Actions CI/CD |

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   Go Gin    │────▶│ PostgreSQL  │
│  Frontend   │◀────│   Backend   │◀────│  Database   │
└─────────────┘ WS  └─────────────┘     └─────────────┘
```

## 📚 Documentation

### User Documentation
- 📖 [Documentation Site (EN)](https://lessup.github.io/chatroom/en/)
- 📖 [Documentation Site (ZH)](https://lessup.github.io/chatroom/zh/)
- 🚀 [Getting Started](https://lessup.github.io/chatroom/en/getting-started)
- 📚 [API Reference](https://lessup.github.io/chatroom/en/api)
- 🏗️ [Architecture](https://lessup.github.io/chatroom/en/architecture)
- 🎨 [Design Decisions](https://lessup.github.io/chatroom/en/design)
- ❓ [FAQ](https://lessup.github.io/chatroom/en/faq)

### Specifications (Single Source of Truth)
- 📋 [Spec Index](specs/README.md) — Complete specification directory
- 📦 [Product Specs](specs/product/) — Requirements and acceptance criteria
- 🏛️ [RFCs](specs/rfc/) — Technical design documents
- 🔌 [API Specs](specs/api/) — Interface specifications
- 🗄️ [DB Specs](specs/db/) — Database schemas
- 🧪 [Testing Specs](specs/testing/) — Test specifications

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go 1.24, Gin, GORM, gorilla/websocket, zerolog |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| Monitoring | Prometheus, Grafana |
| Deployment | Docker, Kubernetes |

## 📁 Project Structure

```
chatroom/
├── cmd/server/              # Application entry point
├── internal/                # Private packages
│   ├── auth/                # JWT, password hashing, tokens
│   ├── config/              # Configuration loading
│   ├── db/                  # Database connection, migrations
│   ├── server/              # HTTP routes and handlers
│   ├── service/             # Business logic
│   ├── ws/                  # WebSocket Hub, connections
│   ├── mw/                  # Middleware (auth, rate limit, CORS)
│   ├── metrics/             # Prometheus metrics
│   └── models/              # GORM data models
├── frontend/                # React frontend
├── web/                     # Static fallback UI
├── specs/                   # Project specifications (SDD source of truth)
│   ├── product/             # Product requirements
│   ├── rfc/                 # Technical design documents
│   ├── api/                 # API specifications
│   ├── db/                  # Database schemas
│   └── testing/             # Test specifications
├── docs/                    # VitePress documentation site (user-facing)
├── deploy/                  # Docker, Kubernetes configs
└── changelog/               # Detailed change records
```

## ⚙️ Configuration

Configuration is loaded from **environment variables**:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 8080 | HTTP port |
| `APP_ENV` | dev | Environment (dev/staging/production) |
| `DATABASE_DSN` | localhost | PostgreSQL connection string |
| `JWT_SECRET` | dev-secret-change-me | JWT signing key |
| `ALLOWED_ORIGINS` | - | CORS allowed origins (comma-separated) |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access token lifetime |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh token lifetime |

See `.env.example` for complete list.

## 🧪 Testing

```bash
# Go tests
make test

# Frontend tests
npm --prefix frontend run test

# Full verification
make all
```

## 🐳 Docker

```bash
# Full stack
docker compose up -d

# With monitoring
docker compose --profile monitoring up -d
```

## 📄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policy and best practices.

## 📜 License

[MIT License](LICENSE)

---

**Note**: This project is primarily for teaching and learning purposes. While it includes production-ready practices, it's designed for understanding rather than feature density.
