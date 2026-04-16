# Testing Specification

> **Status**: implemented
> **Created**: 2026-04-17

This directory contains test specifications and acceptance criteria for the ChatRoom project.

---

## Test Coverage Requirements

### Backend (Go)

| Package | Minimum Coverage | Test Type |
|---------|------------------|-----------|
| `internal/auth/` | 70% | Unit + Integration |
| `internal/ws/` | 70% | Unit + Integration |
| `internal/server/` | 70% | Integration |
| `internal/config/` | 70% | Unit |
| `internal/db/` | 70% | Unit |
| `internal/metrics/` | 70% | Unit |
| `internal/mw/` | 70% | Integration |

### Frontend (TypeScript/React)

| Area | Minimum Coverage | Test Type |
|------|------------------|-----------|
| `src/utils/` | 80% | Unit (Vitest) |
| `src/components/` | 60% | Component (React Testing Library) |
| `src/services/` | 70% | Unit + Integration |
| `src/hooks/` | 70% | Unit |

---

## Test Conventions

### Go Test Standards

#### Package Naming

Tests use the same package name as the code under test:

```go
// internal/ws/hub_test.go
package ws
```

#### Table-Driven Tests

```go
func TestHashPassword(t *testing.T) {
    tests := []struct {
        name        string
        input       string
        wantErr     bool
    }{
        {"valid input", "password123", false},
        {"empty input", "", false},
        {"long input", strings.Repeat("a", 1000), false},
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // test logic
        })
    }
}
```

#### Test Naming Conventions

| Test Type | Pattern | Example |
|-----------|---------|---------|
| Unit tests | `Test<Function>_<Scenario>_<Expected>` | `TestHashPassword_ValidInput_ReturnsHash` |
| Integration tests | `TestIntegration_<Feature>_<Scenario>` | `TestIntegration_Login_ValidCredentials_ReturnsTokens` |

### Frontend Test Standards

#### Test File Location

Co-located with source files:

```
src/utils/
├── format-date.ts
└── format-date.test.ts
```

#### Test Structure (Vitest)

```typescript
import { describe, it, expect } from 'vitest';
import { formatDate } from './format-date';

describe('formatDate', () => {
  it('formats ISO date to locale string', () => {
    expect(formatDate('2026-04-17T10:30:00Z')).toMatch(/\d{4}-\d{2}-\d{2}/);
  });

  it('handles invalid dates', () => {
    expect(() => formatDate('invalid')).toThrow();
  });
});
```

---

## Test Scenarios

### Authentication Tests

| Scenario | Test | Expected |
|----------|------|----------|
| Valid registration | Register with valid username/password | 201 Created, user in DB |
| Duplicate username | Register with existing username | 409 Conflict |
| Weak password | Register with short password | 400 Bad Request |
| Valid login | Login with correct credentials | 200 OK, tokens returned |
| Invalid password | Login with wrong password | 401 Unauthorized |
| Token refresh | Refresh with valid token | 200 OK, new access token |
| Expired token | Refresh with expired token | 401 Unauthorized |

### WebSocket Tests

| Scenario | Test | Expected |
|----------|------|----------|
| Valid connection | Connect with valid ticket | Connection established |
| Invalid ticket | Connect with expired ticket | Connection rejected |
| Message broadcast | Send message to room | All room members receive message |
| Room isolation | Send message in room A | Room B members do NOT receive |
| Reconnection | Reconnect after disconnect | Messages received during gap |

### HTTP API Tests

| Scenario | Test | Expected |
|----------|------|----------|
| GET /health | Request health endpoint | 200 OK, `{"status": "ok"}` |
| GET /ready | Request readiness endpoint | 200 OK, DB check included |
| GET /metrics | Request metrics endpoint | 200 OK, Prometheus format |
| POST /api/rooms | Create room with auth | 201 Created |
| GET /api/rooms | List rooms | 200 OK, array of rooms |

---

## Running Tests

### Backend Tests

```bash
# Start PostgreSQL first
docker compose up -d postgres

# Run all tests
go test -race ./...

# Run with coverage
go test -race -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Run specific package
go test -race ./internal/ws/
```

### Frontend Tests

```bash
# Run all tests
npm --prefix frontend run test

# Run with coverage
npm --prefix frontend run test:coverage

# Run specific test file
npm --prefix frontend run test -- src/utils/format-date.test.ts
```

---

## CI Test Integration

### GitHub Actions

```yaml
- name: Run Go tests
  run: go test -race -coverprofile=coverage.out ./...

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: coverage.out

- name: Run frontend tests
  run: npm --prefix frontend run test
```

---

## Test Fixtures

### Database Fixtures

Test data loaded before integration tests:

```go
func setupTestDB(t *testing.T) *gorm.DB {
    db, err := connectTestDB()
    if err != nil {
        t.Fatal(err)
    }
    
    // Seed test data
    db.Create(&User{Username: "alice", PasswordHash: "hashed"})
    db.Create(&User{Username: "bob", PasswordHash: "hashed"})
    db.Create(&Room{Name: "General", CreatedBy: alice.ID})
    
    return db
}
```

---

## Related Documents

- [Open Source Standards](../product/open-source-standards.md) - R4 (Test Coverage)
- [Code Quality Standards](../rfc/code-quality-standards.md) - Test standards
- [Security Standards](../rfc/security-standards.md) - Security tests

---

## Change History

| Date | Change |
|------|--------|
| 2026-04-17 | Initial testing specification created |
