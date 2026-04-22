---
layout: home
hero:
  name: ChatRoom Docs
  text: ''
  tagline: Learn Full-Stack Development — Go + React + WebSocket
  image:
    src: /logo.svg
    alt: ChatRoom Logo
  actions:
    - theme: brand
      text: Get Started
      link: /en/getting-started
    - theme: alt
      text: Learning Path
      link: /en/learning-path
    - theme: alt
      text: GitHub
      link: https://github.com/LessUp/chatroom
---

## Core Features

| Feature | Description |
|---------|-------------|
| 🚀 **5-Minute Setup** | Docker Compose one-click, hot-reload dev |
| 🔐 **JWT Dual Token** | Access + Refresh Token implementation |
| ⚡ **WebSocket Real-time** | Room-based broadcast, presence, heartbeat |
| 📊 **Prometheus Metrics** | Built-in metrics with Grafana dashboards |
| 🧪 **Comprehensive Tests** | Go unit/integration, frontend Vitest |
| 📦 **Production Ready** | Docker multi-stage, K8s manifests |

## Quick Start

```bash
# Clone
git clone https://github.com/LessUp/chatroom.git
cd chatroom

# Start PostgreSQL
docker compose up -d postgres

# Start backend
go run ./cmd/server

# Start frontend (another terminal)
npm --prefix frontend install
npm --prefix frontend run dev
```

Visit http://localhost:5173!

## Documentation

- [Getting Started](./getting-started) — Project setup & environment
- [Learning Path](./learning-path) — Backend/frontend/full-stack paths
- [API Documentation](./api) — REST + WebSocket interfaces
- [Architecture](./architecture) — System layers & data flow
- [Design](./design) — Design decisions & extension paths
- [Monitoring](./monitoring/README) — Prometheus + Grafana setup
- [FAQ](./faq) — Common questions

---

🔗 [中文文档](/zh/) | [Back to Portal](/)
