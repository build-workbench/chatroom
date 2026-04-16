# API Specification

> **Status**: implemented
> **Created**: 2026-04-17

This directory contains API specifications for the ChatRoom project.

---

## API Overview

ChatRoom exposes REST API endpoints for authentication and room management, plus WebSocket connections for real-time messaging.

---

## API Endpoints Summary

### Authentication

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login and obtain tokens | No |
| POST | `/api/auth/refresh` | Refresh access token | Refresh token |
| POST | `/api/auth/logout` | Invalidate tokens | Access token |

### Rooms

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/api/rooms` | List available rooms | Access token |
| POST | `/api/rooms` | Create new room | Access token |
| GET | `/api/rooms/:id` | Get room details | Access token |

### Messages

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/api/rooms/:id/messages` | Get message history | Access token |

### Health & Metrics

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/health` | Liveness check | No |
| GET | `/healthz` | Kubernetes liveness | No |
| GET | `/ready` | Readiness check | No |
| GET | `/version` | Version information | No |
| GET | `/metrics` | Prometheus metrics | No |

### WebSocket

| Path | Description | Auth Required |
|------|-------------|---------------|
| `/ws` | WebSocket connection | Ticket (one-time) |

---

## Request/Response Schemas

### Authentication

#### Register Request

```json
POST /api/auth/register
{
  "username": "string (required, 3-50 chars)",
  "password": "string (required, 6-100 chars)"
}
```

#### Register Response

```json
201 Created
{
  "user_id": "uuid",
  "username": "string",
  "created_at": "ISO8601 timestamp"
}
```

#### Login Request

```json
POST /api/auth/login
{
  "username": "string",
  "password": "string"
}
```

#### Login Response

```json
200 OK
{
  "access_token": "JWT token",
  "refresh_token": "JWT token",
  "expires_in": 900
}
```

### Error Response Format

```json
400 Bad Request
{
  "error": "string",
  "message": "string",
  "details": "optional object"
}
```

---

## WebSocket Protocol

### Connection Flow

```
1. Client obtains WebSocket ticket via authenticated API call
2. Client connects to /ws with ticket as query parameter
3. Server validates ticket (one-time use)
4. Connection established, client joins rooms
```

### Message Format

```json
// Client → Server: Join room
{
  "type": "join",
  "room_id": "uuid"
}

// Client → Server: Send message
{
  "type": "message",
  "room_id": "uuid",
  "content": "string"
}

// Server → Client: Broadcast message
{
  "type": "message",
  "room_id": "uuid",
  "message": {
    "id": "uuid",
    "user_id": "uuid",
    "username": "string",
    "content": "string",
    "created_at": "ISO8601 timestamp"
  }
}

// Server → Client: Error
{
  "type": "error",
  "message": "string"
}
```

---

## API Versioning

API versioning is implicit via application version (SemVer). Breaking changes increment the major version.

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 10 requests | 1 minute (per IP) |
| `/api/auth/register` | 5 requests | 1 minute (per IP) |
| Other API endpoints | 100 requests | 1 minute (per IP) |
| WebSocket connections | 10 connections | per user |

---

## Related Documents

- [OpenAPI Specification](./openapi.yaml) - Machine-readable API definition
- [Security Standards](../rfc/security-standards.md) - Security requirements
- [Open Source Standards](../product/open-source-standards.md) - R2 (Documentation)

---

## Change History

| Date | Change |
|------|--------|
| 2026-04-17 | Initial API specification created |
