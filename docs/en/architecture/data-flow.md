# Data Flow

This document analyzes the flow paths of key data in ChatRoom.

## Authentication Flow

```mermaid
sequenceDiagram
    participant User as User
    participant FE as Frontend (React)
    participant BE as Backend (Go)
    participant DB as PostgreSQL

    User->>FE: Enter username and password
    FE->>BE: POST /api/v1/auth/login
    BE->>DB: Query user
    DB-->>BE: Return user record
    BE->>BE: Verify password (bcrypt)
    BE->>BE: Generate JWT Access Token
    BE->>BE: Generate Refresh Token
    BE->>DB: Store Refresh Token
    DB-->>BE: Confirm
    BE-->>FE: { access_token, refresh_token }
    FE->>FE: Store to localStorage
    FE-->>User: Login successful
```

## Token Refresh Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant MW as AuthMiddleware
    participant BE as Auth Handler
    participant DB as PostgreSQL

    FE->>MW: Request (with expired Access Token)
    MW->>MW: Parse JWT → detect expiration
    MW-->>FE: 401 Unauthorized
    
    FE->>BE: POST /api/v1/auth/refresh<br/>{ refresh_token }
    BE->>DB: Query Refresh Token
    DB-->>BE: Return Token record
    BE->>BE: Validate validity & not expired & not revoked
    BE->>DB: Revoke old Refresh Token
    BE->>BE: Generate new Access Token
    BE->>BE: Generate new Refresh Token
    BE->>DB: Store new Refresh Token
    DB-->>BE: Confirm
    BE-->>FE: { access_token, refresh_token }
    FE->>FE: Update localStorage
```

## WebSocket Connection Flow

```mermaid
sequenceDiagram
    participant User as User
    participant FE as Frontend (React)
    participant BE as Backend (Go)
    participant DB as PostgreSQL
    participant Hub as WebSocket Hub

    User->>FE: Enter room
    FE->>BE: POST /api/v1/ws/tickets<br/>{ room_id }
    BE->>BE: Generate one-time Ticket
    BE->>DB: Store Ticket
    DB-->>BE: Confirm
    BE-->>FE: { ticket, expires_in }

    FE->>BE: WebSocket Connection<br/>Subprotocol: ["chatroom.v1", "ticket.<ticket>"]
    BE->>DB: Validate Ticket
    BE->>DB: Consume Ticket (one-time)
    BE->>DB: Create Session
    BE->>Hub: Register Client
    Hub->>Hub: Broadcast join event
    BE-->>FE: Connection established + join event
    FE-->>User: Display user joined
```

## Message Flow

```mermaid
sequenceDiagram
    participant UserA as User A
    participant ClientA as Client A
    participant Hub as RoomHub
    participant DB as PostgreSQL
    participant ClientB as Client B
    participant UserB as User B

    UserA->>ClientA: Send message
    ClientA->>Hub: { type: "message", content: "..." }
    Hub->>DB: Persist message
    DB-->>Hub: Message ID
    Hub->>ClientA: { type: "message", id, ... }
    Hub->>ClientB: { type: "message", id, ... }
    ClientB-->>UserB: Display new message
```

## Distributed Message Synchronization

```mermaid
sequenceDiagram
    participant ClientA as Client A<br/>(Instance A)
    participant InstanceA as Instance A
    participant PG as PostgreSQL
    participant InstanceB as Instance B
    participant ClientB as Client B<br/>(Instance B)

    ClientA->>InstanceA: Send message
    InstanceA->>PG: Persist message
    InstanceA->>PG: NOTIFY chatroom_ws_events
    InstanceA->>InstanceA: Broadcast to local Clients

    PG-->>InstanceA: LISTEN notification
    PG-->>InstanceB: LISTEN notification
    
    InstanceB->>InstanceB: Parse notification
    InstanceB->>ClientB: Broadcast message
```

## Typing Status Flow

```mermaid
sequenceDiagram
    participant UserA as User A
    participant ClientA as Client A
    participant Hub as RoomHub
    participant ClientB as Client B

    UserA->>ClientA: Start typing
    ClientA->>Hub: { type: "typing", is_typing: true }
    Hub->>ClientB: { type: "typing", username: "A", is_typing: true }
    
    Note over UserA: Stop typing (after 3 seconds)
    ClientA->>Hub: { type: "typing", is_typing: false }
    Hub->>ClientB: { type: "typing", username: "A", is_typing: false }
```

---

🌐 **Languages**: English | [简体中文](/en/architecture/data-flow)
