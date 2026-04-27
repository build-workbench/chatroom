## Why

The repository is close to an archive-ready state, but it still has drift across OpenSpec execution, public documentation, GitHub delivery surfaces, and AI/tooling guidance. That remaining drift makes the project harder to finish cleanly and leaves too much implicit knowledge for the final handoff.

## What Changes

- Establish one umbrella finalization program that governs the repository's last large cleanup pass and explicitly sequences the work through focused child changes.
- Tighten the canonical repository story across OpenSpec, root docs, GitHub Pages, workflows, release surfaces, and GitHub metadata.
- Require that documentation, workflow, and AI/tooling changes be evaluated against the project's archive-ready end state instead of being handled as isolated cleanup.
- Keep the full public release surface intact, including GitHub Releases, multi-platform binaries, Docker images, and GitHub Pages, while simplifying anything that does not materially support those outcomes.
- Create a structured handoff surface for GLM so remaining work and deferred scope are explicit instead of hidden in chat history.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-curation`: Add program-level requirements for canonical docs boundaries, final Pages positioning, and structured GLM handoff artifacts.
- `ai-collaboration`: Add requirements for umbrella-change decomposition, long-running autopilot execution, and repo-specific AI instruction consolidation.
- `developer-tooling`: Add requirements for final AI/tooling pruning decisions, LSP baseline clarity, and minimal plugin/MCP posture.
- `technical-design`: Add requirements for umbrella-to-child change sequencing, complete delivery-surface retention, and archive-finalization execution boundaries.
- `open-source-standards`: Add requirements for final GitHub metadata alignment, community-file review, and release-surface truthfulness.
- `testing`: Add requirements for finalization-program verification, including docs, workflows, release surfaces, and handoff coherence checks.

## Impact

- **OpenSpec program control**: `openspec/changes/archive-finalization-program/**`, additional child changes under `openspec/changes/`
- **Repository governance and public surfaces**: `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `README*.md`, `docs/**`, `CHANGELOG.md`
- **Engineering and delivery**: `.github/workflows/*`, release packaging paths, toolchain/version declarations, `.claude/**`
- **GitHub operations**: repository description, topics, homepage URL, Pages configuration managed through `gh`
