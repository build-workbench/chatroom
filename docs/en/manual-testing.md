# Manual Testing Guide

This guide organizes core features into an experiment checklist, suitable for classroom demonstrations or personal verification.

## Test Objectives

After completion, you will have verified:

- ✅ Service starts correctly
- ✅ User registration and login work
- ✅ Room creation and switching work
- ✅ WebSocket real-time communication works
- ✅ Online count and typing status work
- ✅ History message loading works
- ✅ Token auto-refresh works
- ✅ Static fallback interface works

---

## Prerequisites

### Start Services

```bash
# 1. Start database
docker compose up -d postgres

# 2. Start backend
go run ./cmd/server

# 3. Start frontend (another terminal)
npm --prefix frontend run dev
```

### Access URLs

| Service | URL |
|---------|-----|
| Frontend Dev Server | http://localhost:5173 |
| Backend Home | http://localhost:8080 |
| Health Check | http://localhost:8080/health |
| Readiness Check | http://localhost:8080/ready |
| Version Info | http://localhost:8080/version |

---

## Test 1: Verify Service Startup

### Operations

```bash
# Liveness check
curl http://localhost:8080/health

# Readiness check
curl http://localhost:8080/ready

# Version info
curl http://localhost:8080/version
```

### Expected Results

- `/health` returns `{"status": "ok", ...}`
- `/ready` returns `{"status": "ready", "checks": {"database": "healthy"}}`
- `/version` returns version info JSON

### Verification Points

- Service listening on correct port
- Database connection normal
- Version info displayed correctly

---

## Test 2: User Registration and Login

### Operations

1. Open http://localhost:5173
2. Click "Register" tab
3. Enter username (e.g., `alice`) and password (e.g., `testpass`)
4. Click "Register" button
5. After successful registration, login with same credentials

### Expected Results

- Registration successful, shows success message
- Login successful, enters main chat interface
- Left side shows room list area
- Top shows current username

### Verification Points

- Username uniqueness check (registering duplicate should fail)
- Password length check (4-128 characters)
- Token correctly stored after login

### Advanced: Command Line Verification

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}'
```

---

## Test 3: Create Room

### Operations

1. After login, find "Create Room" in left sidebar
2. Enter room name (e.g., `general`)
3. Click "Create" button

### Expected Results

- Room created successfully, shows success message
- Automatically enters newly created room
- New room appears in room list
- Shows room name and online count

### Verification Points

- Room name uniqueness check
- Creator automatically enters room
- Online count correct (initially 1)

---

## Test 4: Dual Window Real-time Communication

### Operations

1. Keep current browser window (User A)
2. Open new incognito/private window
3. Register and login second user (e.g., `bob`)
4. Enter same room
5. Send messages from both windows

### Expected Results

- Both windows see each other's messages in real-time
- Join/leave notifications visible
- Online count changes as users enter/leave

### Verification Points

- WebSocket connection normal
- Messages broadcast in real-time
- join/leave events trigger correctly
- Online count statistics accurate

### Example Message Content

```
User A: Hello, this is the first message
User B: Received! This is a reply
User A: Real-time communication test successful ✓
```

---

## Test 5: Typing Status

### Operations

1. Two users in same room
2. User A starts typing in input box (but doesn't send)
3. Observe User B's interface

### Expected Results

- User B sees "xxx is typing..." indicator
- User A stops typing for 3 seconds, indicator disappears

### Verification Points

- typing event triggers correctly
- Doesn't show own typing status
- Typing status clears automatically on timeout

---

## Test 6: History Message Loading

### Operations

1. Send multiple messages in room (e.g., 10+)
2. Refresh page
3. Re-login and enter room

### Expected Results

- History messages load and display correctly
- Message order correct (ascending by time)
- Message sender and content correct

### Verification Points

- Message persistence normal
- Pagination loading normal
- Username association correct

### Advanced: Load More

If messages exceed 50:

1. Scroll to top of message list
2. Should trigger "load more"
3. Older messages loaded

---

## Test 7: Token Refresh

### Operations

1. After login, wait 15 minutes (Access Token default expiration)
2. Or modify stored `chat_access` to invalid value in browser dev tools
3. Try creating new room or sending message

### Expected Results

- Frontend automatically uses Refresh Token to refresh
- User unaware, operation completes normally
- Token in localStorage updated

### Verification Points

- 401 response triggers auto-refresh
- Retries original request after refresh
- New Token pair stored correctly

### Quick Verification (Dev Tools)

```javascript
// Execute in browser console
localStorage.setItem('chat_access', 'invalid_token')
// Then try creating room, observe if auto-refresh occurs
```

---

## Test 8: Connection Disconnect and Reconnect

### Operations

1. Login and enter room
2. Stop backend service (Ctrl+C)
3. Observe frontend interface changes
4. Restart backend service
5. Observe if frontend auto-reconnects

### Expected Results

- Shows "disconnected" or "reconnecting" status on disconnect
- Auto-reconnects after restart
- Normal message sending/receiving after reconnect

### Verification Points

- WebSocket disconnect detection
- Exponential backoff reconnection strategy
- State recovery after reconnect

### Reconnection Strategy

```
Retry Count  Delay
   1          1.0s
   2          1.5s
   3          2.25s
   4          3.375s
   ...        ...
  10          ~15s (max)
```

---

## Test 9: Static Fallback Interface

### Operations

1. Stop frontend dev server
2. Ensure no `frontend/dist` directory exists
3. Only start backend: `go run ./cmd/server`
4. Visit http://localhost:8080

### Expected Results

- Page displays normally (using static files from `web/`)
- Functionality basically same as React frontend
- Can register, login, send messages

### Verification Points

- Static file fallback mechanism normal
- `web/` directory serves as backup UI

---

## Test 10: Rate Limiting

### Operations

```bash
# Rapidly send multiple requests
for i in {1..50}; do
  curl -s http://localhost:8080/api/v1/rooms \
    -H "Authorization: Bearer <your_token>" &
done
```

### Expected Results

- Some requests return `429 Too Many Requests`
- Response body contains `{"error": "too many requests"}`

### Verification Points

- Rate limiting active
- Limit dimension is IP + path
- Normal requests unaffected

---

## Test 11: Health Checks and Monitoring

### Operations

```bash
# Prometheus metrics
curl http://localhost:8080/metrics | grep chat

# View specific metrics
curl http://localhost:8080/metrics | grep chat_ws_connections
curl http://localhost:8080/metrics | grep http_requests_total
```

### Expected Results

- Returns Prometheus-formatted metrics data
- `chat_ws_connections` shows current connection count
- `http_requests_total` shows request count

---

## Test Checklist

Complete this checklist to confirm core functionality:

| # | Test Item | Pass |
|---|-----------|------|
| 1 | Service startup and health checks | ☐ |
| 2 | User registration | ☐ |
| 3 | User login | ☐ |
| 4 | Create room | ☐ |
| 5 | Enter room | ☐ |
| 6 | Send message | ☐ |
| 7 | Receive message (real-time) | ☐ |
| 8 | Online count display | ☐ |
| 9 | Typing indicator | ☐ |
| 10 | History message loading | ☐ |
| 11 | Token auto-refresh | ☐ |
| 12 | Disconnect reconnect | ☐ |
| 13 | Static fallback interface | ☐ |

---

## Further Reading

- [API Documentation](/en/api) — Interface details
- [Architecture Documentation](/en/architecture) — System structure
- [Learning Path](/en/learning-path) — Suggested study order
