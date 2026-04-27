# Getting Started

This guide will help you get the project running with minimal steps.

---

## Project Positioning

ChatRoom is a real-time chat application for personal practice and teaching demonstrations.

It prioritizes:

- ✅ Quick local setup
- ✅ Documentation consistent with code behavior
- ✅ Direct verification of tests and builds
- ✅ Clear structure for teaching and explanation

---

## Prerequisites

| Tool | Required Version | Purpose |
|------|-----------------|---------|
| Go | 1.24+ | Backend runtime |
| Node.js | 22+ | Frontend build |
| Docker | Latest | PostgreSQL database |

---

## Quick Start

```bash
# 1. Start the database
docker compose up -d postgres

# 2. Start the backend (Terminal 1)
go run ./cmd/server

# 3. Start the frontend (Terminal 2)
npm --prefix frontend ci
npm --prefix frontend run dev
```

### Access URLs

| Service | URL |
|---------|-----|
| Frontend Dev Server | http://localhost:5173 |
| Backend Home | http://localhost:8080 |
| Health Check | http://localhost:8080/health |
| Readiness Check | http://localhost:8080/ready |
| Version Info | http://localhost:8080/version |
| Prometheus Metrics | http://localhost:8080/metrics |

---

## Project Structure

```
chatroom/
├── cmd/server/          # Application entry point
├── internal/            # Backend core code
│   ├── auth/            # JWT, password, tokens
│   ├── config/          # Configuration management
│   ├── db/              # Database connection
│   ├── server/          # HTTP routes
│   ├── service/         # Business logic
│   └── ws/              # WebSocket
├── frontend/            # React frontend
├── web/                 # Static fallback UI
├── docs/                # VitePress documentation site
└── deploy/              # Docker / Kubernetes configs
```

---

## Frontend Notes

The repository includes two frontend implementations:

| Directory | Content | Purpose |
|-----------|---------|---------|
| `frontend/` | React app | Development, testing, production builds |
| `web/` | Static HTML/JS | Fallback when `frontend/dist` is unavailable |

The backend prioritizes serving `frontend/dist`; if not found, falls back to `web/`.

---

## Configuration

### Configuration Source

**Key Point**: The backend reads directly from **process environment variables**. It does **NOT** auto-load `.env` files.

`.env.example` serves as:
- Configuration template and reference list
- Variable reference for Docker / Compose / CI

### Main Configuration Options

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `APP_PORT` | 8080 | HTTP listening port |
| `APP_ENV` | dev | Runtime environment |
| `DATABASE_DSN` | Local connection string | Database connection |
| `JWT_SECRET` | dev-secret-change-me | JWT secret key (MUST change in production) |
| `ALLOWED_ORIGINS` | Empty | CORS allowed origins (comma-separated) |
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access token validity period |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh token validity period |
| `LOG_LEVEL` | info | Log level |
| `LOG_FORMAT` | console | Log format |

### Production Environment Notes

For non-`dev` environments, you **MUST**:

1. Set a strong, random `JWT_SECRET`
2. Configure correct `ALLOWED_ORIGINS`
3. Ensure secure database connections

---

## Runtime Modes

| Mode | Runtime Content | Access URL | Use Case |
|------|-----------------|------------|----------|
| Local Development | Go + Vite dev | localhost:5173 | Daily development |
| Build Output | Go + frontend/dist | localhost:8080 | Pre-release testing |
| Static Fallback | Go + web/ | localhost:8080 | Demo scenarios |
| Docker Compose | Full stack containers | localhost:8080 | Quick experience |

---

## Common Commands

```bash
# Go tests
go test -race ./...

# Frontend tests
npm --prefix frontend run test

# Frontend build
npm --prefix frontend run build

# Code linting
make lint

# Code formatting
make fmt

# Full verification
make all
```

---

## Minimum Verification

For the first run, we recommend verifying these 5 steps:

1. Visit `/health` returns OK
2. Register a user
3. Login and create a room
4. Send a message
5. Refresh the page, confirm history loads

Detailed testing steps: [Manual Testing Guide](/en/manual-testing)

---

## Next Steps

- [Manual Testing](/en/manual-testing) — Complete functional verification
- [API Documentation](/en/api) — Interface details
- [Architecture](/en/architecture) — System structure
- [Learning Path](/en/learning-path) — Suggested study routes
