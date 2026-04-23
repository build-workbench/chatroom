# Copilot Instructions for ChatRoom

## Project intent

ChatRoom is a teaching-oriented Go + React real-time chat application. The repository is being polished toward an archive-ready state, so prioritize correctness, clarity, and cleanup over feature growth.

## Workflow

1. Use **OpenSpec** for non-trivial work.
2. Read or update `openspec/specs/` when repository behavior, process, or externally visible surfaces change.
3. Implement through an active change in `openspec/changes/`.
4. Keep task checkboxes in the change’s `tasks.md` accurate.

## Canonical surfaces

- `README.md` / `README.zh-CN.md`: entry point only
- `docs/`: guided learning and Pages content
- `openspec/specs/`: normative requirements
- `CHANGELOG.md`: concise release history

Avoid duplicating the same guidance across multiple markdown files.

## Repository rules

- Remove stale `/specs` references; use `openspec/` paths only.
- Prefer deleting or consolidating low-value docs, scripts, and configs instead of preserving them.
- Use **npm** consistently for frontend and docs workflows.
- Keep hooks and automation **portable**; no machine-specific absolute paths.
- Prefer minimal MCP/plugin usage. Favor built-in tooling, OpenSpec, `/review`, and targeted subagents.

## Tooling baseline

- Go: `gopls`, `golangci-lint`
- Frontend: TypeScript language service, ESLint
- Recommended runtime baseline: Go 1.24, Node.js 22

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
