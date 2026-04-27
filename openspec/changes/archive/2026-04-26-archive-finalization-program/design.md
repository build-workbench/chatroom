## Context

ChatRoom already has a mostly working application and a partially normalized repository shell. The remaining work is not a single bug or feature; it is a coordinated finish across governance, docs, workflows, release presentation, AI/tooling configuration, and final handoff. The repository also has a strong preference for OpenSpec-first execution, compact canonical surfaces, and long-running single-stream cleanup over fragmented parallel work.

The execution challenge is scope control. If the finalization effort is tracked as one flat checklist, it will become another oversized cleanup blob. If it is split too aggressively, the repository will regress into spec and branch sprawl. The design therefore needs one umbrella change for end-state control and a small set of child changes for focused implementation.

## Goals / Non-Goals

**Goals:**
- Define one umbrella OpenSpec change that acts as the source of truth for the final repository end state.
- Break the remaining work into a small number of focused child changes aligned to governance/docs, runtime conformance, delivery/GitHub integration, AI/tooling, and handoff.
- Preserve the full public release surface while still removing low-value workflow and configuration complexity.
- Ensure the final handoff to GLM is repository-native: tracked in OpenSpec and canonical docs, not only in session state.

**Non-Goals:**
- Replacing the OpenSpec workflow with a separate project-management layer.
- Introducing new major product capabilities unrelated to finalization.
- Expanding the plugin/MCP/tool surface beyond what is needed to finish the repository.
- Treating the umbrella change itself as the place to dump every implementation detail from every child change.

## Decisions

### 1. Use one umbrella program plus focused child changes

**Decision**: `archive-finalization-program` will own the final end-state definition and sequencing rules, while implementation work is executed through a small set of child changes.

**Rationale**:
- The repository needs one authoritative top-level finish line.
- Focused child changes keep specs, tasks, and reviews small enough to reason about.
- This structure matches the user's explicit preference for a mother plan plus multiple OpenSpec sub-changes.

**Alternatives considered**:
- One giant implementation change: rejected because it would recreate the same drift and review problems the cleanup is meant to solve.
- Many tiny unrelated changes: rejected because it would increase coordination cost and weaken the sense of one coherent finish.

### 2. Follow a governance-first execution order

**Decision**: Implement child changes in this dependency order: governance/docs boundaries first, runtime conformance second, delivery/GitHub alignment third, AI/tooling right-sizing fourth, and GLM handoff last.

**Rationale**:
- Governance and docs define what the rest of the repository should look like.
- Runtime and delivery changes are easier to judge once the end-state rules are explicit.
- Handoff quality depends on all earlier surfaces being stable.

**Alternatives considered**:
- Delivery-first: rejected because it stabilizes automation before the repository story is fully settled.
- Public landing-page first: rejected because it risks polishing the exterior while leaving internal drift unresolved.

### 3. Keep the full delivery surface but aggressively cut supporting noise

**Decision**: GitHub Releases, multi-platform binaries, Docker images, and GitHub Pages remain part of the final product surface, but every supporting workflow or config step must justify itself against those outputs.

**Rationale**:
- The user explicitly wants the full release surface preserved.
- The current goal is not minimalism at all costs; it is truthful, durable finalization.
- This allows simplification without collapsing valuable release affordances.

**Alternatives considered**:
- Collapse to CI + Pages only: rejected because it contradicts the requested end state.

### 4. Treat AI/tooling as a governed repository surface

**Decision**: AI instructions, `.claude` assets, Copilot guidance, LSP baseline, and MCP/plugin posture are first-class repository surfaces and must be reviewed with the same rigor as docs or workflows.

**Rationale**:
- The repo will be handed off to another model, so instruction quality materially affects maintainability.
- Tooling drift is one of the project's stated cleanup problems.
- Minimal, project-specific guidance reduces future context waste.

**Alternatives considered**:
- Leave current AI/tooling surfaces mostly untouched: rejected because they are part of the identified drift.

## Risks / Trade-offs

- **[Umbrella change becomes a dumping ground]** -> Keep implementation specifics inside child changes and use the umbrella change only for program-level constraints, sequencing, and completion criteria.
- **[Child changes diverge from the umbrella intent]** -> Require each child change to reference the umbrella scope and update the umbrella tasks when sequencing or scope changes.
- **[Full release surface preserves too much complexity]** -> Simplify only the supporting workflow structure, not the documented output set.
- **[Handoff becomes stale during implementation]** -> Reserve a final child change specifically for handoff capture after repository surfaces stabilize.

## Migration Plan

1. Finalize the umbrella change artifacts and define the required child-change map.
2. Create child changes with focused proposal/design/spec/task artifacts.
3. Implement child changes in dependency order, updating the umbrella task list as milestones land.
4. Reconcile final validation, GitHub metadata, and release/documentation truthfulness.
5. Produce the GLM handoff package and close the umbrella change once child changes are complete or explicitly deferred.

**Rollback strategy**:
- Each child change remains revertible on its own.
- The umbrella change is mostly program metadata, so it can be corrected incrementally without risky runtime rollback.

## Outcome Snapshot

**Implemented child changes:**
- `normalize-governance-surfaces`
- `runtime-conformance-sweep`
- `rightsize-ai-tooling`
- `refine-delivery-and-github`
- `glm-handoff-readiness`

**Repository-controlled outcome:**
- Canonical docs/community surfaces were tightened.
- Docs build warnings were removed and one safe docs dependency advisory was fixed.
- AI instruction and Claude tooling surfaces were simplified to a smaller, explicit default path.
- GitHub metadata, CI lint versioning, and Dependabot cadence were normalized.
- Root OpenSpec specs now validate under the current CLI schema.

**Explicitly retained constraint:**
- Remaining docs audit advisories in the `vitepress -> vite -> esbuild` chain are upstream-constrained in the current supported VitePress release line and were not force-overridden.

## Open Questions

None. Any newly discovered scope expansion should become either a child-change task or an explicitly deferred item in the final handoff.
