# RFC: Security Standards

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-17
> **Related**: [Open Source Standards](../product/open-source-standards.md) (R9)

This RFC defines the security standards and best practices for the ChatRoom project.

---

## Overview

Security-first design ensuring data protection, authentication integrity, and vulnerability prevention.

---

## Authentication Security

### Password Storage

- **Algorithm**: bcrypt
- **Cost factor**: 10
- **Implementation**: `internal/auth/password.go`

```go
import "golang.org/x/crypto/bcrypt"

func HashPassword(password string) (string, error) {
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(hash), err
}
```

### JWT Token Security

| Aspect | Implementation |
|--------|----------------|
| Signing algorithm | HS256 |
| Access token TTL | 15 minutes (configurable) |
| Refresh token TTL | 7 days (configurable) |
| Secret validation | Production mode rejects default secrets |

### Production JWT Validation

```go
if appEnv != "dev" && jwtSecret == "dev-secret-change-me" {
    log.Fatal("JWT_SECRET must be set to a strong random value in production")
}
```

**Validation**: Application refuses to start with default JWT_SECRET in non-dev environments.

---

## Network Security

### CORS Policy

| Setting | Configuration |
|---------|---------------|
| Allowed origins | Configurable via `ALLOWED_ORIGINS` env var |
| Allowed methods | GET, POST, PUT, DELETE |
| Allowed headers | Content-Type, Authorization |
| Credentials | Supported |

**Production**: Should be restricted to specific domain, not `*`.

### Rate Limiting

- **Algorithm**: Token bucket
- **Dimensions**: IP + path
- **Implementation**: `internal/mw/rate_limiter.go`

### WebSocket Security

| Measure | Implementation |
|---------|----------------|
| Connection tickets | One-time use, prevents replay attacks |
| Authentication | JWT required before connection |
| Room isolation | Users can only join authorized rooms |
| Message validation | Input sanitization before broadcast |

---

## Data Security

### Input Validation

All request parameters and bodies must be validated:

```go
type LoginRequest struct {
    Username string `json:"username" binding:"required,min=3,max=50"`
    Password string `json:"password" binding:"required,min=6,max=100"`
}
```

### Sensitive Data Handling

| Data Type | Protection |
|-----------|------------|
| Passwords | bcrypt hashed, never logged |
| JWT tokens | Not logged, transmitted over HTTPS |
| Database credentials | Environment variables only |
| User PII | Minimal collection, not logged |

### Logging Security

**Rules**:
- Never log passwords, tokens, or sensitive user input
- Use structured logging with configurable levels
- JSON log format for production

```go
// Safe logging
log.Info("User login", "username", username, "success", true)

// Unsafe - DO NOT DO THIS
log.Info("Login attempt", "password", password) // NEVER LOG PASSWORDS
```

---

## Secret Management

### Environment Variables

**Never commit to repository**:
- `JWT_SECRET`
- `DATABASE_DSN` (if containing passwords)
- API keys, tokens

**Template**: `.env.example` provides safe defaults for development.

### Git Secret Prevention

- `.gitignore` excludes `.env` files
- CI scans with gitleaks
- Pre-commit hooks recommended (optional)

---

## Security Scanning

### CI Pipeline Scans

| Scan | Tool | Target | Frequency |
|------|------|--------|-----------|
| Static Analysis | gosec | Go source code | Every commit |
| Dependency Audit | npm audit, go list -m -u | Dependencies | Every commit |
| Container Scan | trivy | Docker images | On release |
| Secret Detection | gitleaks | Git history | Every commit |

### Workflow: `.github/workflows/security.yml`

```yaml
name: Security
on:
  push:
    branches: [master]
  pull_request:
jobs:
  gosec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: securego/gosec@master
        with:
          args: ./...
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build image
        run: docker build -t chatroom .
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: chatroom
          severity: CRITICAL,HIGH
```

---

## Production Security Checklist

Before deploying to production:

- [ ] `JWT_SECRET` set to strong random value (32+ characters)
- [ ] `APP_ENV=production`
- [ ] `DATABASE_DSN` uses secure connection (SSL/TLS)
- [ ] `ALLOWED_ORIGINS` restricted to specific domain
- [ ] HTTPS enabled (reverse proxy or TLS)
- [ ] Rate limiting configured
- [ ] Security scans passing
- [ ] No secrets in repository

---

## Implemented Security Measures

| Measure | Status | Location |
|---------|--------|----------|
| Password hashing (bcrypt) | ✅ | `internal/auth/` |
| JWT validation | ✅ | `internal/auth/` |
| CORS policy | ✅ | `internal/mw/cors.go` |
| Rate limiting | ✅ | `internal/mw/rate_limiter.go` |
| Input validation | ✅ | All handlers |
| WebSocket tickets | ✅ | `internal/ws/` |
| Security scanning | ✅ | `.github/workflows/security.yml` |
| Production JWT check | ✅ | `internal/config/` |

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial security standards documented (Chinese) |
| 2026-04-17 | Migrated to SDD structure, translated to English |
