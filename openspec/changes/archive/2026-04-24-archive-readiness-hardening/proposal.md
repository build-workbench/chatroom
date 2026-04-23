## Why

The repository is in a partially normalized state after drift across documentation, OpenSpec migration, workflows, AI guidance files, and engineering configuration. That drift now hurts trust: the project tells multiple conflicting stories about its structure, workflow, tooling, and quality bar.

This change is needed now to bring the project to a deliberate archive-ready finish. The goal is not to add more surface area, but to aggressively remove weak or redundant pieces, align the remaining ones with reality, and leave behind a compact OpenSpec-driven workflow that can support low-touch maintenance.

## What Changes

- Create one umbrella closure-hardening change that absorbs the former `add-mentions` workstream into a broader archive-readiness effort and explicitly defers mention-specific feature delivery unless it is later re-proposed.
- Finish the migration from legacy `/specs` references to `openspec/` across repository guidance and documentation.
- Redesign the spec set so repository governance, docs architecture, and developer tooling are described as clear capabilities instead of vague or over-broad buckets.
- Rewrite project governance files (`AGENTS.md`, `CLAUDE.md`, generated Copilot instructions, hooks/instruction config) so they are concise, project-specific, and OpenSpec-first.
- Simplify engineering configuration: unify package-manager/toolchain expectations, reduce noisy or low-value automation, and remove broken or transient artifacts from version control.
- Rework README, GitHub Pages, and repository About metadata so the project presents a strong teaching-oriented identity without redundant documentation sprawl.
- Aggressively delete or consolidate low-value changelog and release-note artifacts, preserving only the minimum useful history.
- Sweep the codebase, docs, and workflows for bugs and conformance gaps that block a stable archive-ready state.

## Capabilities

### New Capabilities
- `repository-curation`: Defines the archive-ready repository surface, including README/Pages/About positioning, documentation boundaries, and cleanup rules for low-signal historical artifacts.
- `ai-collaboration`: Defines project-specific workflows for OpenSpec, Claude, Copilot, review/subagent usage, instruction files, and reliable hooks without tool sprawl.
- `developer-tooling`: Defines the supported local tooling baseline for this repository, including package-manager choices, LSP/editor guidance, and the minimal MCP/plugin strategy.

### Modified Capabilities
- `open-source-standards`: Tighten repository standards so required docs, templates, metadata, and changelog policy reflect the project’s actual teaching-oriented archive-ready end state.
- `technical-design`: Update repository structure, OpenSpec location rules, CI/CD boundaries, workflow simplification goals, and toolchain/version alignment to match the normalized architecture.
- `testing`: Refine verification expectations for closure work so bug fixes, configuration changes, and repo cleanup are checked consistently without unnecessary process overhead.

## Impact

- **OpenSpec**: `openspec/specs/*` and new change-local delta specs
- **Repository governance**: `AGENTS.md`, `CLAUDE.md`, generated `copilot-instructions.md`, `.claude/settings.json`
- **Docs and presentation**: `README.md`, `README.zh-CN.md`, `docs/`, `CHANGELOG.md`, `changelog/`, `release-notes.md`
- **Engineering/configuration**: `.github/workflows/*`, `.github/*template*`, `.github/dependabot.yml`, `.gitignore`, package/tooling config files
- **GitHub operations**: repository description, homepage URL, and topics managed via `gh`
