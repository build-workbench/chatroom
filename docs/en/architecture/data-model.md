# Data Model

This document describes the database design of ChatRoom.

## ER Diagram

```mermaid
erDiagram
    users ||--o{ messages : "sends"
    users ||--o{ rooms : "creates"
    users ||--o{ refresh_tokens : "owns"
    users ||--o{ ws_tickets : "obtains"
    users ||--o{ ws_sessions : "establishes"
    
    rooms ||--o{ messages : "contains"
    rooms ||--o{ ws_tickets : "associated"
    rooms ||--o{ ws_sessions : "associated"

    users {
        uint id PK
        string username UK
        string password_hash
        timestamp created_at
        timestamp updated_at
    }

    rooms {
        uint id PK
        string name UK
        uint owner_id FK
        timestamp created_at
        timestamp updated_at
    }

    messages {
        uint id PK
        uint room_id FK
        uint user_id FK
        text content
        timestamp created_at
    }

    refresh_tokens {
        uint id PK
        uint user_id FK
        string token UK
        timestamp expires_at
        timestamp revoked_at
        timestamp created_at
    }

    ws_tickets {
        string ticket_id PK
        uint user_id FK
        uint room_id FK
        timestamp expires_at
        timestamp consumed_at
        timestamp created_at
        timestamp updated_at
    }

    ws_sessions {
        string session_id PK
        uint room_id FK
        uint user_id FK
        string pod_id
        timestamp last_seen_at
        timestamp created_at
        timestamp updated_at
    }
```

## Table Descriptions

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| `users` | User accounts | username (unique) |
| `rooms` | Chat rooms | name (unique), owner_id |
| `messages` | Chat messages | room_id, user_id, created_at |
| `refresh_tokens` | Refresh tokens | user_id, token (unique), expires_at |
| `ws_tickets` | WebSocket authentication tickets | user_id, room_id, expires_at |
| `ws_sessions` | WebSocket sessions (distributed online count) | room_id, user_id, pod_id |

## Detailed Field Descriptions

### users Table

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-increment primary key |
| username | VARCHAR(64) | UNIQUE, NOT NULL | Username, unique |
| password_hash | VARCHAR(256) | NOT NULL | bcrypt hashed password |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Update time |

### rooms Table

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-increment primary key |
| name | VARCHAR(128) | UNIQUE, NOT NULL | Room name, unique |
| owner_id | INTEGER | FOREIGN KEY | Creator ID |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Update time |

### messages Table

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-increment primary key |
| room_id | INTEGER | FOREIGN KEY, NOT NULL | Room ID |
| user_id | INTEGER | FOREIGN KEY, NOT NULL | Sender ID |
| content | TEXT | NOT NULL | Message content, max 2000 characters |
| created_at | TIMESTAMP | NOT NULL | Creation time |

### refresh_tokens Table

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-increment primary key |
| user_id | INTEGER | FOREIGN KEY, NOT NULL | User ID |
| token | VARCHAR(64) | UNIQUE, NOT NULL | Randomly generated token |
| expires_at | TIMESTAMP | NOT NULL | Expiration time |
| revoked_at | TIMESTAMP | | Revocation time (set during Token Rotation) |
| created_at | TIMESTAMP | NOT NULL | Creation time |

### ws_tickets Table

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| ticket_id | VARCHAR(64) | PRIMARY KEY | Randomly generated ticket ID |
| user_id | INTEGER | FOREIGN KEY, NOT NULL | User ID |
| room_id | INTEGER | FOREIGN KEY, NOT NULL | Target room ID |
| expires_at | TIMESTAMP | NOT NULL | Expiration time (default 60 seconds) |
| consumed_at | TIMESTAMP | | Consumption time (set after use) |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Update time |

### ws_sessions Table

| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| session_id | VARCHAR(64) | PRIMARY KEY | Session ID |
| room_id | INTEGER | FOREIGN KEY, NOT NULL | Room ID |
| user_id | INTEGER | FOREIGN KEY, NOT NULL | User ID |
| pod_id | VARCHAR(64) | NOT NULL | Instance identifier (distributed scenario) |
| last_seen_at | TIMESTAMP | NOT NULL | Last heartbeat time |
| created_at | TIMESTAMP | NOT NULL | Creation time |
| updated_at | TIMESTAMP | NOT NULL | Update time |

---

🌐 **Languages**: English | [简体中文](/zh/architecture/data-model)
