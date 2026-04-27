## Context

ChatRoom has already consolidated around OpenSpec and a small command set, but the AI guidance is still slightly too repetitive across surfaces. The Claude post-edit hook also uses `2>/dev/null || true`, which means formatter failures disappear instead of surfacing. That contradicts the repository's preference for portable, explicit automation.

## Goals / Non-Goals

**Goals:**
- Make `AGENTS.md` the primary workflow document and slim the other instruction files down to tool-specific deltas.
- Keep the Claude hook useful, but only for cases the repository can support reliably.
- Remove generic repo-local Claude skills that are not part of the repository's chosen maintenance workflow.
- Ignore transient AI working state such as `.superpowers/` before it can drift into version control.

**Non-Goals:**
- Introducing new tool-specific config files without a clear repository need.
- Building a complex multi-agent or plugin-heavy setup.
- Replacing OpenSpec with tool-specific workflows.

## Decisions

### 1. Make AGENTS the canonical workflow, others the deltas

**Decision**: Keep `AGENTS.md` as the canonical cross-tool workflow guide, and reduce `CLAUDE.md` and Copilot instructions to the minimum extra guidance each tool actually needs.

**Rationale**:
- One canonical file is easier to keep truthful.
- Smaller tool-specific files reduce duplicated drift.

### 2. Keep hooks explicit, not silent

**Decision**: Rewrite the Claude hook command so non-applicable cases exit cleanly, but actual formatter failures are no longer suppressed.

**Rationale**:
- Silent automation failures train contributors to distrust the tooling.
- A few shell guards are enough to keep the hook portable without broad error swallowing.

### 3. Ignore AI scratch space

**Decision**: Add transient AI collaboration directories to `.gitignore` when they are meant for session-only artifacts.

**Rationale**:
- The repository already values generated-artifact hygiene.
- AI scratch directories are the same class of transient state as editor caches or build outputs.

### 4. Keep only the repo-local skills that match the supported workflow

**Decision**: Retain repo-local OpenSpec lifecycle and verification skills, and remove generic BMAD- or story-oriented skill directories that are not part of the repository's final default workflow.

**Rationale**:
- The project explicitly favors a minimal, project-specific AI surface.
- Large generic skill packs increase maintenance cost and dilute the default path for future contributors.

## Risks / Trade-offs

- **[Files become too short to be useful]** -> Keep the canonical workflow in `AGENTS.md` and only remove repeated text from the secondary files.
- **[Hook becomes noisy]** -> Guard non-applicable cases carefully and only surface real formatter failures.
- **[Useful skills are deleted]** -> Keep the repo-local skill set anchored to OpenSpec lifecycle and full verification, which are the actual supported defaults.
- **[Ignoring AI scratch paths hides useful artifacts]** -> Only ignore session/transient directories, not canonical project docs.

## Migration Plan

1. Add the OpenSpec delta specs and tasks.
2. Rewrite the three instruction files around a clearer responsibility split.
3. Harden the Claude hook and ignore transient AI scratch space.
4. Re-run the touched validation commands and confirm the instruction surfaces still align.

## Open Questions

None.
