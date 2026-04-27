## Why

The finalization work should leave behind a repository-native handoff surface for GLM. Without that, important decisions, remaining upstream constraints, and the recommended next task order would remain trapped in session history instead of the repo itself.

## What Changes

- Capture the repository's post-finalization status, remaining constraints, and next-step order in OpenSpec artifacts.
- Distinguish completed work from intentionally deferred or upstream-blocked work.
- Make the handoff useful both for GLM continuation and for immediate archival review.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `repository-curation`: Add requirements for canonical handoff status capture.
- `ai-collaboration`: Add requirements for repo-native model handoff rather than transient chat-only state.
- `testing`: Add requirements for final status summaries to reflect actual verified repository state.

## Impact

- `openspec/changes/glm-handoff-readiness/**`
- `openspec/specs/repository-curation/spec.md`
- `openspec/specs/ai-collaboration/spec.md`
- `openspec/specs/testing/spec.md`
