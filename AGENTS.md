# Repository Collaboration Guide

## Project Snapshot

ChatRoom is a teaching-oriented real-time chat application:
- **Backend**: Go 1.24, Gin, GORM, Gorilla WebSocket, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4
- **Docs**: VitePress

This is a **single-instance** teaching project: no multi-replica deployment, distributed session sync, or monitoring stack. Favor clarity, consistency, and maintainability over feature expansion or engineering theater.

`AGENTS.md` is the single canonical instruction file for coding agents; do not maintain redundant tool-specific copies.

## Canonical Surfaces

| Surface | Purpose |
|---------|---------|
| `README.md` | Entry point, positioning, quick start, canonical links |
| `docs/` | Guided learning and operational walkthroughs |
| `CHANGELOG.md` | Concise release-level history (single source) |

Do not duplicate the same guidance across these layers.

## Working Rules

- Keep the repository **small and truthful**. Delete or consolidate stale docs, scripts, and configs instead of preserving low-value history.
- Prefer **one coherent toolchain story** across docs, scripts, and CI. This repo defaults to **npm** for JavaScript tooling.
- Prefer **portable automation**. Do not introduce machine-specific absolute paths in hooks or instructions.
- Default to a **minimal MCP/plugin posture**. Add extra integrations only when they provide recurring, repo-specific value.
- Keep `CHANGELOG.md` as the single release-history surface; do not reintroduce a parallel changelog or spec-tracking system.

## Supported Tooling Baseline

- **Go LSP**: `gopls`
- **Frontend LSP**: TypeScript language service / `typescript-language-server`
- **Diagnostics**: ESLint for frontend, `golangci-lint` for Go
- **Optional editor support**: Tailwind/VitePress language tooling only if it materially helps your workflow

These LSPs are broadly reusable across Claude, Copilot, Codex, and other editors. Prefer documenting a good baseline over committing editor-specific lock-in.

## Build, Test, and Docs Commands

```bash
docker compose up -d postgres
make lint
go test -race ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
```

## Repo-Specific Gotchas

- The Go app reads environment variables directly; `.env` is not auto-loaded.
- Go tests use SQLite in-memory; PostgreSQL is only needed for running the actual server.
- Vite dev proxies `/api` and `/ws` to the Go backend on port `8080`.
- Go serves `frontend/dist` if present, otherwise it falls back to a `web/` static directory if one exists.
- The docs site is the public GitHub Pages surface; keep it distinct from the README.

## Change Quality Bar

Before wrapping up a change:
- the edited docs/configs must not contradict the codebase
- the relevant existing verification commands must pass for the touched surfaces
- update `CHANGELOG.md` when a change is user-visible

When in doubt, simplify.
