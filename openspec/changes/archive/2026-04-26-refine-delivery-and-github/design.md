## Context

The repository's CI, Pages, and Release workflows are already much cleaner than before, so this change should stay narrow. Investigation highlights three worthwhile refinements:

1. CI still uses `golangci-lint` with `version: latest`, which weakens reproducibility.
2. Dependabot is still tuned for a more active project cadence than an archive-ready teaching repository needs.
3. GitHub About metadata is mostly aligned already, but the repository should explicitly curate it through `gh` as part of the final normalization pass.

## Goals / Non-Goals

**Goals:**
- Anchor the remaining floating workflow tool version that materially affects reproducibility.
- Lower automated dependency-update churn without disabling maintenance outright.
- Confirm and curate GitHub About metadata using the repository's actual final story.

**Non-Goals:**
- Rebuilding the full workflow architecture.
- Dropping the release, Docker, or Pages surface.
- Adding new automation systems.

## Decisions

### 1. Pin workflow tooling where drift matters

**Decision**: Replace the CI `golangci-lint` floating version with an explicit version.

**Rationale**:
- Linters are especially sensitive to silent drift.
- Version anchoring improves repeatability without increasing complexity much.

### 2. Tune Dependabot for low-touch maintenance

**Decision**: Reduce open PR limits and lower update frequency to monthly for the archive-ready phase.

**Rationale**:
- The project is no longer in a rapid-growth phase.
- Lower volume preserves visibility and review quality.

### 3. Curate GitHub About deliberately

**Decision**: Update description, homepage, and topics through `gh`, even if the current values are close, so the final state is explicit and reproducible.

**Rationale**:
- This phase is about deliberate normalization, not passive acceptance.
- GitHub metadata is part of the public repository surface.

## Risks / Trade-offs

- **[Pinned tool version ages]** -> Dependabot still updates GitHub Actions, and future maintainers can bump intentionally.
- **[Monthly updates delay dependency visibility]** -> This is acceptable for a stable, archive-ready project with a small surface area.
- **[Topic curation removes discoverability terms]** -> Prefer a smaller set of high-signal topics over a broad but noisy topic cloud.

## Migration Plan

1. Add delta specs and tasks.
2. Anchor the remaining floating CI tool version.
3. Reduce Dependabot churn.
4. Update GitHub About metadata with `gh`.
5. Re-run the touched validation and metadata checks.

## Open Questions

None.
