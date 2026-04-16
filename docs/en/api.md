# ChatRoom API Documentation

## Overview

ChatRoom provides RESTful APIs and WebSocket interfaces for real-time chat functionality.

| Attribute | Value |
|-----------|-------|
| Base URL | `http://localhost:8080` |
| API Prefix | `/api/v1` |
| Authentication | Bearer Token (JWT) |
| Data Format | JSON |

## Table of Contents

- [Authentication](#authentication)
  - [Register](#register)
  - [Login](#login)
  - [Refresh Token](#refresh-token)
- [Rooms](#rooms)
  - [Create Room](#create-room)
  - [List Rooms](#list-rooms)
  - [Get Room Messages](#get-room-messages)
- [WebSocket](#websocket)
  - [Get WebSocket Ticket](#get-websocket-ticket)
  - [Establish Connection](#establish-connection)
  - [Message Format](#message-format)
- [Health Checks](#health-checks)
- [Error Handling](#error-handling)

---

## Authentication

All endpoints requiring authentication must include a Bearer Token in the request header:

```
Authorization: Bearer <access_token>
```

### Register

Create a new user account.

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Request Parameters**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| username | string | Yes | 2-64 characters | Username, unique |
| password | string | Yes | 4-128 characters | Password |

**Response Example**

```json
{
  "id": 1,
  "username": "alice"
}
```

**Error Responses**

| Status | Error Message | Description |
|--------|---------------|-------------|
| 400 | invalid payload | Request parameter format error |
| 409 | username taken | Username already exists |
| 429 | too many requests | Rate limit exceeded |

---

### Login

User login to obtain access token and refresh token.

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

**Error Responses**

| Status | Error Message | Description |
|--------|---------------|-------------|
| 400 | invalid payload | Request parameter format error |
| 401 | invalid credentials | Incorrect username or password |
| 429 | too many requests | Rate limit exceeded |

---

### Refresh Token

Use refresh token to obtain a new access token (Token Rotation).

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "string"
}
```

**Response Example**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "new_refresh_token..."
}
```

::: tip Token Rotation
Each refresh will:
1. Validate the old Refresh Token
2. Revoke the old Refresh Token
3. Issue a new Access Token + Refresh Token pair
:::

**Error Responses**

| Status | Error Message | Description |
|--------|---------------|-------------|
| 400 | invalid payload | Request parameter format error |
| 401 | invalid refresh token | Refresh token invalid or expired |

---

## Rooms

### Create Room

Create a new chat room.

```http
POST /api/v1/rooms
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "string"
}
```

**Request Parameters**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| name | string | Yes | Max 128 chars | Room name, unique |

**Response Example**

```json
{
  "room": {
    "id": 1,
    "name": "General"
  }
}
```

**Error Responses**

| Status | Error Message | Description |
|--------|---------------|-------------|
| 400 | invalid payload | Request parameter format error |
| 401 | missing bearer token | No authentication token provided |
| 409 | room name taken | Room name already exists |

---

### List Rooms

Get all chat rooms with online user counts.

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
    },
    {
      "id": 2,
      "name": "Random",
      "online": 2
    }
  ]
}
```

**Notes**

- The `online` field shows current WebSocket connections in the room
- For distributed deployments, online count aggregates session data from all instances

---

### Get Room Messages

Get paginated message history for a specific room.

```http
GET /api/v1/rooms/:id/messages?limit=50&before_id=100
Authorization: Bearer <access_token>
```

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | int | Room ID |

**Query Parameters**

| Parameter | Type | Default | Constraints | Description |
|-----------|------|---------|-------------|-------------|
| limit | int | 50 | 1-200 | Number of messages to return |
| before_id | int | - | > 0 | Get messages before this ID (for pagination) |

**Response Example**

```json
{
  "messages": [
    {
      "type": "message",
      "id": 100,
      "room_id": 1,
      "user_id": 1,
      "username": "alice",
      "content": "Hello, world!",
      "created_at": "2025-01-08T10:00:00Z"
    },
    {
      "type": "message",
      "id": 99,
      "room_id": 1,
      "user_id": 2,
      "username": "bob",
      "content": "Hi there!",
      "created_at": "2025-01-08T09:59:00Z"
    }
  ]
}
```

::: tip Pagination Note
Messages are returned in ascending order by `id`. First load without `before_id`, subsequent loads use the earliest message's `id` as `before_id`.
:::

**Error Responses**

| Status | Error Message | Description |
|--------|---------------|-------------|
| 400 | invalid room id | Room ID format error |
| 401 | missing bearer token | No authentication token provided |
| 404 | room not found | Room does not exist |

---

## WebSocket

WebSocket connections require obtaining a one-time ticket first, then using the ticket to establish the connection.

### Get WebSocket Ticket

WebSocket uses one-time tickets for authentication instead of directly using Access Tokens.

```http
POST /api/v1/ws/tickets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "room_id": 1
}
```

**Request Parameters**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| room_id | int | Yes | Room ID to join |

**Response Example**

```json
{
  "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 60
}
```

**Ticket Description**

| Attribute | Value | Description |
|-----------|-------|-------------|
| Validity | 60 seconds (default) | Short-term valid, prevents replay attacks |
| Usage Count | 1 | One-time use, expires immediately after consumption |
| Room Binding | Yes | Ticket bound to specific room |

**Error Responses**

| Status | Error Message | Description |
|--------|---------------|-------------|
| 400 | invalid payload | Request parameter format error |
| 401 | missing bearer token | No authentication token provided |
| 404 | room not found | Room does not exist |

---

### Establish Connection

Establish WebSocket connection using the ticket.

```
ws://localhost:8080/ws?room_id=<room_id>
Subprotocol: chatroom.v1, ticket.<your_ticket>
```

**Connection Parameters**

| Parameter | Method | Description |
|-----------|--------|-------------|
| room_id | Query String | Room ID |
| ticket | Subprotocol | Ticket from `/ws/tickets` |

**JavaScript Example**

```javascript
// 1. Get ticket first
const ticketResp = await fetch('/api/v1/ws/tickets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ room_id: roomId })
})
const { ticket } = await ticketResp.json()

// 2. Establish WebSocket connection
const ws = new WebSocket(
  `ws://localhost:8080/ws?room_id=${roomId}`,
  ['chatroom.v1', `ticket.${ticket}`]
)
```

**Connection Lifecycle**

```
1. Client sends connection request (with ticket)
2. Server validates ticket (validity, room match, not consumed)
3. Server consumes ticket, establishes connection
4. Server broadcasts join event to other users in room
5. Client starts sending/receiving messages
6. On disconnect, server broadcasts leave event
```

---

### Message Format

All WebSocket messages use JSON format.

#### Client to Server

**Send Chat Message**

```json
{
  "type": "message",
  "content": "Hello, everyone!"
}
```

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| type | string | "message" | Message type |
| content | string | 1-2000 chars | Message content |

**Send Heartbeat**

```json
{
  "type": "ping"
}
```

**Send Typing Status**

```json
{
  "type": "typing",
  "is_typing": true
}
```

---

#### Server to Client

**Chat Message**

```json
{
  "type": "message",
  "id": 123,
  "room_id": 1,
  "user_id": 1,
  "username": "alice",
  "content": "Hello, everyone!",
  "created_at": "2025-01-08T10:00:00Z"
}
```

**User Join**

```json
{
  "type": "join",
  "room_id": 1,
  "user_id": 2,
  "username": "bob",
  "online": 5
}
```

**User Leave**

```json
{
  "type": "leave",
  "room_id": 1,
  "user_id": 2,
  "username": "bob",
  "online": 4
}
```

**Typing Status**

```json
{
  "type": "typing",
  "room_id": 1,
  "user_id": 1,
  "username": "alice",
  "is_typing": true
}
```

**Heartbeat Response**

```json
{
  "type": "pong"
}
```

**Error Message**

```json
{
  "type": "error",
  "content": "Message length cannot exceed 2000 characters"
}
```

---

### Heartbeat Mechanism

| Direction | Interval | Timeout | Description |
|-----------|----------|---------|-------------|
| Client → Server | 30 seconds | - | Send `ping` |
| Server → Client | - | 60 seconds | Wait for `ping`, disconnect on timeout |
| Server → Client | 30 seconds | - | Send `Ping` frame |
| Client → Server | - | - | Respond with `Pong` frame |

---

## Health Checks

### Liveness Check

```http
GET /health
```

**Response Example**

```json
{
  "status": "ok",
  "timestamp": "2025-01-08T10:00:00Z"
}
```

### Kubernetes-Compatible Liveness Check

```http
GET /healthz
```

**Response Example**

```json
{
  "status": "ok"
}
```

### Readiness Check

Check if service is ready to receive traffic (includes database connectivity).

```http
GET /ready
```

**Response Example**

```json
{
  "status": "ready",
  "checks": {
    "database": "healthy"
  }
}
```

**When Database is Unhealthy**

```json
{
  "status": "not_ready",
  "checks": {
    "database": "unhealthy"
  }
}
```

### Version Info

```http
GET /version
```

**Response Example**

```json
{
  "version": "v0.2.0",
  "git_commit": "abc1234",
  "build_time": "2025-01-08T10:00:00Z",
  "go_version": "go1.24"
}
```

---

## Metrics

```http
GET /metrics
```

Returns Prometheus-formatted metrics data, including:

| Metric Name | Type | Description |
|-------------|------|-------------|
| `chat_ws_connections` | Gauge | Current WebSocket connection count |
| `chat_ws_messages_total` | Counter | Cumulative message count |
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | HTTP request latency distribution |

---

## Error Handling

### Error Response Format

All error responses use a unified format:

```json
{
  "error": "error message"
}
```

### HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Request parameter error |
| 401 | Not authenticated or authentication failed |
| 403 | Forbidden |
| 404 | Resource not found |
| 409 | Resource conflict |
| 429 | Too many requests |
| 500 | Internal server error |

### Rate Limiting

API requests are protected by rate limiting:

| Configuration | Value |
|---------------|-------|
| Limit Dimension | IP + Path |
| Rate | 20 requests/second |
| Burst | 40 requests |

Returns `429 Too Many Requests` when exceeded.

---

## Configuration Parameters

| Environment Variable | Default Value | Description |
|---------------------|---------------|-------------|
| `ACCESS_TOKEN_TTL_MINUTES` | 15 | Access Token validity (minutes) |
| `REFRESH_TOKEN_TTL_DAYS` | 7 | Refresh Token validity (days) |
| `WS_TICKET_TTL_SECONDS` | 60 | WebSocket Ticket validity (seconds) |
