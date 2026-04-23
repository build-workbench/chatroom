# ChatRoom Architecture Documentation

## System Overview

ChatRoom is a real-time chat application using a frontend-backend separated architecture, supporting WebSocket real-time communication. The project is designed for teaching, emphasizing code readability and engineering practices.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go 1.24, Gin, GORM, gorilla/websocket, zerolog |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| Monitoring | Prometheus, Grafana |
| Deployment | Docker, Kubernetes |

## Directory Structure

```
chatroom/
├── cmd/server/              # Application entry point
│   └── main.go              # Startup, configuration, graceful shutdown
├── internal/                # Internal packages (not importable by external)
│   ├── auth/                # JWT, password hashing, token management
│   ├── config/              # Configuration loading and validation
│   ├── db/                  # Database connection, migrations, cleanup
│   ├── log/                 # zerolog initialization
│   ├── metrics/             # Prometheus metrics
│   ├── models/              # GORM data models
│   ├── mw/                  # Gin middleware (auth, rate limit, CORS)
│   ├── quality/             # Code quality tools
│   ├── server/              # HTTP routes and handlers
│   ├── service/             # Business logic layer
│   └── ws/                  # WebSocket Hub, connections, distributed support
├── frontend/                # React main frontend
│   └── src/
│       ├── components/      # UI components
│       ├── hooks/           # Custom Hooks
│       ├── screens/         # Page components
│       └── *.ts             # API, Socket, Storage, etc.
├── web/                     # Static fallback UI
├── docs/                    # VitePress documentation site
├── deploy/                  # Deployment configs
│   ├── docker/              # Dockerfile
│   ├── k8s/                 # Kubernetes manifests
│   └── prometheus/          # Prometheus configuration
└── openspec/                # Specifications and active changes
```

## Architecture Diagram

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   Browser   │  │   Browser   │  │   Browser   │   ...            │
│  │  (React)    │  │  (React)    │  │  (React)    │                  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │
│         │                │                │                          │
│         └────────────────┼────────────────┘                          │
│                          │                                           │
│              HTTP REST / WebSocket                                   │
└──────────────────────────┼───────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────────┐
│                    Application Layer                                 │
├──────────────────────────┼───────────────────────────────────────────┤
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Gin HTTP Server                             │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │  │
│  │  │  REST API   │  │  WebSocket  │  │   Static    │            │  │
│  │  │  Handlers   │  │   Handler   │  │   Files     │            │  │
│  │  └──────┬──────┘  └──────┬──────┘  └─────────────┘            │  │
│  └─────────┼────────────────┼────────────────────────────────────┘  │
│            │                │                                        │
│            ▼                ▼                                        │
│  ┌─────────────────┐  ┌─────────────────────────────────────────┐   │
│  │   Service Layer │  │           WebSocket Layer                │   │
│  │  ┌───────────┐  │  │  ┌─────────────────────────────────┐    │   │
│  │  │ UserService│  │  │  │            Hub                  │    │   │
│  │  ├───────────┤  │  │  │  ┌─────────┐  ┌─────────┐       │    │   │
│  │  │ RoomService│  │  │  │  │RoomHub 1│  │RoomHub 2│  ...  │    │   │
│  │  ├───────────┤  │  │  │  └────┬────┘  └────┬────┘       │    │   │
│  │  │MsgService │  │  │  │       │            │             │    │   │
│  │  └───────────┘  │  │  │  ┌────┴────┐  ┌────┴────┐       │    │   │
│  └─────────────────┘  │  │  │Clients  │  │Clients  │       │    │   │
│                       │  │  └─────────┘  └─────────┘       │    │   │
│                       │  └─────────────────────────────────┘    │   │
│                       │                 │                        │   │
│                       │                 ▼                        │   │
│                       │     ┌───────────────────┐                │   │
│                       │     │    Realtime       │                │   │
│                       │     │ (Postgres NOTIFY) │                │   │
│                       │     └───────────────────┘                │   │
│                       └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────────┐
│                       Data Layer                                     │
├──────────────────────────┼───────────────────────────────────────────┤
│                          ▼                                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    PostgreSQL 16                              │  │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐       │  │
│  │  │  users  │ │  rooms  │ │ messages │ │refresh_tokens│       │  │
│  │  └─────────┘ └─────────┘ └──────────┘ └──────────────┘       │  │
│  │  ┌─────────────┐ ┌─────────────┐                             │  │
│  │  │ ws_sessions │ │ ws_tickets  │                             │  │
│  │  └─────────────┘ └─────────────┘                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Module Details

### cmd/server

Application entry point, responsibilities:

1. **Configuration Loading**: Call `config.Load()` to read config from environment variables
2. **Logger Initialization**: Call `clog.Init()` to configure zerolog
3. **Config Validation**: Call `config.Validate()` to ensure required parameters are valid
4. **Database Connection**: Call `db.Connect()` to establish connection pool
5. **Database Migration**: Call `db.Migrate()` for automatic schema migration
6. **Cleanup Task**: Call `db.StartCleanup()` for periodic data cleanup
7. **Create Hub**: Call `ws.NewHub()` to create WebSocket manager
8. **Build Router**: Call `server.SetupRouter()` to create Gin engine
9. **Start HTTP Service**: Listen for requests in a separate goroutine
10. **Graceful Shutdown**: Catch signals, shutdown Hub, cleanup tasks, HTTP service, DB connection in order

### internal/config

Configuration management module:

```go
type Config struct {
    Port                  string   // HTTP listening port
    DatabaseDSN           string   // Database connection string
    JWTSecret             string   // JWT signing key
    Env                   string   // Runtime environment (dev/staging/production)
    LogLevel              string   // Log level
    LogFormat             string   // Log format (console/json)
    AccessTokenTTLMinutes int      // Access Token validity
    RefreshTokenTTLDays   int      // Refresh Token validity
    WSTicketTTLSeconds    int      // WebSocket Ticket validity
    AllowedOrigins        []string // CORS allowed origins
    PodID                 string   // Instance identifier (distributed scenarios)
}
```

**Security Validation**:
- Non-`dev` environments cannot use default JWT secret
- Validate `ALLOWED_ORIGINS` format
- Validate `LOG_LEVEL` is valid

### internal/auth

Authentication and authorization module:

| Function | Purpose |
|----------|---------|
| `HashPassword` | Hash password using bcrypt |
| `VerifyPassword` | Verify password against hash |
| `GenerateAccessToken` | Issue JWT Access Token |
| `ParseAccessToken` | Parse and validate JWT |
| `GenerateRefreshToken` | Generate random Refresh Token |
| `ValidateRefreshToken` | Validate Refresh Token |
| `RevokeRefreshToken` | Revoke Refresh Token |
| `GenerateAndStoreWSTicket` | Generate and store WebSocket Ticket |
| `ValidateAndConsumeWSTicket` | Validate and consume WebSocket Ticket |

### internal/server

HTTP service layer:

```
Handler ──depends on──> Service Interface ──implements──> Service Struct ──depends on──> *gorm.DB
```

**Route Design**:

```
/health      GET  Health check
/healthz     GET  Health check (K8s compatible)
/ready       GET  Readiness check
/version     GET  Version info
/metrics     GET  Prometheus metrics

/api/v1/auth/register    POST   User registration
/api/v1/auth/login       POST   User login
/api/v1/auth/refresh     POST   Refresh token

/api/v1/rooms            GET    Room list
/api/v1/rooms            POST   Create room
/api/v1/rooms/:id/messages  GET Get messages

/api/v1/ws/tickets       POST   Get WS Ticket

/ws                      GET    WebSocket connection
```

### internal/service

Business logic layer, encapsulating core business:

- **UserService**: User registration, login, token refresh
- **RoomService**: Room creation, query, online user count
- **MessageService**: Message pagination query, username batch resolution

### internal/ws

WebSocket core module:

#### Hub Structure

```
Hub (Global)
├── rooms map[uint]*RoomHub  # Room ID → RoomHub
├── realtime *Realtime       # Distributed support (Postgres NOTIFY)
└── cleanupAfter             # Empty room cleanup time

RoomHub (Room-level)
├── clients map[*Client]bool # All connections in room
├── register   chan *Client  # Register channel
├── unregister chan *Client  # Unregister channel
├── broadcast  chan []byte   # Broadcast channel
├── stop       chan struct{} # Stop signal
└── online     int32         # Online count
```

#### Message Flow

```
Client.readPump()
    │
    ├─ ping ──────> Update heartbeat time ──> Reply pong
    │
    ├─ typing ────> Broadcast typing event
    │
    └─ message ───> Persist to DB ──> Broadcast message event
                         │
                         ▼
                   RoomHub.broadcast
                         │
                         ▼
                   All Client.writePump()
```

#### Realtime (Distributed Support)

PostgreSQL `LISTEN/NOTIFY` for cross-instance message synchronization:

```
Instance A                Postgres                    Instance B
   │                         │                          │
   │  NOTIFY chatroom_ws_events                        │
   ├────────────────────────>│                          │
   │                         │  NOTIFY chatroom_ws_events
   │                         │<─────────────────────────┤
   │                         │                          │
   │  LISTEN ───────────────>│                          │
   │                         │<─────────── LISTEN       │
   │                         │                          │
   │           Receive notification, broadcast to local clients
```

### internal/db

Database management module:

| Function | Purpose |
|----------|---------|
| `Connect` | Establish database connection, configure connection pool |
| `Migrate` | Automatic table schema migration |
| `StartCleanup` | Start background cleanup task |

**Cleanup Task** (runs hourly):
- Clean expired Refresh Tokens
- Clean consumed/expired WebSocket Tickets
- Clean timed-out WebSocket Sessions

### internal/mw

HTTP middleware:

| Middleware | Function |
|------------|----------|
| `AuthMiddleware` | Bearer Token validation, inject user info to Context |
| `RateLimit` | IP + path dimension token bucket rate limiting |
| `CORS` | Cross-origin request handling |

### internal/metrics

Prometheus metrics:

| Metric | Type | Description |
|--------|------|-------------|
| `chat_ws_connections` | Gauge | Current WebSocket connection count |
| `chat_ws_messages_total` | Counter | Cumulative message count |
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | Request latency distribution |

## Data Models

### ER Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │    rooms     │       │   messages   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │       │ id (PK)      │       │ id (PK)      │
│ username     │       │ name         │       │ room_id (FK) │
│ password_hash│       │ owner_id(FK) │───────│ user_id (FK) │
│ created_at   │       │ created_at   │       │ content      │
│ updated_at   │       │ updated_at   │       │ created_at   │
└──────────────┘       └──────────────┘       └──────────────┘
       │                      │
       │                      │
       ▼                      │
┌──────────────┐              │
│refresh_tokens│              │
├──────────────┤              │
│ id (PK)      │              │
│ user_id (FK) │              │
│ token        │              │
│ expires_at   │              │
│ revoked_at   │              │
│ created_at   │              │
└──────────────┘              │
                              │
┌──────────────┐              │
│  ws_tickets  │              │
├──────────────┤              │
│ ticket_id(PK)│              │
│ user_id (FK) │◄─────────────┘
│ room_id (FK) │
│ expires_at   │
│ consumed_at  │
│ created_at   │
│ updated_at   │
└──────────────┘

┌──────────────┐
│ ws_sessions  │
├──────────────┤
│ session_id(PK)│
│ room_id (FK) │
│ user_id (FK) │
│ pod_id       │
│ last_seen_at │
│ created_at   │
│ updated_at   │
└──────────────┘
```

### Table Descriptions

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| `users` | User accounts | username (unique) |
| `rooms` | Chat rooms | name (unique), owner_id |
| `messages` | Chat messages | room_id, user_id, created_at |
| `refresh_tokens` | Refresh tokens | user_id, token (unique), expires_at |
| `ws_tickets` | WebSocket auth tickets | user_id, room_id, expires_at |
| `ws_sessions` | WebSocket sessions (distributed online stats) | room_id, user_id, pod_id |

## Key Processes

### Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  User   │     │ Frontend│     │ Backend  │     │ Database│
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
     │               │               │                │
     │ Enter username/password       │                │
     │──────────────>│               │                │
     │               │  POST /login  │                │
     │               │──────────────>│                │
     │               │               │   Query user   │
     │               │               │───────────────>│
     │               │               │   Return user  │
     │               │               │<───────────────│
     │               │               │                │
     │               │               │ Verify password│
     │               │               │ Generate JWT   │
     │               │               │ Generate RT    │
     │               │               │ Store RT       │
     │               │               │───────────────>│
     │               │  access_token │                │
     │               │  refresh_token│                │
     │               │<──────────────│                │
     │ Store to localStorage         │                │
     │<──────────────│               │                │
```

### WebSocket Connection Flow

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────────┐
│  User   │     │ Frontend│     │ Backend  │     │ Database│
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬────┘
     │               │               │                │
     │ Enter room    │               │                │
     │──────────────>│               │                │
     │               │ POST /ws/tickets              │
     │               │──────────────>│                │
     │               │               │ Generate Ticket│
     │               │               │ Store Ticket   │
     │               │               │───────────────>│
     │               │   ticket      │                │
     │               │<──────────────│                │
     │               │               │                │
     │               │ WebSocket connection            │
     │               │ (with ticket) │                │
     │               │──────────────>│                │
     │               │               │ Validate Ticket│
     │               │               │ Consume Ticket │
     │               │               │───────────────>│
     │               │               │ Create Session │
     │               │               │───────────────>│
     │               │               │                │
     │               │               │ Broadcast join │
     │               │<──────────────│                │
     │ Show user joined              │                │
     │<──────────────│               │                │
```

## Deployment Architecture

### Single Instance Deployment

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────>│  ChatRoom   │────>│ PostgreSQL  │
│  (Reverse   │     │    App      │     │  Database   │
│   Proxy)    │     └─────────────┘     └─────────────┘
└─────────────┘           │
      │                   │ (optional)
      ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Prometheus  │     │   Grafana   │
└─────────────┘     └─────────────┘
```

### Kubernetes Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                        Kubernetes                            │
│                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │   Ingress   │   │   Service   │   │  ConfigMap  │        │
│  │  (Nginx)    │   │  (ClusterIP)│   │  + Secret   │        │
│  └──────┬──────┘   └──────┬──────┘   └─────────────┘        │
│         │                 │                                  │
│         ▼                 ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Deployment (HPA)                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Pod 1   │  │  Pod 2   │  │  Pod N   │            │   │
│  │  │ (ChatRoom│  │ (ChatRoom│  │ (ChatRoom│   ...      │   │
│  │  └──────────┘  └──────────┘  └──────────┘            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PostgreSQL StatefulSet                   │   │
│  │              (or external database service)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Security Design

### Authentication & Authorization

| Mechanism | Description |
|-----------|-------------|
| JWT Access Token | Short-term valid (default 15 min), used for API authentication |
| Refresh Token | Long-term valid (default 7 days), stored in database, supports rotation |
| WebSocket Ticket | One-time ticket (default 60 sec), prevents token leakage |

### Protection Measures

| Measure | Implementation |
|---------|----------------|
| Password Hashing | bcrypt, cost=10 |
| Rate Limiting | IP + path dimension, token bucket algorithm |
| CORS Validation | Strict origin whitelist |
| Input Validation | All request parameter validation |
| Message Length Limit | Max 2000 characters per message |
| WebSocket Message Size | Max 1 MB |

### Production Environment Recommendations

1. **JWT Secret**: Use strong random key (≥32 bytes)
2. **HTTPS**: Must enable TLS in production
3. **Database**: Use strong password, restrict network access
4. **ALLOWED_ORIGINS**: Strictly configure allowed frontend domains

## Extension Considerations

### Horizontal Scaling

Current WebSocket Hub only shares within single process. Horizontal scaling requires:

1. **PostgreSQL NOTIFY** (implemented): Cross-instance message broadcasting
2. **Session Persistence** (implemented): `ws_sessions` table stores online state
3. **Sticky Sessions** (optional): Ensure WebSocket connections route to same instance

### Feature Extension Suggestions

| Feature | Implementation Approach |
|---------|------------------------|
| Rich Text Messages | Add `metadata JSONB` field to `messages` table |
| Private Rooms | Add `visibility` field to `rooms` table |
| Message Search | Full-text index or Elasticsearch |
| File Upload | Object storage + presigned URLs |
