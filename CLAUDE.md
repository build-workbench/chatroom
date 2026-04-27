# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first. It is the canonical repository workflow guide.

## Claude-specific deltas

Use `AGENTS.md` for the shared repo rules. In Claude specifically:

1. Use `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, and `/opsx:archive` as the primary OpenSpec lifecycle.
2. Prefer long-running autopilot plus milestone `/review` over routine `/fleet`.
3. Keep the docs site distinct from the README. If a change alters both, tighten the boundary instead of duplicating content.
4. Treat `.claude/` as a maintained repository surface: keep commands and hooks portable, explicit, and worth their cost.

## Specific cautions

- Do not reintroduce legacy `/specs` references.
- Do not keep machine-specific absolute paths in hooks or automation.
- Do not preserve low-value changelog or release-note sprawl just for completeness.
- The Go app reads environment variables directly; `.env` is not auto-loaded.
- Go tests require PostgreSQL to be running.
- Vite dev proxies `/api` and `/ws` to the Go backend on port `8080`.
