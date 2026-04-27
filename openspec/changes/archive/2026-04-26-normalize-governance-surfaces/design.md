## Context

ChatRoom already has a credible README and a distinct docs landing page, but parts of the docs site still behave like a second architectural spec or a loose note collection. The `design.md` pages duplicate architectural intent without being the canonical spec surface, and several learner-facing pages still point to files or sections that no longer exist. The community-facing docs also need one more pass to remove placeholder security contact data and make support/reporting guidance truthful.

## Goals / Non-Goals

**Goals:**
- Reduce docs-site overlap by removing low-value design pages and rewiring navigation to higher-signal pages.
- Fix stale file-path references and broken next-step guidance in learner-facing docs.
- Make contributing and security guidance compact, truthful, and aligned with the current archive-ready maintenance posture.
- Update the relevant OpenSpec capability deltas so these repository-surface changes are explicitly governed.

**Non-Goals:**
- Rewriting the full architecture or API docs from scratch.
- Adding new learning modules beyond what is needed to replace removed links.
- Changing runtime application behavior.

## Decisions

### 1. Remove docs-site design pages instead of refreshing them

**Decision**: Delete `docs/en/design.md` and `docs/zh/design.md` and route readers toward architecture, monitoring, deployment assets, and OpenSpec when they need deeper reasoning.

**Rationale**:
- The docs site already has architecture and API pages, while OpenSpec owns normative requirements.
- A separate design page adds another long-form narrative surface that is hard to keep current.
- Deletion is more consistent with the repo's "small and truthful" standard than refreshing another overlapping page.

**Alternatives considered**:
- Rewrite the design pages: rejected because it preserves overlap without adding a new canonical responsibility.

### 2. Prefer concrete learning references over aspirational examples

**Decision**: Update learner-facing docs so every referenced file, command, and next-step page exists in the current repository.

**Rationale**:
- Teaching material loses trust quickly when it points to files that are not there.
- Small documentation fixes pay back immediately because the docs are part of the product surface.

**Alternatives considered**:
- Leave minor drift until a later bug sweep: rejected because this child change is specifically about public-surface truthfulness.

### 3. Keep community docs concise and truthful

**Decision**: Rewrite `SECURITY.md` and tighten `CONTRIBUTING.md` so they avoid placeholders, weak relative links, and unnecessary process prose.

**Rationale**:
- A fake security mailbox is worse than a smaller but truthful policy.
- The project is in a low-touch finalization state, so guidance should be direct and minimal.

## Risks / Trade-offs

- **[Removing design pages hides useful rationale]** -> Keep architecture, deploy assets, README, and OpenSpec links prominent so readers still have clear paths for deeper study.
- **[Docs cleanup breaks navigation]** -> Update every known reference in config, learning paths, manual testing, and landing pages before deleting files.
- **[Security policy becomes too minimal]** -> Preserve the essential reporting and disclosure rules, but avoid unverifiable details like fake addresses or SLA promises.

## Migration Plan

1. Add OpenSpec delta specs and tasks for the governance cleanup.
2. Update docs navigation and in-page references, then delete the redundant design pages.
3. Rewrite contribution and security docs to match the final maintenance posture.
4. Rebuild the docs site to verify navigation and content integrity.

## Open Questions

None.
