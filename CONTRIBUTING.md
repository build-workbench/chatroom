# Contributing to ChatRoom

Thanks for your interest in contributing. ChatRoom is being polished toward an archive-ready finish, so the best contributions are small, high-signal, and clearly grounded in the repository's existing goals.

## Before you start

Read these files first:

- [AGENTS.md](AGENTS.md) — canonical repository workflow
- [`openspec/specs/`](openspec/specs) — normative requirements
- [SECURITY.md](SECURITY.md) — how to report security issues

## Change workflow

Use OpenSpec for any feature work, cross-cutting refactor, process change, or substantial bug fix:

```bash
/opsx:explore
/opsx:propose <change-name>
/opsx:apply <change-name>
/opsx:archive <change-name>
```

Guidelines:
- Keep one coherent change per effort.
- Update specs and implementation together when behavior changes.
- Prefer deleting stale docs/config to preserving low-value drift.
- Avoid speculative tool or workflow expansion unless it materially improves this repository.

## Local setup

### Requirements

- Go 1.24
- Node.js 22
- Docker

### Start the stack

```bash
git clone https://github.com/LessUp/chatroom.git
cd chatroom

docker compose up -d postgres

# backend
go run ./cmd/server

# frontend
npm --prefix frontend ci
npm --prefix frontend run dev
```

## Validation commands

Run the relevant existing commands for the surfaces you touched:

```bash
docker compose up -d postgres
make lint
go test -race ./...
npm --prefix frontend run test
npm --prefix frontend run build
npm --prefix docs ci
npm --prefix docs run docs:build
```

## Code and repo expectations

- Use `openspec/` paths only; do not reintroduce legacy `/specs` references.
- Keep docs concise and purposeful; avoid generic boilerplate.
- Keep automation portable; do not add machine-specific absolute paths.
- Prefer npm consistently for frontend and docs workflows.
- For AI-assisted work, keep repository instruction files aligned with actual practice.

## Documentation maintenance

### Bilingual docs sync

The `docs/en/` and `docs/zh/` directories contain parallel documentation in English and Chinese. When adding or modifying documentation:

- Maintain the same file structure in both directories
- Use identical file names for corresponding documents
- Ensure content parity between translations
- Update both language versions in the same PR

## Pull requests

A good PR includes:

1. A short summary of what changed
2. The related OpenSpec change name (if applicable)
3. The validation commands you ran
4. Notes on docs, workflow, or config impact

Before opening a PR, make sure:

- the relevant specs match reality
- the touched docs do not contradict the codebase
- the existing checks for the touched surfaces pass

## Getting help

- Docs site: https://lessup.github.io/chatroom/
- Issues: https://github.com/LessUp/chatroom/issues
- Discussions: https://github.com/LessUp/chatroom/discussions
