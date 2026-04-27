## Why

The repository still has drift in its public guidance surfaces: the docs site carries an extra design layer with overlapping content, some learning-path references point to outdated files, and the security/community docs still include placeholder or weak contact guidance. Those issues undermine the "small, truthful, archive-ready" standard the project now aims to meet.

## What Changes

- Tighten the repository's public information architecture so README, docs, OpenSpec, and community files each have a clearer and smaller role.
- Remove the redundant docs-site design pages and replace their references with architecture, monitoring, deployment, or workflow surfaces that actually exist and remain valuable.
- Fix stale learning-path and manual-testing links so docs point to current files and realistic next steps.
- Rewrite security and contribution guidance to be concise, truthful, and repository-specific, removing placeholder contact details and weak relative links.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-curation`: Tighten requirements for docs-site information architecture, canonical navigation, and removal of overlapping long-form design pages.
- `open-source-standards`: Tighten requirements for truthful community-facing contact and maintenance surfaces, especially security reporting guidance.

## Impact

- `docs/.vitepress/config.mts`
- `docs/index.md`, `docs/en/**`, `docs/zh/**`
- `CONTRIBUTING.md`, `SECURITY.md`
- `openspec/specs/repository-curation/spec.md`
- `openspec/specs/open-source-standards/spec.md`
