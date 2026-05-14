## Phase 1: Infrastructure Upgrade

- [x] 1.1 Update `docs/package.json`:
  - Change `engines.node` from `>=24.0.0` to `>=20.0.0`
  - Add `vitepress-plugin-mermaid` to dependencies
  - Add `vitepress-plugin-llms` to dependencies
  - Add `mermaid` to dependencies
  - Remove `sharp` from devDependencies
  - Add `sync-changelog` script
- [x] 1.2 Create `docs/scripts/sync-changelog.mjs` to sync CHANGELOG.md to docs
- [x] 1.3 Update `docs/.vitepress/config.mts`:
  - Wrap config with `withMermaid()`
  - Add `llmstxt()` vite plugin
  - Update build script references
- [x] 1.4 Run `npm ci && npm run docs:build` to verify build succeeds
- [x] 1.5 Update `.github/workflows/pages.yml`:
  - Add changelog sync step before build
  - Ensure Node.js 20.x is used

## Phase 2: Homepage Redesign

- [x] 2.1 Redesign `docs/index.md` as technical overview homepage:
  - Hero section with project name and tagline
  - Technical highlights section (JWT+Token Rotation, WebSocket Ticket, Distributed Sync, etc.)
  - Tech stack table
  - Architecture preview (mermaid diagram)
  - Navigation to deep sections
- [x] 2.2 Redesign `docs/zh/index.md` (Chinese version of above)
- [x] 2.3 Redesign `docs/en/index.md` (English version of above)

## Phase 3: Information Architecture Restructure

- [x] 3.1 Create new directory structure:
  - `docs/zh/architecture/`
  - `docs/zh/decisions/`
  - `docs/zh/deep-dives/performance/`
  - `docs/zh/deep-dives/security/`
  - `docs/zh/deep-dives/scalability/`
  - Mirror structure for `docs/en/`
- [x] 3.2 Move existing content to new locations:
  - `docs/zh/architecture.md` → `docs/zh/architecture/system.md`
  - `docs/zh/api.md` → `docs/zh/api/rest.md`
- [x] 3.3 Update sidebar configuration in config.mts for new structure

## Phase 4: ADR Documents

- [x] 4.1 Create `docs/zh/decisions/001-ws-auth.md`:
  - Context: WebSocket handshake cannot carry Authorization header
  - Decision: One-time Ticket via WebSocket Subprotocol
  - Consequences: pros/cons
  - Alternatives: URL param, Cookie, direct token in subprotocol
- [x] 4.2 Create `docs/zh/decisions/002-token-rotation.md`:
  - Context: Long-lived tokens are a security risk
  - Decision: Short-lived access token + long-lived refresh token with rotation
  - Consequences: pros/cons
  - Alternatives: Single long-lived token, session-based auth
- [x] 4.3 Create `docs/zh/decisions/003-distributed-sync.md`:
  - Context: Multi-instance WebSocket needs cross-instance message sync
  - Decision: PostgreSQL LISTEN/NOTIFY
  - Consequences: pros/cons
  - Alternatives: Redis pub/sub, dedicated message broker
- [x] 4.4 Create English versions of all ADRs in `docs/en/decisions/`

## Phase 5: Deep-Dive Sections

- [x] 5.1 Create `docs/zh/deep-dives/performance/benchmarks.md`:
  - Test environment specification
  - HTTP API benchmarks (RPS, latency percentiles)
  - WebSocket performance (max connections, throughput)
  - Database connection pool configuration
- [x] 5.2 Create `docs/zh/deep-dives/security/threat-model.md`:
  - Trust boundary diagram (mermaid)
  - Threat/mitigation table
  - OWASP Top 10 checklist
- [x] 5.3 Create `docs/zh/deep-dives/security/auth-deep-dive.md`:
  - JWT structure and validation flow
  - Token lifecycle diagram (mermaid)
  - WebSocket Ticket flow diagram (mermaid)
- [x] 5.4 Create `docs/zh/deep-dives/scalability/horizontal.md`:
  - Multi-instance deployment architecture (mermaid)
  - Session persistence design
  - Sticky sessions considerations
- [x] 5.5 Create English versions of all deep-dives in `docs/en/deep-dives/`

## Phase 6: Mermaid Diagram Conversion

- [x] 6.1 Convert architecture diagrams in `docs/zh/architecture/system.md` to mermaid
- [x] 6.2 Create `docs/zh/architecture/data-flow.md` with mermaid sequence diagrams
- [x] 6.3 Create `docs/zh/architecture/data-model.md` with mermaid ER diagram
- [x] 6.4 Convert all ASCII diagrams in existing docs to mermaid
- [x] 6.5 Create English versions of all new architecture pages

## Phase 7: Navigation and Polish

- [x] 7.1 Update nav bar in config.mts for new structure
- [x] 7.2 Create index pages for each section (`decisions/index.md`, etc.)
- [x] 7.3 Add cross-links between related pages
- [x] 7.4 Verify all internal links resolve
- [x] 7.5 Final build verification: `npm run docs:build`

## Phase 8: CI and Deployment

- [x] 8.1 Verify GitHub Actions workflow runs successfully
- [ ] 8.2 Test docs preview deployment
- [ ] 8.3 Merge and verify production deployment