# ChatRoom

[![CI](https://github.com/LessUp/chatroom/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/chatroom/actions/workflows/ci.yml)
[![Docs](https://github.com/LessUp/chatroom/actions/workflows/pages.yml/badge.svg)](https://lessup.github.io/chatroom/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/LessUp/chatroom)](https://github.com/LessUp/chatroom/releases)

English | [简体中文](README.zh-CN.md)

A teaching-oriented real-time chat application that demonstrates how to build and reason about a modern full-stack system with **Go**, **React**, **PostgreSQL**, **WebSocket**, **tests**, **observability**, and **OpenSpec-driven change management**.

## Why this repo exists

This project is designed to be:
- **Runnable**: you can start the stack locally in minutes
- **Understandable**: the backend, frontend, docs, and specs are kept explicit
- **Teachable**: the repository is organized so learners can follow how a real-time product fits together

If you want a compact codebase that still covers authentication, rooms, messages, WebSocket delivery, monitoring, and deployment basics, this repo is for you.

## What you can learn

- JWT login, refresh tokens, and request authentication
- Room-based WebSocket messaging and message persistence
- Go service layering and database-backed handlers
- React + TypeScript client structure for chat flows
- Prometheus metrics, health checks, and release workflows
- How OpenSpec can keep product and engineering changes aligned

## Quick start

### Prerequisites

- Go 1.24
- Node.js 22
- Docker

### Run locally

```bash
git clone https://github.com/LessUp/chatroom.git
cd chatroom

docker compose up -d postgres

# backend
go run ./cmd/server

# frontend (another terminal)
npm --prefix frontend ci
npm --prefix frontend run dev
```

### URLs

| Surface | URL |
|---------|-----|
| Frontend dev server | http://localhost:5173 |
| Backend | http://localhost:8080 |
| Docs site | https://lessup.github.io/chatroom/ |

## Where to go next

- **Docs site**: [English](https://lessup.github.io/chatroom/en/) · [中文](https://lessup.github.io/chatroom/zh/)
- **Getting started**: [EN](https://lessup.github.io/chatroom/en/getting-started) · [ZH](https://lessup.github.io/chatroom/zh/getting-started)
- **Architecture walkthrough**: [EN](https://lessup.github.io/chatroom/en/architecture) · [ZH](https://lessup.github.io/chatroom/zh/architecture)
- **API reference**: [EN](https://lessup.github.io/chatroom/en/api) · [ZH](https://lessup.github.io/chatroom/zh/api)
- **OpenSpec source of truth**: [`openspec/specs/`](openspec/specs)

## Tech snapshot

| Layer | Technology |
|-------|------------|
| Backend | Go 1.24, Gin, GORM, Gorilla WebSocket, zerolog |
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS v4 |
| Database | PostgreSQL 16 |
| Observability | Prometheus, Grafana |
| Delivery | Docker, GitHub Actions, GitHub Pages |

## Project structure

```text
chatroom/
├── cmd/server/        # application entrypoint
├── internal/          # backend application code
├── frontend/          # React client
├── web/               # static fallback UI
├── docs/              # documentation site
├── openspec/          # specs and active changes
└── deploy/            # Docker and Kubernetes assets
```

## OpenSpec workflow

Non-trivial repository changes are managed through OpenSpec:

```bash
/opsx:explore
/opsx:propose <change-name>
/opsx:apply <change-name>
/opsx:archive <change-name>
```

The canonical requirements live in [`openspec/specs/`](openspec/specs), and active work lives in [`openspec/changes/`](openspec/changes).

## Validation commands

```bash
docker compose up -d postgres
make lint
go test -race ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
```

## Contributing and security

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Release history: [CHANGELOG.md](CHANGELOG.md)

## License

[MIT License](LICENSE)
