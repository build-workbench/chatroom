# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Teaching-oriented real-time chat room: Go backend (Gin + GORM + Gorilla WebSocket) + React frontend (Vite + Tailwind CSS v4) + PostgreSQL. Primarily for learning and teaching demos — avoid over-engineering.

**This project follows Spec-Driven Development (SDD).** All implementations must reference `/specs` as the Single Source of Truth. See [AGENTS.md](AGENTS.md) for the complete SDD workflow.

## Spec Directory Reference

- `/specs/product/` — Product requirements and acceptance criteria
- `/specs/rfc/` — Technical design documents and architecture RFCs
- `/specs/api/` — API specifications (REST endpoints, WebSocket protocols)
- `/specs/db/` — Database schema definitions and migration specs
- `/specs/testing/` — Test specifications and BDD feature files
- `/specs/README.md` — Complete spec index and workflow guide

**Before writing code, always check `/specs/` for relevant specifications.** If specs don't exist, propose creating them first.

## Build & Test Commands

- `docker compose up -d postgres` — start PostgreSQL (required for Go tests)
- `go run ./cmd/server` — run backend
- `go test -race ./...` — Go tests (needs running Postgres)
- `npm --prefix frontend run test` — frontend Vitest
- `npm --prefix frontend run build` — type-check + Vite build
- `make lint` / `npm --prefix frontend run lint` — linting
- `make all` — lint + test + build (Go only)

## Gotchas

- **No .env auto-loading**: the Go app reads env vars directly from the process. Set them manually or source from shell. See `.env.example` for reference.
- **Go tests need PostgreSQL**: run `docker compose up -d postgres` before `go test ./...`.
- **Full-stack dev needs both servers**: Vite dev (port 5173) proxies `/api` and `/ws` to Go backend (port 8080). Both must be running.
- **Tailwind CSS v4**: uses `@tailwindcss/vite` plugin, not PostCSS. Don't add `tailwind.config.js` or PostCSS Tailwind plugins.
- **Frontend serving priority**: Go serves `frontend/dist` if present, falls back to `web/` static files otherwise.
- **Build injects version info**: `main.Version`, `main.GitCommit`, `main.BuildTime` are set via `-ldflags` at build time.

## Code Style

- **Go**: tabs, `gofmt`, `goimports -w -local chatroom .`, table-driven tests, same-package tests (e.g., `package ws`), `CamelCase` exports, `camelCase` internals, `snake_case` JSON tags.
- **Frontend**: 2-space indent, Prettier (semi, single quotes, trailing comma es5, 100 print width), kebab-case filenames, function components with hooks.
- **Commit messages**: imperative mood, ~50 char title. Reference issues with `Refs #123`.

## Architecture

- `cmd/server/main.go` — entrypoint
- `internal/` — Go business logic: `auth`, `config`, `db`, `log`, `metrics`, `models`, `mw`, `quality`, `server`, `service`, `ws`
- `frontend/src/` — React app
- `web/` — static fallback UI (used when `frontend/dist` is absent)
- `docs/` — VitePress teaching docs (user-facing)
- `specs/` — Project specifications (SDD source of truth)
- `deploy/` — Docker, Kubernetes, Prometheus manifests
