## Why

The repository already has workable AI guidance, but the instruction files still overlap more than they should and the Claude hook configuration currently hides formatter failures behind a broad silent fallback. For an archive-ready handoff, the AI/tooling surface should be smaller, clearer, and more truthful.

## What Changes

- Rebalance `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` so each file has a distinct role with less duplicated prose.
- Harden `.claude/settings.json` so repository-managed hooks are portable and do not silently swallow formatter errors.
- Prune repo-local Claude skills down to the minimum set that directly supports the repository's OpenSpec-first workflow and verification needs.
- Ignore transient AI working directories that should never become tracked repository state.
- Reaffirm the repository's minimal MCP/plugin posture and supported LSP baseline in the canonical instruction surfaces.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ai-collaboration`: Tighten requirements for project-specific instruction boundaries and reliable hook behavior.
- `developer-tooling`: Tighten requirements for transient AI artifact hygiene and the final documented tooling baseline.

## Impact

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `.claude/settings.json`
- `.gitignore`
- `openspec/specs/ai-collaboration/spec.md`
- `openspec/specs/developer-tooling/spec.md`
