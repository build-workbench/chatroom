# Development Guide

This document explains how to set up your development environment, run tests, and contribute to the project.

## Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| Go | 1.24+ | Backend development |
| Node.js | 20+ | Frontend development, docs build |
| Docker | Latest | PostgreSQL database |
| Make | Any | Build commands |

## Quick Start

### 1. Start Database

```bash
# Start PostgreSQL using Docker
docker compose up -d postgres

# Or manually
docker run -d --name chatroom-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chatroom \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration (defaults work for development)
# Note: The app doesn't auto-load .env files
export $(cat .env | xargs)
```

### 3. Start Backend

```bash
# Download dependencies and run
go mod download
go run ./cmd/server

# Or use Make
make run
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server automatically proxies `/api` and `/ws` to the backend at `localhost:8080`.

## Common Commands

### Backend

```bash
go mod tidy                    # Tidy dependencies
go build ./...                 # Build all packages
go test -race ./...            # Run tests with race detection
go test -cover ./...           # Run tests with coverage
```

### Frontend

```bash
cd frontend
npm run lint       # Lint check
npm run test       # Run tests
npm run build      # Production build
```

### Documentation

```bash
cd docs
npm install
npm run docs:dev   # Local preview
npm run docs:build # Build docs site
```

## Project Structure

```
chatroom/
├── cmd/server/        # Application entrypoint
├── internal/          # Private application code
│   ├── auth/          # JWT authentication
│   ├── config/        # Configuration management
│   ├── db/            # Database connection
│   ├── models/        # Data models
│   ├── mw/            # HTTP middleware
│   ├── sanitize/      # Input sanitization
│   ├── server/        # HTTP handlers
│   ├── service/       # Business logic
│   └── ws/            # WebSocket implementation
├── frontend/          # React frontend
│   └── src/
│       ├── components/  # UI components
│       ├── hooks/       # Custom hooks
│       ├── screens/     # Page components
│       └── test/        # Test utilities
├── docs/              # VitePress documentation
├── openspec/          # OpenSpec specifications
└── deploy/            # Deployment configs
```

## OpenSpec Workflow

This project uses OpenSpec-driven development:

1. **Explore**: `/opsx:explore` - Deep dive into requirements
2. **Propose**: `/opsx:propose <name>` - Create change proposal
3. **Implement**: `/opsx:apply <name>` - Execute tasks
4. **Archive**: `/opsx:archive <name>` - Complete and archive

See `openspec/specs/` for detailed specifications.

## Code Standards

### Go

- Use `golangci-lint` for linting
- Follow Go official style
- Test critical business logic

### TypeScript

- Use ESLint + Prettier
- Strict TypeScript mode
- Functional components with Hooks

### Commits

Use Conventional Commits:

```
feat: add new feature
fix: fix bug
docs: documentation update
refactor: code refactoring
test: test related
chore: build/tool changes
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_PORT` | 8080 | HTTP port |
| `APP_ENV` | dev | Environment |
| `DATABASE_DSN` | - | PostgreSQL connection string |
| `JWT_SECRET` | dev-secret-change-me | JWT secret (must change in production) |
| `ALLOWED_ORIGINS` | - | CORS whitelist |
| `WS_MAX_MESSAGE_SIZE` | 1048576 | Max WebSocket message bytes |
| `WS_MAX_CONTENT_SIZE` | 2000 | Max chat message characters |
| `DB_MAX_IDLE_CONNS` | 5 | DB pool idle connections |
| `DB_MAX_OPEN_CONNS` | 20 | DB pool max connections |

## Troubleshooting

### Database Connection Failed

Ensure PostgreSQL is running:

```bash
docker compose up -d postgres
docker compose ps
```

### Frontend Can't Connect to Backend

Check if backend is running on port 8080. Vite dev server auto-proxies requests.

### Tests Failing

Tests require PostgreSQL:

```bash
docker compose up -d postgres
go test ./...
```

## More Resources

- [API Documentation](./api.md)
- [Architecture](./architecture.md)
- [Monitoring Guide](./monitoring/README.md)
