---
layout: home
hero:
  name: ChatRoom Docs
  text: Understanding Real-time Chat Systems from Scratch
  tagline: A full-stack learning project with Go + React + PostgreSQL + WebSocket
  image:
    src: /logo.svg
    alt: ChatRoom Logo
  actions:
    - theme: brand
      text: Get Started
      link: /en/getting-started
    - theme: alt
      text: API Docs
      link: /en/api
    - theme: alt
      text: Architecture
      link: /en/architecture
features:
  - icon: 🚀
    title: 5-Minute Setup
    details: Start the database and backend with Docker Compose, hot-reload frontend dev server, experience full chat functionality quickly.
    link: /en/getting-started
    linkText: Start Now
  - icon: 🔐
    title: Dual Token Auth
    details: Complete JWT + Refresh Token implementation with automatic refresh, token rotation, and secure logout.
    link: /en/api#authentication
    linkText: View Auth Flow
  - icon: ⚡
    title: WebSocket Real-time
    details: Room-based Hub broadcasting, online status sync, typing indicators, heartbeat keepalive, distributed deployment ready.
    link: /en/architecture#websocket-layer
    linkText: Learn Architecture
  - icon: 📊
    title: Prometheus Metrics
    details: Built-in HTTP request, WebSocket connection, and message count metrics with Grafana dashboard templates.
    link: /en/monitoring/
    linkText: Setup Monitoring
  - icon: 🧪
    title: Comprehensive Tests
    details: Go unit tests + integration tests, frontend Vitest tests, CI automation with coverage reports.
    link: https://github.com/LessUp/chatroom/actions
    linkText: View CI
  - icon: 📦
    title: Production Ready
    details: Docker multi-stage builds, Kubernetes manifests, health checks, graceful shutdown, rate limiting.
    link: /en/design#deployment-considerations
    linkText: Deployment Guide
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/LessUp.png',
    name: 'LessUp',
    title: 'Project Maintainer',
    links: [
      { icon: 'github', link: 'https://github.com/LessUp' },
    ],
  },
]
</script>

## Tech Stack

| Backend | Frontend | Database | Monitoring | Deployment |
|---------|----------|----------|------------|------------|
| Go 1.24 | React 19 | PostgreSQL 16 | Prometheus | Docker |
| Gin | TypeScript | GORM | Grafana | Kubernetes |
| gorilla/websocket | Vite 7 | zerolog | | GitHub Actions |
| zerolog | Tailwind CSS v4 | | | |

## Who Is This For

- 🎯 Developers looking to **practice Go backend development**
- 🎯 Developers wanting to understand **frontend integration with REST + WebSocket**
- 🎯 Educators and learners using this as **teaching material or self-study resource**

## What You'll Learn

### Backend

- Gin routing and middleware organization
- JWT / Refresh Token authentication flow
- GORM integration with PostgreSQL
- WebSocket room broadcasting implementation
- Distributed message synchronization (PostgreSQL NOTIFY)

### Frontend

- React Hooks state management
- WebSocket connection and reconnection strategies
- Token auto-refresh mechanism
- TypeScript type design

### Engineering

- Test writing and CI configuration
- Docker multi-stage builds
- Kubernetes deployment manifests
- Prometheus monitoring integration

## Recommended Reading Order

1. [Getting Started](/en/getting-started) — 5-minute project setup
2. [Manual Testing](/en/manual-testing) — Verify core functionality
3. [API Documentation](/en/api) — REST + WebSocket interfaces
4. [Architecture](/en/architecture) — System layers and data flow
5. [Design](/en/design) — Design decisions and extension paths
6. [FAQ](/en/faq) — Common questions answered

## Project Highlights

### Teaching-First

Clear, easy-to-understand code without over-abstraction. Every module has detailed comments and documentation.

### Engineering Complete

Not just a simple demo, but a complete engineering practice with tests, CI, deployment, and monitoring.

### Progressive Learning

From "it runs" to "I understand" to "I can modify it" — documentation provides a clear learning path.

## Quick Start

```bash
# Clone the project
git clone https://github.com/LessUp/chatroom.git
cd chatroom

# Start the database
docker compose up -d postgres

# Start the backend
go run ./cmd/server

# Start the frontend (in another terminal)
npm --prefix frontend ci
npm --prefix frontend run dev
```

Then visit http://localhost:5173 to start chatting!

## Project Maintainer

<VPTeamMembers size="small" :members="members" />

## License

This project is open-sourced under the [MIT License](https://github.com/LessUp/chatroom/blob/master/LICENSE).

---

🌐 **Languages**: [English](/en/) | [中文](/zh/)
