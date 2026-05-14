# REST API Documentation

## Overview

ChatRoom provides a RESTful API for authentication and room management.

| Attribute | Value |
|-----------|-------|
| Base URL | `http://localhost:8080` |
| API Prefix | `/api/v1` |
| Authentication | Bearer Token (JWT) |
| Data Format | JSON |

## Authentication

All authenticated endpoints require a Bearer Token in the request header:

```
Authorization: Bearer <access_token>
```

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Request Parameters**

| Field | Type | Required | Constraint | Description |
|-------|------|----------|------------|-------------|
| username | string | Yes | 2-64 characters | Username, unique |
| password | string | Yes | 4-128 characters | Password |

**Error Responses**

| Status Code | Error Message | Description |
|-------------|---------------|-------------|
| 400 | invalid payload | Request parameter format error |
| 409 | username taken | Username already exists |
| 429 | too many requests | Too many requests |

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Response Example**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6789012345678901234567890abcdef...",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

**Token Description**

| Token Type | Validity | Storage Location | Purpose |
|------------|----------|------------------|---------|
| Access Token | 15 minutes (default) | Memory / localStorage | API request authentication |
| Refresh Token | 7 days (default) | Database + localStorage | Refresh Access Token |

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

::: tip Token Rotation
Each refresh will:
1. Validate the old Refresh Token's validity
2. Revoke the old Refresh Token
3. Issue a new Access Token + Refresh Token pair
:::

## Rooms

### Create Room

```http
POST /api/v1/rooms
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string"
}
```

### Get Room List

```http
GET /api/v1/rooms
Authorization: Bearer <access_token>
```

**Response Example**

```json
{
  "rooms": [
    {
      "id": 1,
      "name": "General",
      "online": 5
    }
  ]
}
```

### Get Room Messages

```http
GET /api/v1/rooms/:id/messages?limit=50&before_id=100
Authorization: Bearer <access_token>
```

| Parameter | Type | Default | Constraint | Description |
|-----------|------|---------|------------|-------------|
| limit | int | 50 | 1-200 | Number of messages to return |
| before_id | int | - | > 0 | Get messages before this ID (pagination cursor) |

## WebSocket Ticket

### Get Ticket

```http
POST /api/v1/ws/tickets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "room_id": 1
}
```

**Response Example**

```json
{
  "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 60
}
```

## Health Checks

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Liveness check |
| `GET /healthz` | K8s liveness check |
| `GET /ready` | Readiness check (includes database connectivity) |
| `GET /version` | Version information |
| `GET /metrics` | Prometheus metrics |

## Error Handling

All error responses use a unified format:

```json
{
  "error": "error message"
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Request parameter error |
| 401 | Unauthenticated or authentication failed |
| 409 | Resource conflict |
| 429 | Too many requests |
| 500 | Internal server error |

## Rate Limiting

| Configuration | Value |
|---------------|-------|
| Limit Dimension | IP + Path |
| Rate | 20 requests/second |
| Burst | 40 requests |

---

🌐 **Languages**: English | [简体中文](/en/api/rest)
