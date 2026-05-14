# Architecture

This document describes ChatRoom's technical architecture in detail.

## Three-Layer Architecture

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        Browser[Browser<br/>React SPA]
    end

    subgraph App["Application Layer"]
        subgraph HTTP["HTTP Handler"]
            AuthH[Auth Handler]
            RoomH[Room Handler]
            UserH[User Handler]
        end

        subgraph WS["WebSocket Handler"]
            WSH[WebSocket Handler]
            Hub[Hub]
        end

        subgraph Service["Service Layer"]
            UserS[UserService]
            RoomS[RoomService]
            MsgS[MessageService]
        end

        subgraph Auth["Auth Module"]
            JWT[JWT Manager]
            Ticket[Ticket Manager]
        end
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL)]
    end

    Browser -->|HTTP REST| HTTP
    Browser -->|WebSocket| WS
    HTTP --> Service
    WS --> Hub --> Service
    Service --> PG
    Auth --> PG
```

## Core Components

### 1. HTTP Handler Layer

Responsibility: Request parsing, response formatting, basic validation

### 2. Service Layer

Responsibility: Business logic, transaction management, data access

### 3. WebSocket Hub

Responsibility: Connection management, message broadcasting

```mermaid
flowchart LR
    subgraph Hub
        R1[Room 1]
        R2[Room 2]
        R3[Room 3]
    end

    C1[Client A] --> R1
    C2[Client B] --> R1
    C3[Client C] --> R2
    C4[Client D] --> R3

    R1 -->|Broadcast| C1
    R1 -->|Broadcast| C2
```

## Data Model

```mermaid
erDiagram
    User ||--o{ Message : sends
    User ||--o{ Room : creates
    User ||--o{ RefreshToken : has
    Room ||--o{ Message : contains
    Room ||--o{ WSTicket : has

    User {
        uint id PK
        string username UK
        string password_hash
        timestamp created_at
    }

    Room {
        uint id PK
        string name UK
        uint created_by FK
        timestamp created_at
    }

    Message {
        uint id PK
        uint room_id FK
        uint user_id FK
        string content
        timestamp created_at
    }
```

## Authentication Flow

### REST API Authentication

```mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Handler

    Client->>Middleware: Authorization: Bearer token
    Middleware->>Middleware: Verify JWT
    alt Token valid
        Middleware->>Handler: Set user_id
        Handler-->>Client: Normal response
    else Token expired
        Middleware-->>Client: 401 Unauthorized
    end
```

### WebSocket Authentication

```mermaid
sequenceDiagram
    participant Client
    participant Handler
    participant DB

    Client->>Handler: ws://server/ws?room_id=1<br/>Sec-WebSocket-Protocol: ticket,xxx
    Handler->>DB: Query ticket
    alt Ticket valid
        Handler->>DB: Delete ticket
        Handler->>Client: Connection established
    else Ticket invalid/expired
        Handler->>Client: Connection rejected
    end
```

---

Next: [Key Decisions](/en/whitepaper/decisions)

---

🌐 **Languages**: English | [简体中文](/zh/whitepaper/architecture)
