## Context

The repository already contains a functioning application, but its surrounding governance and engineering surface has drifted. The current state mixes a partially completed migration from legacy `/specs` paths to `openspec/`, broad and sometimes weakly grounded capability specs, generic or redundant documentation, inconsistent tooling decisions, and automation that no longer clearly matches the project’s end-state.

This change is cross-cutting by design. It touches OpenSpec, repository guidance files, GitHub workflows, Pages positioning, changelog policy, toolchain documentation, and bug/conformance fixes. It also absorbs the former `add-mentions` change into a broader closure program so the project can finish with one coherent top-level direction instead of fragmented cleanup streams.

Key constraints:
- Teaching-oriented project: clarity and maintainability matter more than feature breadth.
- Closure-oriented scope: prefer deletion, consolidation, and alignment over adding new systems.
- Future work should remain feasible in long-running autopilot sessions without relying heavily on `/fleet`.
- Repository changes must respect existing user-owned edits and avoid unnecessary churn.

## Goals / Non-Goals

**Goals:**
- Establish one canonical repository story across OpenSpec, README, Pages, AI guidance, workflows, and GitHub metadata.
- Reduce documentation and configuration sprawl to the minimum set that carries clear project-specific value.
- Define a durable OpenSpec-first workflow for Claude, Copilot, review/subagents, and future low-touch maintenance.
- Align toolchain, package-manager, hook, and workflow choices so the repo is internally consistent.
- Repair real bugs and conformance gaps uncovered during normalization.

**Non-Goals:**
- Expanding the product with large new user-facing features beyond what is needed to resolve absorbed or blocking drift.
- Creating a complex multi-MCP or plugin-heavy environment.
- Preserving every historical changelog or documentation artifact for its own sake.
- Rebranding the project away from its teaching/demo positioning.

## Decisions

### 1. Use one umbrella closure change

**Decision**: Execute the work through a single `archive-readiness-hardening` change, capture the old `add-mentions` stream as triaged context, and defer mention-specific feature delivery unless it is intentionally re-proposed later.

**Rationale**:
- The current problem is systemic, not localized.
- One umbrella change reduces coordination overhead and prevents cleanup work from drifting across multiple parallel branches.
- Absorbing `add-mentions` avoids keeping an in-progress feature stream alive as a separate source of architectural drift.

**Alternatives considered**:
- Keep `add-mentions` as a parallel active change: rejected because it increases coordination and spec fragmentation.
- Create many smaller cleanup changes: rejected because the repository already suffers from artifact sprawl.

### 2. Rebuild the repository around clear information boundaries

**Decision**: Treat README, docs site, OpenSpec, and changelog as distinct layers with non-overlapping purposes.

**Boundary model**:
- `README*`: entry point, positioning, quick start, core architecture snapshot
- `docs/`: guided learning and operational walkthroughs
- `openspec/`: normative requirements and change history
- `CHANGELOG.md`: concise release-level history only

**Rationale**:
- The repository currently repeats the same story in too many places.
- A sharper boundary makes future maintenance cheaper and helps users find the right source faster.

**Alternatives considered**:
- Keep broad duplication for “discoverability”: rejected because it creates staleness and weakens trust.

### 3. Prefer simplification over preservation

**Decision**: Delete or merge low-value historical changelog/release-note artifacts unless they provide clear release traceability that is not preserved elsewhere.

**Rationale**:
- The project is entering an archive-ready phase, not a growth phase.
- Excess narrative history competes with the core teaching value and makes future updates harder.

**Alternatives considered**:
- Preserve all historical files and just add indexes: rejected because the current problem is excess surface area, not missing navigation.

### 4. Keep AI/tooling guidance repo-specific and minimal

**Decision**: Use project-level guidance files (`AGENTS.md`, `CLAUDE.md`, `copilot-instructions.md`) plus a minimal reliable hook setup as the primary collaboration surface; adopt MCPs/plugins only when they have concrete recurring value.

**Rationale**:
- Repo-specific instructions carry more value than generic tooling boilerplate.
- Minimal surfaces are easier to keep correct during a closure phase.
- LSP support is broadly reusable across tools, while MCP/plugins often introduce extra maintenance or context cost.

**Alternatives considered**:
- Add many tool-specific configs and integrations upfront: rejected because it increases complexity without guaranteed payoff.

### 5. Keep automation high-signal

**Decision**: Retain only workflows and automation that materially support archive-readiness: verification, docs/pages deployment, release, and essential dependency maintenance.

**Rationale**:
- Noisy workflows create maintenance drag and weaken the meaning of CI signal.
- A near-finished project benefits from predictable, comprehensible automation rather than breadth.

**Alternatives considered**:
- Preserve all current automation and just tweak naming: rejected because it does not solve the signal-to-noise problem.

## Risks / Trade-offs

- **[Deleting too much history]** → Preserve concise release history in canonical surfaces before removing detail-heavy artifacts.
- **[Absorbed `add-mentions` scope re-expands the change]** → Preserve only the routing decision and defer mention-specific feature delivery unless it becomes explicitly in scope again.
- **[Spec rewrites diverge from implementation reality]** → Audit code and workflows before finalizing modified requirements, then fix whichever side is wrong.
- **[Tooling simplification breaks contributor expectations]** → Document the supported baseline clearly in repo guidance and avoid implicit behavior.
- **[Workflow reduction removes useful safety checks]** → Keep only checks with clear blocking value; move optional or exploratory checks out of required paths.

## Migration Plan

1. Audit and classify current drift: legacy spec references, stale docs, workflow mismatches, broken hooks, transient tracked artifacts, GitHub metadata gaps, and superseded feature branches of work.
2. Create change-local delta specs that define the normalized repository end-state.
3. Rewrite AI guidance and repository documentation around the new information architecture.
4. Simplify workflows, package-manager/toolchain declarations, hook behavior, and metadata configuration.
5. Execute the repo-wide bug/conformance sweep against the updated specs.
6. Finalize GitHub About/Pages positioning and archive-ready cleanup.

**Rollback strategy**:
- Most changes are file-level repository curation and can be reverted cleanly by commit if needed.
- For deleted historical docs, preserve any final canonical content in `CHANGELOG.md` or active specs before removal.

## Open Questions

None at this stage. Any newly discovered blockers during the audit should become explicit tasks or follow-up deltas inside this umbrella change rather than implicit scope creep.
