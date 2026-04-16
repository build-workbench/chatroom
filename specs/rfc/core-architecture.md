# RFC: Core Architecture

> **Status**: implemented
> **Author**: ChatRoom team
> **Created**: 2026-03-08
> **Updated**: 2026-04-17
> **Related**: [Open Source Standards](../product/open-source-standards.md)

This RFC defines the core architecture and project structure for the ChatRoom application.

---

## Overview

ChatRoom is a teaching-oriented real-time chat application built with Go, React, and PostgreSQL. The architecture prioritizes simplicity, understandability, and extensibility.

---

## Project Directory Structure

```
chatroom/
├── cmd/server/                  # Application entrypoint
│   └── main.go
├── internal/                    # Private application code
│   ├── auth/                    # Authentication and token management
│   ├── config/                  # Configuration management
│   ├── db/                      # Database connection and migrations
│   ├── log/                     # Logging utilities
│   ├── metrics/                 # Prometheus metrics
│   ├── models/                  # Shared data structures
│   ├── mw/                      # HTTP middleware
│   ├── server/                  # HTTP server setup
│   ├── service/                 # Business logic services
│   └── ws/                      # WebSocket hub and connections
├── frontend/                    # React application
│   ├── src/                     # React components and utilities
│   └── public/                  # Static assets
├── web/                         # Static fallback UI
├── specs/                       # Project specifications
│   ├── product/                 # Product requirements
│   ├── rfc/                     # Technical design documents
│   ├── api/                     # API specifications
│   ├── db/                      # Database schemas
│   └── testing/                 # Test specifications
├── docs/                        # User documentation (VitePress)
├── deploy/                      # Deployment configurations
│   ├── docker/                  # Dockerfile
│   └── k8s/                     # Kubernetes manifests
├── .github/                     # GitHub workflows and templates
└── [standard files]             # LICENSE, README.md, etc.
```

---

## Architecture Components

### Backend (Go)

| Component | Responsibility | Location |
|-----------|----------------|----------|
| HTTP Server | REST API endpoints, static file serving | `internal/server/` |
| WebSocket Hub | Real-time message broadcasting, connection management | `internal/ws/` |
| Auth Service | JWT token generation and validation | `internal/auth/` |
| Database Layer | PostgreSQL connection, GORM ORM, migrations | `internal/db/` |
| Metrics | Prometheus metrics collection | `internal/metrics/` |
| Middleware | CORS, rate limiting, authentication | `internal/mw/` |

### Frontend (React)

| Component | Responsibility | Location |
|-----------|----------------|----------|
| App Router | Page routing, protected routes | `frontend/src/App.tsx` |
| Chat Interface | Message display, input, WebSocket connection | `frontend/src/pages/` |
| Auth Flow | Login, registration, token storage | `frontend/src/components/` |
| API Client | HTTP requests, error handling | `frontend/src/services/` |
| State Management | React hooks, context | `frontend/src/hooks/` |

### Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL 16 | Persistent storage, pub/sub messaging |
| Reverse Proxy | Gin router | HTTP request routing |
| Real-time Transport | gorilla/websocket | WebSocket connections |
| ORM | GORM | Database abstraction |
| Monitoring | Prometheus + Grafana | Metrics collection and visualization |

---

## Data Flow

### HTTP Request Flow

```
Client → Gin Router → Middleware Stack → Handler → Service Layer → Database
                                           ↓
                                      Response ← JSON Serialization
```

### WebSocket Message Flow

```
Client A → WebSocket → Hub → Broadcast → All Connected Clients (same room)
                            ↓
                       Database (persist message)
```

### Authentication Flow

```
Client → POST /api/auth/login → Auth Service → Validate Credentials
                                   ↓
                         Generate JWT Tokens ← Return Access + Refresh Tokens
```

---

## Extension Directions

### Feature Extensions

| Feature | Implementation Approach |
|---------|------------------------|
| Rich text messages | `messages.metadata JSONB` field |
| Private rooms | `rooms.visibility` field + permission checks |
| File uploads | S3/OSS + pre-signed URLs |
| Message search | PostgreSQL full-text search |

### Architecture Extensions

| Scenario | Solution |
|----------|----------|
| High concurrency | Connection pool tuning, message queue buffering |
| Multi-instance deployment | Redis Pub/Sub instead of Postgres NOTIFY |
| Global deployment | Multi-region databases, edge nodes |

---

## Design Principles

1. **Simplicity First**: Avoid over-engineering for a teaching project
2. **Document-Code Sync**: Documentation must match code behavior
3. **Runnable Examples**: All examples must be copy-paste runnable
4. **Clear Boundaries**: Components should have single, well-defined responsibilities
5. **Testability**: Design should enable comprehensive testing

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial architecture documented |
| 2026-04-17 | Refined structure |
