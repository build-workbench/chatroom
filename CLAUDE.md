# CLAUDE.md

Read [AGENTS.md](AGENTS.md) first. It is the canonical repository workflow guide.

## What matters in this repo

- This is a **teaching-oriented** project being prepared for an **archive-ready** finish.
- The repository uses **OpenSpec**. Non-trivial work belongs in `openspec/changes/` and should follow `/opsx:explore` → `/opsx:propose` → `/opsx:apply` → `/opsx:archive`.
- Prefer **deletion and consolidation** over adding generic docs, scripts, or config.
- Keep guidance **project-specific**. Avoid boilerplate that could apply to any repository.

## Canonical locations

- `openspec/specs/` — normative requirements
- `openspec/changes/` — active change artifacts
- `docs/` — guided docs and GitHub Pages content
- `README*` — repo entry point

## Toolchain baseline

- Go 1.24
- Node.js 22
- npm for frontend and docs workflows
- `gopls` + TypeScript language service + ESLint as the default LSP/diagnostic baseline

## Existing commands

```bash
docker compose up -d postgres
make lint
go test -race ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
```

## Specific cautions

- Do not reintroduce legacy `/specs` references.
- Do not keep machine-specific absolute paths in hooks or automation.
- Do not preserve low-value changelog or release-note sprawl just for completeness.
- Prefer long-running autopilot and milestone reviews over unnecessary `/fleet`.
