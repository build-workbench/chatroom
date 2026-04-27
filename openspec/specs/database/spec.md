# Database Specification

> **Status**: implemented
> **Created**: 2026-04-17
> **Updated**: 2026-04-23

## Purpose

Define the database schema and data models for the ChatRoom application.

## Requirements

### Requirement: Database Technology
The system SHALL use PostgreSQL 16 with GORM ORM.

#### Scenario: Database Connection
- **WHEN** the application starts
- **THEN** it connects to PostgreSQL using the DATABASE_DSN environment variable

#### Scenario: Connection Pool
- **WHEN** database connections are established
- **THEN** max 25 open connections and 10 idle connections are configured

---

### Requirement: Users Table
The system SHALL maintain a users table for user accounts.

#### Scenario: User Record Creation
- **WHEN** a new user registers
- **THEN** a record is created with id (UUID), username (unique), password_hash, created_at, and updated_at

#### Scenario: Username Uniqueness
- **WHEN** a duplicate username is inserted
- **THEN** the insert fails with unique constraint violation

#### Scenario: Username Index
- **WHEN** a user lookup by username is performed
- **THEN** the query uses the idx_users_username index

---

### Requirement: Rooms Table
The system SHALL maintain a rooms table for chat rooms.

#### Scenario: Room Record Creation
- **WHEN** a new room is created
- **THEN** a record is created with id (UUID), name, description, created_by, visibility, created_at, and updated_at

#### Scenario: Room Creator Reference
- **WHEN** a room is created
- **THEN** created_by references the users table

#### Scenario: Room Visibility
- **WHEN** a room is created without visibility specified
- **THEN** visibility defaults to 'public'

---

### Requirement: Messages Table
The system SHALL maintain a messages table for chat messages.

#### Scenario: Message Record Creation
- **WHEN** a message is sent
- **THEN** a record is created with id (UUID), room_id, user_id, content, metadata (JSONB), and created_at

#### Scenario: Message Room Reference
- **WHEN** a room is deleted
- **THEN** all messages in that room are cascade deleted

#### Scenario: Message Ordering
- **WHEN** messages are queried for a room
- **THEN** results are ordered by created_at descending using idx_messages_created_at index

---

### Requirement: GORM Models
The system SHALL define Go structs for database models.

#### Scenario: User Model
- **WHEN** the User struct is used
- **THEN** it maps to users table with UUID primary key and unique username

#### Scenario: Room Model
- **WHEN** the Room struct is used
- **THEN** it includes Creator (User) and Messages ([]Message) relationships

#### Scenario: Message Model
- **WHEN** the Message struct is used
- **THEN** it includes Room and User relationships and JSONB metadata field

---

### Requirement: Database Migrations
The system SHALL support database schema migrations.

#### Scenario: Auto Migration
- **WHEN** the application starts in development
- **THEN** GORM AutoMigrate creates/updates tables for User, Room, and Message models

#### Scenario: Migration History
- **WHEN** schema changes are needed
- **THEN** migration date and description are recorded in spec

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
```

---

## Index Strategy

| Table | Column(s) | Index Type | Purpose |
|-------|-----------|------------|---------|
| users | username | B-tree | Fast user lookup |
| rooms | created_by | B-tree | User's rooms query |
| messages | room_id | B-tree | Room messages query |
| messages | created_at | B-tree (DESC) | Recent messages query |
| messages | user_id | B-tree | User's messages query |

---

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| v0.1.0 | 2025-01-08 | Initial schema (users, rooms, messages) |
| v0.2.0 | 2026-03-08 | Add metadata JSONB column to messages |

---

## Change History

| Date | Change |
|------|--------|
| 2026-04-17 | Initial database specification created |
| 2026-04-23 | Migrated to OpenSpec format |
