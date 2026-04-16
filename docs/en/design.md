# ChatRoom Design Documentation

## System Overview

ChatRoom is a real-time chat project for teaching and personal practice, with core goals of **Runnable, Understandable, Verifiable, Extendable**.

## Design Philosophy

| Principle | Practice |
|-----------|----------|
| Teaching First | Clear code, avoid over-abstraction |
| Moderate Features | Cover core scenarios, no feature bloat |
| Engineering Complete | Tests, CI, deployment, monitoring all included |
| Documentation Sync | Keep code and documentation consistent |

## Technology Selection Rationale

| Technology | Selection Reason |
|------------|------------------|
| Go + Gin | Good performance, mature ecosystem, teaching-friendly |
| GORM | ORM simplifies database operations, supports multiple databases |
| gorilla/websocket | Mature and stable, feature-complete |
| PostgreSQL | Powerful features, supports LISTEN/NOTIFY |
| React + TypeScript | Type-safe, rich ecosystem |
| Vite | Good dev experience, fast builds |
| Tailwind CSS v4 | No config file needed, atomic CSS |

---

## Module Breakdown

### Backend Architecture

```
cmd/server/main.go           # Entry: config, startup, graceful shutdown
│
├── internal/config/         # Configuration management
│   └── Load from environment, centralized validation
│
├── internal/db/             # Database layer
│   ├── Connect()            # Connection pool config
│   ├── Migrate()            # Auto migration
│   └── StartCleanup()       # Background cleanup
│
├── internal/auth/           # Auth module
│   ├── Password hashing (bcrypt)
│   ├── JWT issue and validate
│   ├── Refresh Token management
│   └── WebSocket Ticket management
│
├── internal/server/         # HTTP layer
│   ├── router.go            # Route definitions
│   └── handler.go           # Request handlers
│
├── internal/service/        # Business logic
│   ├── user.go              # User business
│   ├── room.go              # Room business
│   └── message.go           # Message business
│
├── internal/ws/             # WebSocket layer
│   ├── hub.go               # Room management
│   ├── conn.go              # Connection handling
│   └── realtime.go          # Distributed support
│
├── internal/mw/             # Middleware
│   ├── auth.go              # JWT validation
│   ├── ratelimit.go         # Rate limiting
│   └── cors.go              # Cross-origin
│
├── internal/metrics/        # Metrics
│   └── Prometheus definitions
│
├── internal/log/            # Logging
│   └── zerolog init
│
└── internal/models/         # Data models
    ├── User, Room, Message
    ├── RefreshToken
    ├── WSTicket, WSSession
```

### Frontend Architecture

```
frontend/src/
├── App.tsx                  # Root component, combines all Hooks
│
├── components/              # UI components
│   ├── ChatRoom.tsx         # Main chat room interface
│   ├── MessageList.tsx      # Message list
│   ├── MessageInput.tsx     # Message input
│   └── Sidebar.tsx          # Sidebar
│
├── hooks/                   # Custom Hooks
│   ├── useAuth.ts           # Auth state management
│   ├── useChat.ts           # Chat state management
│   └── useChatSocket.ts     # WebSocket management
│
├── screens/
│   └── AuthScreen.tsx       # Login/register page
│
├── api.ts                   # REST API wrapper
├── socket.ts                # WebSocket wrapper
├── storage.ts               # localStorage wrapper
├── types.ts                 # TypeScript type definitions
└── toast.tsx                # Toast notifications
```

---

## Key Design Decisions

### 1. Dual Token System

```
Access Token (JWT)
├── Short validity (15 min)
├── Stateless, server doesn't store
└── Used for API request auth

Refresh Token (Random string)
├── Long validity (7 days)
├── Stored in database
├── Supports revoke and rotation
└── Used to refresh Access Token
```

**Design Rationale**:
- Access Token short-term, limited impact if leaked
- Refresh Token revocable, supports "logout all devices"
- Token Rotation: new tokens on each refresh, reduces replay risk

### 2. WebSocket Ticket Authentication

WebSocket connections don't directly use Access Token, but authenticate via one-time ticket:

```
1. Frontend calls POST /api/v1/ws/tickets to get ticket
2. Backend generates JWT ticket, stores in ws_tickets table
3. Frontend carries ticket in WebSocket Subprotocol
4. Backend validates and consumes ticket, establishes connection
```

**Design Rationale**:
- Avoid exposing Access Token in URL (browser history, logs)
- Ticket consumed once, prevents replay attacks
- Ticket bound to room, prevents cross-room abuse

### 3. Hub Room Model

```
Hub (Global singleton)
├── rooms map[uint]*RoomHub  # Lazy loading
├── realtime *Realtime       # Distributed broadcast
└── cleanupAfter             # Empty room cleanup

RoomHub (Room-level)
├── Separate goroutine
├── All clients in room
├── register/unregister/broadcast
└── Auto cleanup empty room (after 3 min)
```

**Design Rationale**:
- Room-level isolation, avoids global lock contention
- Lazy loading reduces memory usage
- Auto cleanup releases resources

### 4. Distributed Support

Implement cross-instance message sync via PostgreSQL `LISTEN/NOTIFY`:

```
Instance A receives message
    │
    ├── Broadcast to local clients
    │
    └── NOTIFY chatroom_ws_events
            │
            ▼
        PostgreSQL
            │
            ▼
        Instance B receives NOTIFY
            │
            └── Broadcast to local clients
```

**Design Rationale**:
- Reuse existing PostgreSQL, no Redis needed
- Simple and reliable, good for teaching
- Production can replace with Redis Pub/Sub

### 5. Frontend State Management

Use React Hooks + Refs to break circular dependencies:

```typescript
// Store callbacks in ref to avoid useEffect dependency cycles
const chatResetRef = useRef<() => void>(() => {})
const socketCloseRef = useRef<() => void>(() => {})

// Assign later
chatResetRef.current = chat.resetChat
socketCloseRef.current = () => socketRef.current?.close()
```

**Design Rationale**:
- Avoid additional state management libraries
- Keep code concise, teaching-friendly
- Ref breaks cycles, Callback stays current

---

## Data Flow

### Authentication Data Flow

```
User input
    │
    ▼
API api.login()
    │
    ▼
POST /api/v1/auth/login
    │
    ▼
UserService.Login()
    ├── Query user
    ├── Verify password
    ├── Generate JWT
    ├── Generate RefreshToken
    └── Store RefreshToken
    │
    ▼
Return { access_token, refresh_token, user }
    │
    ▼
Frontend stores in localStorage
    │
    ▼
Subsequent requests carry Authorization: Bearer <token>
```

### WebSocket Data Flow

```
User sends message
    │
    ▼
Frontend socket.sendMessage(content)
    │
    ▼
WebSocket send { type: "message", content }
    │
    ▼
Server Client.readPump()
    ├── Parse message
    ├── Validate length
    └── Persist to DB
    │
    ▼
Broadcast to RoomHub.broadcast channel
    │
    ▼
RoomHub.run() goroutine
    ├── Distribute to all Client.send
    └── NOTIFY to other instances
    │
    ▼
Each Client.writePump()
    │
    ▼
Frontend WebSocket.onmessage
    │
    ▼
Update message list UI
```

---

## Security Considerations

### Implemented Security Measures

| Measure | Implementation |
|---------|----------------|
| Password Storage | bcrypt hash, cost=10 |
| JWT Secret | Mandatory validation in non-dev environments |
| Rate Limiting | IP + path dimension, token bucket |
| CORS | Strict origin validation |
| Input Validation | All request parameter validation |
| Message Length | Max 2000 chars per message |
| WS Message Size | Max 1 MB |
| WS Ticket | One-time consumption, replay protection |

### Frontend Security

| Measure | Description |
|---------|-------------|
| Token Storage | localStorage (simplified for teaching, production should use httpOnly cookie) |
| XSS Protection | React default escaping, avoid dangerouslySetInnerHTML |
| Sensitive Info | Passwords not logged, tokens not printed |

---

## Performance Considerations

### Backend Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Connection Pool | MaxOpenConns=20, MaxIdleConns=5 |
| Slow Clients | Disconnect when send buffer full |
| Room Cleanup | Empty rooms cleaned after 3 min |
| Metrics Collection | Prometheus middleware, low overhead |

### Frontend Optimizations

| Optimization | Implementation |
|--------------|----------------|
| Code Splitting | Vite auto handling |
| CSS | Tailwind CSS v4 atomic |
| WebSocket Reconnect | Exponential backoff, max 10 retries |
| Message Queue | Queue messages on disconnect, send after reconnect |

---

## Extension Directions

### Feature Extensions

| Feature | Implementation Approach |
|---------|------------------------|
| Rich Text Messages | `messages.metadata JSONB` field |
| Private Rooms | `rooms.visibility` field + permission check |
| @Mentions | Parse `@username`, generate notifications |
| Message Search | PostgreSQL full-text index or Elasticsearch |
| File Upload | S3/OSS + presigned URLs |
| Message Recall | Soft delete + broadcast recall event |

### Architecture Extensions

| Scenario | Solution |
|----------|----------|
| High Concurrency | Connection pool tuning, message queue |
| Multi-instance | Redis Pub/Sub instead of Postgres NOTIFY |
| Global Deployment | Multi-region database, edge nodes |
| Large Rooms | Room sharding, message partitioning |

---

## Development Conventions

### Code Style

| Language | Standard |
|----------|----------|
| Go | gofmt, goimports, Chinese comments, table-driven tests |
| TypeScript | ESLint, Prettier, function components + Hooks |
| Commits | Chinese, imperative, within 50 chars |

### Directory Conventions

```
internal/      # Internal packages, not exposed externally
cmd/           # Executable entry points
frontend/src/  # React source
web/           # Static fallback UI
docs/          # VitePress documentation
deploy/        # Deployment configs
```

### Testing Conventions

| Test Type | Location |
|-----------|----------|
| Go Unit Tests | `*_test.go`, same package |
| Go Integration Tests | Requires Postgres, runs in CI |
| Frontend Tests | `*.test.ts`, Vitest |

---

## Operations Considerations

### Health Checks

| Endpoint | Purpose |
|----------|---------|
| `/health` | Liveness check |
| `/healthz` | K8s-compatible liveness check |
| `/ready` | Readiness check (includes DB connectivity) |
| `/version` | Version info |

### Logging

| Config | Default Value |
|--------|---------------|
| Format | console (dev) / json (production) |
| Level | info |
| Output | stdout |

### Monitoring

| Metric | Type |
|--------|------|
| `chat_ws_connections` | Gauge |
| `chat_ws_messages_total` | Counter |
| `http_requests_total` | Counter |
| `http_request_duration_seconds` | Histogram |

### Cleanup Tasks

Background hourly execution:
- Clean expired/revoked Refresh Tokens
- Clean consumed/expired WebSocket Tickets
- Clean timed-out WebSocket Sessions
