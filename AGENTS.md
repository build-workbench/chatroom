# Repository Collaboration Guide

## Project Snapshot

ChatRoom is a teaching-oriented real-time chat application:
- **Backend**: Go 1.24, Gin, GORM, Gorilla WebSocket, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4
- **Docs**: VitePress
- **Process**: OpenSpec-driven development

The repository is being normalized for an archive-ready end state. Favor clarity, consistency, and maintainability over feature expansion or engineering theater.

`AGENTS.md` is the canonical workflow guide. Tool-specific files such as `CLAUDE.md` and `.github/copilot-instructions.md` should only add concise tool-specific deltas.

## Canonical Surfaces

| Surface | Purpose |
|---------|---------|
| `README.md` / `README.zh-CN.md` | Entry point, positioning, quick start, canonical links |
| `docs/` | Guided learning and operational walkthroughs |
| `openspec/specs/` | Normative capability requirements |
| `openspec/changes/` | Active change proposals and task lists |
| `CHANGELOG.md` | Concise release-level history |

Do not duplicate the same guidance across these layers.

## Default Workflow

For any non-trivial feature, refactor, workflow change, or cross-cutting cleanup:

1. **Explore first**: use `/opsx:explore` if scope or design is unclear.
2. **Propose the change**: use `/opsx:propose <name>` to create proposal, design, specs, and tasks.
3. **Implement from tasks**: use `/opsx:apply <name>` and keep tasks updated as work completes.
4. **Archive finished work**: use `/opsx:archive <name>` when implementation is complete.

If a request changes externally visible behavior, documentation boundaries, or engineering policy, update the relevant OpenSpec artifact in the same change.

## Working Rules

- Keep the repository **small and truthful**. Delete or consolidate stale docs, scripts, and configs instead of preserving low-value history.
- Use `openspec/` paths only. Legacy `/specs` references are drift and should be removed.
- Prefer **one coherent toolchain story** across docs, scripts, and CI. This repo defaults to **npm** for JavaScript tooling.
- Prefer **portable automation**. Do not introduce machine-specific absolute paths in hooks or instructions.
- Prefer **long-running autopilot** for substantial cleanup work. Use `/review` or targeted subagents at meaningful milestones. Avoid `/fleet` unless the work is clearly parallelizable and worth the extra cost.
- Default to a **minimal MCP/plugin posture**. Add extra integrations only when they provide recurring, repo-specific value.

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
- Go tests require PostgreSQL to be running.
- Vite dev proxies `/api` and `/ws` to the Go backend on port `8080`.
- Go serves `frontend/dist` if present, otherwise it falls back to `web/`.
- The docs site is the public GitHub Pages surface; keep it distinct from the README.

## Change Quality Bar

Before wrapping up a change:
- the affected OpenSpec artifacts must match reality
- the edited docs/configs must not contradict the codebase
- the relevant existing verification commands must pass for the touched surfaces

When in doubt, simplify.
