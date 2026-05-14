## Context

The ChatRoom docs site currently uses VitePress 1.6.4 with a flat content structure. It builds successfully but lacks the visual and structural depth expected of a technical whitepaper. The kimi-cli project demonstrates a more advanced setup with mermaid, vitepress-plugin-llms, and changelog sync. The chatroom project has rich technical content (WebSocket Ticket auth, Token Rotation, Postgres NOTIFY-based distributed sync) that deserves deeper presentation.

Key constraints:
- Must stay on VitePress (the project's chosen docs framework)
- Content must be bilingual (zh-CN / en)
- Must build successfully in GitHub Actions with Node.js 20.x
- No backward compatibility concerns — aggressive changes are welcome
- Long-term maintainability and technical advancement are priorities

## Goals / Non-Goals

**Goals:**
- Transform docs site from "product manual" to "technical whitepaper / architecture showcase"
- Add mermaid for interactive diagrams, replacing ASCII art
- Add vitepress-plugin-llms for AI-friendly output
- Add changelog sync to keep docs in sync with repo CHANGELOG.md
- Create ADR section documenting key design decisions with alternatives analysis
- Create deep-dive sections for performance, security, and scalability
- Redesign homepage with technical overview emphasis
- Lower Node.js requirement to 20.x for CI alignment

**Non-Goals:**
- Adding a custom web app (like kimi-cli's separate `web/` directory) — VitePress is sufficient
- Creating animated demos or screencasts — mermaid diagrams suffice for architecture
- Migrating to a different SSG framework
- Adding i18n tooling beyond VitePress locales

## Decisions

### 1. Use vitepress-plugin-mermaid for diagrams

**Decision**: Use `vitepress-plugin-mermaid` (same as kimi-cli) to render mermaid diagrams inline.

**Rationale**:
- Replaces all ASCII architecture diagrams with interactive, zoomable, exportable diagrams
- Mermaid is the de facto standard for docs-as-code diagrams
- The plugin integrates cleanly with VitePress's markdown pipeline
- kimi-cli already validates this combination works at scale

**Alternatives considered**:
- PlantUML: requires external server, more complex setup
- D2: newer, smaller ecosystem, less familiar to contributors
- Keep ASCII art: not interactive, doesn't scale to complex diagrams

### 2. Use vitepress-plugin-llms for AI-friendly output

**Decision**: Add `vitepress-plugin-llms` to generate `llms.txt` and `llms-full.txt`.

**Rationale**:
- Enables AI assistants to index and reason about the documentation
- Growing standard for technical documentation sites
- Zero maintenance cost — automatic generation from existing content
- kimi-cli already uses this successfully

**Alternatives considered**:
- Manual llms.txt: maintenance burden, will go stale
- Skip entirely: misses the growing AI-friendly docs trend

### 3. Lower Node.js requirement to 20.x

**Decision**: Change `engines.node` from `>=24.0.0` to `>=20.0.0` in `docs/package.json`.

**Rationale**:
- Project README specifies Node.js 22
- CI workflow uses Node.js 24 but 20.x is the safer floor
- Current build warns about unsupported engine on Node 22
- No feature in the docs build requires Node > 20

**Alternatives considered**:
- Keep 24.x: unnecessarily restrictive, causes warnings
- Use 22.x: too tight, 20.x is the broadest safe floor

### 4. ADR format and location

**Decision**: Store ADRs as regular markdown files under `docs/{zh,en}/decisions/` with a structured template.

**ADR Template**:
```markdown
# ADR-NNN: Title
- Status: [Proposed | Accepted | Deprecated | Superseded]
- Date: YYYY-MM-DD
- Decision makers: ...

## Context
(What is the issue that we're seeing that is motivating this decision or change?)

## Decision
(What is the change that we're proposing and/or doing?)

## Consequences
(What becomes easier or more difficult to do because of this change?)

## Alternatives Considered
(What other options were evaluated?)
```

**Rationale**:
- ADRs in docs/ are discoverable by site visitors
- Standard ADR format is widely understood
- Bilingual ADRs serve both audiences
- Easier to maintain than a separate ADR directory outside docs

**Alternatives considered**:
- Separate `adr/` directory: fragments the documentation surface
- Only in OpenSpec: ADRs are user-facing, not just internal specs
- GitHub Discussions: not structured, not version-controlled

### 5. Information architecture: section-based, not page-based

**Decision**: Reorganize content into clear sections with consistent structure across zh/en:

```
/                          Homepage (technical overview)
/architecture/             Architecture deep-dive
  system                   System architecture (mermaid)
  data-flow                Data flow analysis
  modules                  Module responsibility map
  data-model               Database schema (mermaid ER)
/decisions/                Architecture Decision Records
  001-ws-auth              WebSocket authentication approach
  002-token-rotation       Token rotation strategy
  003-distributed-sync     Distributed message synchronization
/deep-dives/               Technical deep-dives
  performance/             Performance专题
  security/                Security专题
  scalability/             Scalability专题
/api/                      API reference
  rest                     REST API
  websocket                WebSocket protocol
/getting-started/          Quick start guide
/operations/               Operations guide
  deployment               Deployment architecture
  monitoring               Monitoring & observability
```

**Rationale**:
- Section-based structure supports deep content without flat-file clutter
- Clear separation between "how to run it" and "how it works"
- ADR and deep-dive sections are the key differentiators from a regular docs site

**Alternatives considered**:
- Keep flat structure: doesn't scale for deep content
- Use VitePress "sections" feature: adds complexity without clear benefit for this size

### 6. Remove `sharp` dependency

**Decision**: Remove `sharp` from `devDependencies` in `docs/package.json`.

**Rationale**:
- `sharp` is a native image processing library that adds build complexity
- Not used in the VitePress build pipeline
- The `optimize` script is not called in the standard build workflow
- Reduces install time and eliminates native dependency issues

### 7. Keep existing VitePress `cleanUrls: true`

**Decision**: Continue using clean URLs without trailing `.html`.

**Rationale**: Already configured and working. No reason to change.

## Risks / Trade-offs

- **[Mermaid build time]** → Mermaid diagrams render at build time; large diagrams may slow builds. Mitigate by keeping diagrams focused and not over-complex.
- **[Content volume]** → New sections add content that must be maintained. Mitigate by deriving ADRs and deep-dives from existing code/specs, not inventing new content.
- **[Bilingual sync]** → More content means more translation effort. Mitigate by writing zh-CN first, then en, and keeping technical content concise.
- **[Plugin compatibility]** → mermaid + llms plugins may conflict. Mitigate by testing build locally before merging.

## Migration Plan

1. Upgrade docs infrastructure (package.json, config, scripts)
2. Verify build succeeds with new dependencies
3. Redesign homepage
4. Restructure existing content into new information architecture
5. Create ADR documents
6. Create deep-dive sections
7. Convert ASCII diagrams to mermaid
8. Update CI workflow
9. Full build verification

**Rollback strategy**:
- All changes are in `docs/` and the workflow file — revertible by commit
- No database or runtime changes
