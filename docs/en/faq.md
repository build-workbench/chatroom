# Frequently Asked Questions

## Project Positioning

### Is this project production-ready?

**No.** Its primary goal is personal practice and teaching demonstrations.

However, it's not just a "runs locally" demo. The project includes:

- Complete test coverage (Go + Frontend)
- CI/CD pipelines
- Docker and Kubernetes deployment configs
- Prometheus monitoring metrics
- VitePress documentation site

These engineering practices themselves are excellent learning materials.

### What can I learn from this?

**Backend**:
- Gin routing and middleware organization
- JWT + Refresh Token authentication flow
- GORM integration with PostgreSQL
- WebSocket room broadcasting implementation
- Distributed message sync (PostgreSQL NOTIFY)

**Frontend**:
- React Hooks state management
- WebSocket connection and reconnection strategies
- Token auto-refresh mechanism
- TypeScript type design

**Engineering**:
- Test writing and CI configuration
- Docker multi-stage builds
- Kubernetes deployment manifests
- Prometheus monitoring integration

---

## Technology Choices

### Why both REST API and WebSocket?

They solve different problems:

| Scenario | Technology Choice |
|----------|-------------------|
| Registration, Login | REST API |
| Room queries, history | REST API |
| Real-time messages | WebSocket |
| Online status, typing | WebSocket |

REST is suitable for "request-response" patterns, WebSocket for "real-time push". This is standard architecture for many modern applications.

### Why PostgreSQL instead of Redis?

**Current phase**: PostgreSQL is sufficient for our needs, reducing technology stack complexity.

**Distributed support**: Use PostgreSQL `LISTEN/NOTIFY` for cross-instance message sync without introducing Redis.

**Future extension**: For higher performance or richer features, can smoothly migrate to Redis Pub/Sub.

### Why Tailwind CSS v4?

- No config file needed (`tailwind.config.js`)
- Faster builds (Rust-based engine)
- Atomic CSS, high development efficiency
- Teaching-friendly, reduces CSS abstraction

---

## Frontend Questions

### Why both `frontend/` and `web/`?

| Directory | Content | Purpose |
|-----------|---------|---------|
| `frontend/` | React app | Development, testing, builds |
| `web/` | Static HTML/JS | Fallback when `frontend/dist` unavailable |

This is a teaching-friendly design:
- Demonstrates "build artifact hosting" concept
- Project still runs even if frontend build fails

### What testing framework is used?

- **Framework**: Vitest
- **Test Types**: Unit tests (API, Socket, Storage)
- **Test Count**: 20 test cases

Run tests:
```bash
npm --prefix frontend run test
```

### Where are tokens stored?

**Current implementation**: localStorage (simplified for teaching)

**Production recommendations**:
- Access Token: memory + httpOnly cookie
- Refresh Token: httpOnly cookie + Secure + SameSite

localStorage has XSS risks, but teaching projects prioritize simplicity.

---

## Backend Questions

### What code should I read first?

Recommended reading order:

1. `cmd/server/main.go` — Understand startup flow
2. `internal/config/config.go` — Understand configuration source
3. `internal/server/router.go` — Understand route structure
4. `internal/service/user.go` — Understand business logic
5. `internal/ws/hub.go` — Understand WebSocket room model
6. `internal/ws/conn.go` — Understand message handling
7. `frontend/src/App.tsx` — Understand frontend architecture

### How is configuration loaded?

**Key Point**: Backend reads directly from process environment variables, **does NOT auto-load `.env` files**.

```bash
# .env.example is a config template
# Running go run ./cmd/server won't read .env

# Method 1: Direct environment variable
export JWT_SECRET=your-secret
go run ./cmd/server

# Method 2: Docker Compose
# docker-compose.yml configures via environment

# Method 3: Manual source
set -a && source .env && set +a
go run ./cmd/server
```

### How does WebSocket authenticate?

WebSocket uses **one-time tickets** for authentication, not directly using Access Tokens:

```
1. Frontend calls POST /api/v1/ws/tickets to get ticket
2. Backend generates and stores ticket (valid for 60 seconds)
3. Frontend carries ticket in WebSocket Subprotocol
4. Backend validates and consumes ticket
5. WebSocket connection established
```

**Design rationale**:
- Avoid exposing Access Token in URL
- Ticket consumed once, prevents replay attacks
- Bound to specific room, prevents cross-room abuse

---

## Deployment Questions

### What is `ALLOWED_ORIGINS` for?

Origin validation for non-`dev` environments:

| Scenario | Validation Method |
|----------|-------------------|
| HTTP CORS | Check if Origin header is in whitelist |
| WebSocket upgrade | Check if Origin header is in whitelist |

If whitelist miss, only strict same-origin requests are allowed.

**Config Example**:
```dotenv
ALLOWED_ORIGINS=https://chat.example.com,https://app.example.com:8443
```

### How to run in Docker?

```bash
# Full environment (database + app)
docker compose up -d

# Database only
docker compose up -d postgres
go run ./cmd/server

# With monitoring
docker compose --profile monitoring up -d
```

### How is the documentation site published?

GitHub Actions workflow is configured in the repository:

1. Push to `master` branch
2. Auto-build VitePress documentation site
3. Deploy to GitHub Pages

Enable GitHub Pages in repository settings for first-time use.

---

## Testing Questions

### Why does Go testing need PostgreSQL?

Some tests require a real database:
- User registration/login
- Token storage/validation
- Message persistence

```bash
# Start database
docker compose up -d postgres

# Run tests
go test -race ./...
```

### How to run all tests?

```bash
# Go tests
make test
# or
go test -race -cover ./...

# Frontend tests
npm --prefix frontend run test

# All tests
make test && npm --prefix frontend run test
```

---

## Development Questions

### How to contribute code?

1. Fork the repository
2. Create branch: `git checkout -b feature/your-feature`
3. Commit code: Follow commit message conventions (Chinese, imperative)
4. Ensure tests pass: `make test`
5. Ensure linting passes: `make lint`
6. Create Pull Request

See [Contributing Guide](https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md) for details.

### What if I encounter problems?

1. Check [API Documentation](/en/api)
2. Check [Architecture Documentation](/en/architecture)
3. Check [Manual Testing](/en/manual-testing)
4. Search or ask in GitHub Issues

---

## Other Questions

### What is the Git branch strategy?

- `master`: Main branch, default branch
- `feature/*`: Feature branches
- `fix/*`: Fix branches

### Version numbering rules?

Follows [Semantic Versioning](https://semver.org/):
- `MAJOR`: Incompatible API changes
- `MINOR`: Backward-compatible feature additions
- `PATCH`: Backward-compatible bug fixes

Current version: `0.2.x`
