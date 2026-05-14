# Executive Summary

ChatRoom is a teaching-oriented real-time chat application designed to demonstrate core design patterns of modern full-stack systems.

## Background

During learning and teaching, we found a gap: no example project that is both quick to run and has production-grade engineering practices. Most tutorial projects are either too simple or use outdated architectures.

ChatRoom was born with these design principles:

- **Quick to run**: Start the full system in minutes
- **Docs match code**: What you see is what you get
- **Testable**: Complete test coverage
- **Clear structure**: Easy to explain and learn

## Core Value

### 1. Real Full-Stack Architecture

```
React SPA ←→ Gin HTTP Server ←→ PostgreSQL
     ↓              ↓
  WebSocket    REST API
```

Not "Hello World", but complete user authentication, real-time communication, and data persistence.

### 2. Production-Grade Practices

| Practice | Implementation |
|----------|----------------|
| Auth | JWT Dual Token + Auto Rotation |
| Real-time | WebSocket + Room Broadcast |
| Distributed | PostgreSQL LISTEN/NOTIFY |
| Observability | Prometheus Metrics |
| CI/CD | GitHub Actions |
| Deployment | Docker + Kubernetes |

### 3. Teaching-First Design

- Every design decision documented in ADRs
- Comprehensive code comments
- Progressive learning paths

## Target Audience

- **Backend Developers**: Learn Go, WebSocket, JWT auth
- **Frontend Developers**: Learn React Hooks, real-time UI
- **Full-Stack Developers**: Understand frontend-backend collaboration
- **Educators**: Use as teaching examples

## Quick Start

```bash
# Start database
docker compose up -d postgres

# Start backend
go run ./cmd/server

# Start frontend (another terminal)
npm --prefix frontend run dev
```

Visit http://localhost:5173 to experience.

## Documentation Navigation

| Module | Content |
|--------|---------|
| [Problem Statement](/en/whitepaper/problem) | Core challenges of real-time systems |
| [Solution Overview](/en/whitepaper/solution) | Architecture philosophy and choices |
| [Architecture](/en/whitepaper/architecture) | Three-layer architecture details |
| [Key Decisions](/en/whitepaper/decisions) | ADR index |

---

🌐 **Languages**: English | [简体中文](/zh/whitepaper/)
