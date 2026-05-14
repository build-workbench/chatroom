## Why

The current docs site functions as a basic "getting started" guide, but the project's technical depth deserves more. ChatRoom is a teaching-oriented real-time chat application with sophisticated features like JWT Token Rotation, WebSocket Ticket authentication, distributed sync via Postgres NOTIFY, and OpenSpec-driven development. These deserve a "technical whitepaper / architecture showcase" presentation that helps readers understand not just *how* to use the system, but *why* design decisions were made.

This redesign transforms the docs from a product manual into a technical reference that:
- Attracts technical decision-makers as a reference implementation
- Demonstrates engineering maturity through ADRs, performance reports, and security analysis
- Provides deep technical content for advanced learners
- Leverages modern docs tooling (mermaid, vitepress-plugin-llms)

## What Changes

- Upgrade VitePress infrastructure: add mermaid support, vitepress-plugin-llms, changelog sync script
- Lower Node.js requirement from 24.x to 20.x to align with project README and CI
- Redesign homepage as a "technical overview" rather than product landing page
- Create new information architecture with deep-dive sections:
  - `/architecture/` - Interactive architecture diagrams (mermaid)
  - `/decisions/` - Architecture Decision Records (ADR)
  - `/deep-dives/` - Performance, security, scalability deep dives
- Convert ASCII architecture diagrams to interactive mermaid diagrams
- Add performance benchmark reports with concrete metrics
- Add security threat model documentation
- Create ADR documents for key design decisions (WebSocket auth, Token Rotation, distributed sync)
- Update GitHub Actions workflow for new build requirements

## Capabilities

### Modified Capabilities

- `technical-design`: Extend to include documentation of design rationale and trade-offs through ADRs
- `api`: Add OpenAPI specification section to docs site for better API discoverability

### New Documentation Sections

- `/architecture/` - System architecture, data flow, module boundaries
- `/decisions/` - ADR-001 (WebSocket Auth), ADR-002 (Token Rotation), ADR-003 (Distributed Sync)
- `/deep-dives/performance/` - Benchmarks, connection pooling, WebSocket tuning
- `/deep-dives/security/` - Threat model, auth deep dive, OWASP checklist
- `/deep-dives/scalability/` - Horizontal scaling design, extension points

## Impact

- **Docs infrastructure**: `docs/package.json`, `docs/.vitepress/config.mts`, new scripts
- **Homepage**: `docs/index.md`, `docs/zh/index.md`, `docs/en/index.md`
- **New sections**: `docs/zh/architecture/`, `docs/zh/decisions/`, `docs/zh/deep-dives/`
- **Existing content**: Restructure into new information architecture
- **CI workflow**: `.github/workflows/pages.yml` for changelog sync and new dependencies
- **Public assets**: `docs/public/` for any new diagrams/images
