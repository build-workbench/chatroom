# API Specification

> **Status**: implemented
> **Created**: 2026-04-17
> **Updated**: 2026-04-23

This specification defines the REST API and WebSocket protocol for the ChatRoom application.

---

## ADDED Requirements

### Requirement: Authentication Endpoints
The system SHALL provide REST endpoints for user authentication.

#### Scenario: User Registration
- **WHEN** POST `/api/auth/register` is called with valid username and password
- **THEN** a new user is created and 201 Created is returned with user_id, username, and created_at

#### Scenario: Duplicate Username Registration
- **WHEN** POST `/api/auth/register` is called with an existing username
- **THEN** 409 Conflict is returned with error message

#### Scenario: User Login
- **WHEN** POST `/api/auth/login` is called with valid credentials
- **THEN** 200 OK is returned with access_token, refresh_token, and expires_in

#### Scenario: Invalid Login
- **WHEN** POST `/api/auth/login` is called with invalid credentials
- **THEN** 401 Unauthorized is returned

#### Scenario: Token Refresh
- **WHEN** POST `/api/auth/refresh` is called with valid refresh token
- **THEN** 200 OK is returned with new access_token

#### Scenario: User Logout
- **WHEN** POST `/api/auth/logout` is called with valid access token
- **THEN** tokens are invalidated and 200 OK is returned

---

### Requirement: Room Management Endpoints
The system SHALL provide REST endpoints for room management.

#### Scenario: List Rooms
- **WHEN** GET `/api/rooms` is called with valid access token
- **THEN** 200 OK is returned with array of room objects

#### Scenario: Create Room
- **WHEN** POST `/api/rooms` is called with valid access token and room details
- **THEN** 201 Created is returned with new room object

#### Scenario: Get Room Details
- **WHEN** GET `/api/rooms/:id` is called with valid access token
- **THEN** 200 OK is returned with room details or 404 Not Found

---

### Requirement: Message History Endpoint
The system SHALL provide REST endpoint for retrieving message history.

#### Scenario: Get Room Messages
- **WHEN** GET `/api/rooms/:id/messages` is called with valid access token
- **THEN** 200 OK is returned with array of messages for that room

---

### Requirement: Health Check Endpoints
The system SHALL provide health check endpoints for orchestration.

#### Scenario: Liveness Check
- **WHEN** GET `/health` or `/healthz` is called
- **THEN** 200 OK is returned with `{"status": "ok"}`

#### Scenario: Readiness Check
- **WHEN** GET `/ready` is called and database is accessible
- **THEN** 200 OK is returned with `{"status": "ready", "checks": {"database": "ok"}}`

#### Scenario: Version Information
- **WHEN** GET `/version` is called
- **THEN** 200 OK is returned with version, git_commit, and build_time

---

### Requirement: Metrics Endpoint
The system SHALL expose Prometheus metrics.

#### Scenario: Prometheus Metrics
- **WHEN** GET `/metrics` is called
- **THEN** Prometheus-formatted metrics are returned including http_requests_total, websocket_connections_active, etc.

---

### Requirement: WebSocket Protocol
The system SHALL provide WebSocket connection for real-time messaging.

#### Scenario: WebSocket Connection
- **WHEN** a client connects to `/ws?ticket=<one-time-ticket>` with a valid ticket
- **THEN** WebSocket connection is established

#### Scenario: Invalid WebSocket Ticket
- **WHEN** a client connects to `/ws` with invalid or expired ticket
- **THEN** connection is rejected

#### Scenario: Join Room
- **WHEN** client sends `{"type": "join", "room_id": "<uuid>"}`
- **THEN** client is subscribed to the room

#### Scenario: Send Message
- **WHEN** client sends `{"type": "message", "room_id": "<uuid>", "content": "text"}`
- **THEN** message is broadcast to all room members

#### Scenario: Receive Broadcast
- **WHEN** a message is broadcast to a room
- **THEN** all connected clients in that room receive `{"type": "message", "message": {...}}`

---

### Requirement: Rate Limiting
The system SHALL enforce rate limits on API endpoints.

#### Scenario: Login Rate Limit
- **WHEN** more than 10 login requests are made from same IP within 1 minute
- **THEN** subsequent requests are rejected with 429 Too Many Requests

#### Scenario: Registration Rate Limit
- **WHEN** more than 5 registration requests are made from same IP within 1 minute
- **THEN** subsequent requests are rejected

---

### Requirement: Error Response Format
The system SHALL return consistent error responses.

#### Scenario: Error Response
- **WHEN** an error occurs
- **THEN** response body contains `{"error": "error_code", "message": "description", "details": {}}`

---

## API Endpoint Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login and get tokens |
| POST | `/api/auth/refresh` | Refresh token | Refresh access token |
| POST | `/api/auth/logout` | Access token | Invalidate tokens |
| GET | `/api/rooms` | Access token | List rooms |
| POST | `/api/rooms` | Access token | Create room |
| GET | `/api/rooms/:id` | Access token | Get room details |
| GET | `/api/rooms/:id/messages` | Access token | Get message history |
| GET | `/health` | No | Liveness check |
| GET | `/healthz` | No | Kubernetes liveness |
| GET | `/ready` | No | Readiness check |
| GET | `/version` | No | Version info |
| GET | `/metrics` | No | Prometheus metrics |
| GET | `/ws` | Ticket | WebSocket connection |

---

## Change History

| Date | Change |
|------|--------|
| 2026-04-17 | Initial API specification created |
| 2026-04-23 | Migrated to OpenSpec format |
