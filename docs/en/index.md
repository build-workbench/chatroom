---
layout: home
hero:
  name: ChatRoom
  text: Technical Whitepaper
  tagline: A teaching-oriented real-time full-stack system architecture reference
  image:
    src: /logo.svg
    alt: ChatRoom Logo
  actions:
    - theme: brand
      text: Architecture Overview
      link: /en/architecture/system
    - theme: alt
      text: Getting Started
      link: /en/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/LessUp/chatroom

features:
  - icon: 🔐
    title: JWT + Token Rotation
    details: Short-lived Access Token (15 min) + long-lived Refresh Token (7 days), automatic rotation on refresh to minimize token leak risks.
  - icon: 🎫
    title: WebSocket Ticket Auth
    details: One-time ticket authentication via WebSocket Subprotocol, 60-second validity, consumed immediately, prevents replay attacks.
  - icon: 🌐
    title: Distributed Sync
    details: Cross-instance message broadcast via PostgreSQL LISTEN/NOTIFY, no Redis or message queue required, keeping architecture simple.
  - icon: 📊
    title: Prometheus Observability
    details: Built-in metrics for connections, message throughput, request latency distribution. Grafana-ready, Kubernetes health checks.
  - icon: 🔄
    title: OpenSpec Workflow
    details: Structured change management with traceable design decisions. Specs define capability boundaries, changes track evolution history.
  - icon: 🧪
    title: Complete Test Coverage
    details: Unit tests, integration tests, E2E tests in three layers. Go race detector, frontend Vitest, ensuring code quality.
---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Go 1.24, Gin, GORM, Gorilla WebSocket, zerolog |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| Observability | Prometheus, Grafana |
| Delivery | Docker, Kubernetes, GitHub Actions |

## Architecture Preview

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        B1[Browser<br/>React SPA]
        B2[Browser<br/>React SPA]
        B3[Browser<br/>React SPA]
    end

    subgraph App["Application Layer"]
        subgraph Gin["Gin HTTP Server"]
            REST[REST API<br/>Handlers]
            WS[WebSocket<br/>Handler]
            Static[Static Files]
        end
        
        subgraph Services["Service Layer"]
            UserService[UserService]
            RoomService[RoomService]
            MsgService[MessageService]
        end
        
        subgraph WSHub["WebSocket Hub"]
            RoomHub1[RoomHub<br/>Room 1]
            RoomHub2[RoomHub<br/>Room 2]
        end
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL 16<br/>users, rooms, messages<br/>refresh_tokens, ws_tickets)]
    end

    B1 & B2 & B3 -->|HTTP REST| REST
    B1 & B2 & B3 -->|WebSocket| WS
    
    REST --> UserService & RoomService & MsgService
    WS --> WSHub
    
    UserService & RoomService & MsgService --> PG
    WSHub --> PG
    WSHub -.->|NOTIFY| WSHub
```

## Documentation Navigation

### Getting Started

- [Getting Started](/en/getting-started) - Run the full stack in minutes
- [Learning Path](/en/learning-path) - Step-by-step learning guide

### Architecture

- [System Architecture](/en/architecture/system) - Complete architecture breakdown
- [Data Flow](/en/architecture/data-flow) - Request and message flow
- [Data Model](/en/architecture/data-model) - Database design

### Design Decisions (ADR)

- [ADR-001: WebSocket Auth](/en/decisions/001-ws-auth) - Why the Ticket approach
- [ADR-002: Token Rotation](/en/decisions/002-token-rotation) - Dual-token design
- [ADR-003: Distributed Sync](/en/decisions/003-distributed-sync) - Postgres NOTIFY approach

### Deep Dives

- [Performance Benchmarks](/en/deep-dives/performance/benchmarks) - Throughput and latency data
- [Threat Model](/en/deep-dives/security/threat-model) - Security analysis and mitigations
- [Horizontal Scaling](/en/deep-dives/scalability/horizontal) - Multi-instance deployment design

### API Reference

- [REST API](/en/api/rest) - Complete API documentation
- [WebSocket Protocol](/en/api/websocket) - Real-time communication protocol
