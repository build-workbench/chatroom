# Authentication Deep Dive

This document provides an in-depth analysis of ChatRoom's authentication implementation details.

## JWT Structure

### Access Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "1",
    "username": "alice",
    "exp": 1704705600,
    "iat": 1704704700
  },
  "signature": "..."
}
```

| Field | Description |
|-------|-------------|
| `sub` | User ID |
| `username` | Username (avoid database lookup each time) |
| `exp` | Expiration time (15 minutes) |
| `iat` | Issued at time |

### Refresh Token

Randomly generated 64-byte hexadecimal string, stored in database:

```sql
SELECT * FROM refresh_tokens WHERE token = '...';
```

## Authentication Flow

### Complete Authentication Flow

```mermaid
flowchart TB
    subgraph Login["Login"]
        L1["User Input"] --> L2["POST /auth/login"]
        L2 --> L3["Query User"]
        L3 --> L4["bcrypt Verify Password"]
        L4 --> L5["Generate Access Token"]
        L5 --> L6["Generate Refresh Token"]
        L6 --> L7["Store Refresh Token"]
        L7 --> L8["Return Token Pair"]
    end
    
    subgraph API["API Request"]
        A1["Carry Access Token"] --> A2["AuthMiddleware"]
        A2 --> A3["Parse JWT"]
        A3 --> A4{"Verify Signature & Expiry"}
        A4 -->|Valid| A5["Inject User Info"]
        A4 -->|Expired| A6["Return 401"]
        A5 --> A7["Continue Processing Request"]
    end
    
    subgraph Refresh["Token Refresh"]
        R1["Carry Refresh Token"] --> R2["Query Database"]
        R2 --> R3{"Validate"}
        R3 -->|Valid| R4["Revoke Old Token"]
        R4 --> R5["Generate New Token Pair"]
        R5 --> R6["Store New Refresh Token"]
        R3 -->|Invalid| R7["Return 401"]
    end
```

### Token Rotation Details

```mermaid
sequenceDiagram
    participant Client as Client
    participant Server as Server
    participant DB as Database

    Note over Client,DB: Initial Login
    Client->>Server: Login Request
    Server->>DB: Store RT1
    Server-->>Client: AT1 + RT1

    Note over Client,DB: First Refresh
    Client->>Server: Refresh Request (RT1)
    Server->>DB: Validate RT1 ✓
    Server->>DB: Revoke RT1 (set revoked_at)
    Server->>DB: Store RT2
    Server-->>Client: AT2 + RT2

    Note over Client,DB: RT1 Replay Attack (Failed)
    Client->>Server: Refresh Request (RT1)
    Server->>DB: Validate RT1 ✗ (revoked)
    Server-->>Client: 401 Unauthorized
```

## WebSocket Ticket Flow

### Why Need Ticket?

WebSocket handshake cannot carry Authorization Header, requires alternative authentication method.

### Ticket Lifecycle

```mermaid
sequenceDiagram
    participant Client as Client
    participant REST as REST API
    participant WS as WebSocket Handler
    participant DB as Database

    Client->>REST: POST /ws/tickets<br/>Authorization: Bearer AT<br/>{ room_id: 1 }
    REST->>REST: Validate Access Token
    REST->>REST: Generate Random Ticket
    REST->>DB: Store Ticket<br/>(user_id, room_id, expires_at)
    REST-->>Client: { ticket: "...", expires_in: 60 }

    Note over Client: Establish connection within 60 seconds

    Client->>WS: WebSocket Connection<br/>Subprotocol: ticket.xxx
    WS->>DB: Query Ticket
    WS->>DB: Validate: not expired & not consumed
    WS->>DB: Consume Ticket (set consumed_at)
    WS->>DB: Create Session
    WS-->>Client: Connection Established

    Note over Client,WS: Start sending/receiving messages
```

### Ticket Security Features

| Feature | Implementation | Protection Target |
|---------|----------------|-------------------|
| One-time use | `consumed_at` field | Replay attack |
| Short validity | 60 seconds | Token leak |
| Room binding | `room_id` field | Cross-room abuse |
| User binding | `user_id` field | Identity spoofing |
| Not exposed in URL | Subprotocol transmission | Log leak |

## Password Security

### bcrypt Hashing

```go
// Hash password
hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

// Verify password
err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
```

| Parameter | Value | Description |
|-----------|-------|-------------|
| Cost | 10 (default) | 2^10 = 1024 iterations |
| Output Length | 60 characters | Fixed length hash |
| Includes Salt | Yes | Prevents rainbow table attacks |

### Why Not Other Algorithms?

| Algorithm | Description |
|-----------|-------------|
| MD5/SHA1 | Already broken, not secure |
| SHA256/SHA512 | Requires separate salt, error-prone |
| Argon2 | More secure, but bcrypt is sufficient |
| PBKDF2 | Similar to bcrypt, but more complex implementation |

---

🌐 **Languages**: English | [简体中文](/zh/deep-dives/security/auth-deep-dive)
