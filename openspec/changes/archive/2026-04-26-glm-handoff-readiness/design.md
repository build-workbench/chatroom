## Context

The repository is being normalized toward a state where either continued low-touch maintenance or archival becomes straightforward. That outcome depends not only on code and docs, but also on whether the final status is captured in a durable, repository-native way. A handoff that lives only in agent memory is not sufficient.

## Current Status

**Completed repository-controlled work:**
- Governance and public-surface cleanup landed: redundant docs-site design pages were removed, navigation and learner references were repaired, and `CONTRIBUTING.md` / `SECURITY.md` were rewritten to be concise and truthful.
- Docs conformance improved: unsupported fence-language warnings were removed from the docs build, and the docs dependency tree was tightened with a safe `postcss` patch override.
- AI/tooling surfaces were right-sized: `AGENTS.md` is now the canonical workflow guide, secondary instruction files were slimmed down, the Claude hook no longer swallows formatter failures, repo-local skills were pruned to the supported OpenSpec/verification set, and `.superpowers/` is ignored.
- Delivery/GitHub surfaces were normalized: CI now pins `golangci-lint` to `v2.1.0`, Dependabot runs monthly with lower PR limits, and GitHub About metadata was curated via `gh`.
- Root OpenSpec specs were upgraded to the current required structure (`## Purpose` + `## Requirements`) and the completed child-change deltas were synced back into the canonical specs.

**Remaining upstream-constrained issue:**
- `npm --prefix docs audit` still reports 3 moderate advisories in the `vitepress -> vite -> esbuild` chain. The current VitePress release line (`1.6.4`) does not expose a safe supported local fix for those remaining items, so they are being carried as explicit upstream constraints rather than patched with unsupported overrides.

**Recommended next action order for GLM (only if further work is desired):**
1. Monitor the VitePress release line for a supported upgrade that clears the remaining `vite/esbuild` advisories.
2. If such an upgrade appears, update `docs/package.json`, rebuild the docs site, and rerun `npm --prefix docs audit`.
3. Otherwise, prefer archival or low-touch maintenance over additional toolchain churn.

## Goals / Non-Goals

**Goals:**
- Record what is complete, what remains, and what is intentionally deferred.
- Capture upstream-constrained issues separately from repository-controlled work.
- Leave GLM with a clear next-step order inside the repository.

**Non-Goals:**
- Creating a second planning system outside OpenSpec.
- Writing a broad retrospective or narrative project history.

## Decisions

### 1. Keep handoff inside OpenSpec

**Decision**: Use change artifacts and the umbrella program status as the canonical handoff surface.

**Rationale**:
- The repository already treats OpenSpec as the normative workflow surface.
- This avoids inventing new standalone planning files.

### 2. Separate deferred work from blocked upstream issues

**Decision**: Capture intentionally deferred tasks separately from issues that remain because upstream dependencies or platform limits have no safe local fix.

**Rationale**:
- GLM should know which work is a repository choice and which is an external constraint.

## Risks / Trade-offs

- **[Handoff becomes stale]** -> Write it last, after the final validation pass.
- **[Too much narrative, not enough action]** -> Focus on current status, next actions, and constraints.

## Migration Plan

1. Add the delta specs and tasks.
2. Record final status after the implementation and verification pass.
3. Sync the handoff surface with the umbrella finalization program before archival.

## Open Questions

None.
