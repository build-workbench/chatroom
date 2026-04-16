# Database Schema Specification

> **Status**: implemented
> **Created**: 2026-04-17

This directory contains database schema definitions and migration specifications.

---

## Database Technology

**PostgreSQL 16** with GORM ORM for Go.

---

## Schema Definition

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
```

### Rooms Table

```sql
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rooms_created_by ON rooms(created_by);
```

### Messages Table

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_user_id ON messages(user_id);

-- Full-text search index (future feature)
-- CREATE INDEX idx_messages_content_search ON messages USING GIN(to_tsvector('english', content));
```

---

## Data Models (Go/GORM)

### User Model

```go
type User struct {
    ID           uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
    Username     string    `gorm:"size:50;uniqueIndex;not null"`
    PasswordHash string    `gorm:"size:255;not null"`
    CreatedAt    time.Time
    UpdatedAt    time.Time
}
```

### Room Model

```go
type Room struct {
    ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
    Name        string    `gorm:"size:100;not null"`
    Description string    `gorm:"type:text"`
    CreatedBy   uuid.UUID `gorm:"type:uuid"`
    Visibility  string    `gorm:"size:20;default:public"`
    CreatedAt   time.Time
    UpdatedAt   time.Time
    
    Creator     User      `gorm:"foreignKey:CreatedBy"`
    Messages    []Message `gorm:"foreignKey:RoomID"`
}
```

### Message Model

```go
type Message struct {
    ID        uuid.UUID      `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
    RoomID    uuid.UUID      `gorm:"type:uuid;not null;index"`
    UserID    uuid.UUID      `gorm:"type:uuid;not null;index"`
    Content   string         `gorm:"type:text;not null"`
    Metadata  datatypes.JSON `gorm:"type:jsonb"`
    CreatedAt time.Time      `gorm:"index"`
    
    Room      Room           `gorm:"foreignKey:RoomID"`
    User      User           `gorm:"foreignKey:UserID"`
}
```

---

## Migrations

### Migration Strategy

GORM AutoMigrate for development, manual migration scripts for production.

```go
// internal/db/migrate.go
func Migrate(db *gorm.DB) error {
    return db.AutoMigrate(&User{}, &Room{}, &Message{})
}
```

### Migration History

| Version | Migration | Date |
|---------|-----------|------|
| v0.1.0 | Initial schema (users, rooms, messages) | 2025-01-08 |
| v0.2.0 | Add metadata JSONB column to messages | 2026-03-08 |

---

## Indexing Strategy

### Performance Indexes

| Table | Column(s) | Index Type | Purpose |
|-------|-----------|------------|---------|
| users | username | B-tree | Fast user lookup |
| rooms | created_by | B-tree | User's rooms query |
| messages | room_id | B-tree | Room messages query |
| messages | created_at | B-tree (DESC) | Recent messages query |
| messages | user_id | B-tree | User's messages query |

### Future Indexes

| Table | Column(s) | Index Type | Purpose |
|-------|-----------|------------|---------|
| messages | content | GIN (full-text) | Message search |

---

## Database Connection

### Connection String Format

```
postgres://user:password@host:port/database?sslmode=disable
```

### Connection Pool Configuration

```go
sqlDB, _ := db.DB()
sqlDB.SetMaxOpenConns(25)
sqlDB.SetMaxIdleConns(10)
sqlDB.SetConnMaxLifetime(5 * time.Minute)
```

---

## Related Documents

- [Open Source Standards](../product/open-source-standards.md) - R6 (Containerization)
- [Core Architecture](../rfc/core-architecture.md) - Data flow

---

## Change History

| Date | Change |
|------|--------|
| 2026-04-17 | Initial database schema specification created |
