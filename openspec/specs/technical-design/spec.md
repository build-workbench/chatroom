# Technical Design Specification

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-23

## Purpose

Define the repository's architectural and engineering baseline, including code layout, workflows, frontend expectations, security, and observability.
## Requirements
### Requirement: Core Architecture
The system SHALL follow a layered architecture with a Go backend, a React frontend, and PostgreSQL persistence.

#### Scenario: HTTP request processing
- **WHEN** a client sends an HTTP request
- **THEN** the request flows through router, middleware, handler, service, and database layers

#### Scenario: WebSocket message broadcasting
- **WHEN** a user sends a message via WebSocket
- **THEN** the message is persisted and broadcast to the appropriate room members

#### Scenario: Authentication flow
- **WHEN** a user submits valid credentials to the login endpoint
- **THEN** the system returns JWT access and refresh tokens

---

### Requirement: Project Directory Structure
The project SHALL organize source, specifications, documentation, and generated outputs so that the canonical repository structure is explicit and free of legacy path drift.

#### Scenario: Backend code location
- **WHEN** a developer needs to find backend code
- **THEN** private application code is located in `internal/` and entrypoints remain under `cmd/`

#### Scenario: Specification location
- **WHEN** a developer needs to find project specifications or active changes
- **THEN** canonical requirements are in `openspec/specs/` and active changes are in `openspec/changes/`, with no tracked repository guidance relying on legacy `/specs/` paths

#### Scenario: Generated repository outputs
- **WHEN** build, test, or editor-generated artifacts are produced
- **THEN** they are excluded from the canonical source structure unless intentionally documented as tracked release assets

---

### Requirement: CI/CD Pipeline
The system SHALL automate verification, documentation publishing, and release creation through a simplified GitHub Actions design aligned with the supported toolchain.

#### Scenario: Push to master branch
- **WHEN** code is pushed to `master`
- **THEN** the primary CI workflow runs the supported verification steps needed to protect repository quality

#### Scenario: Documentation publishing
- **WHEN** docs or repository presentation surfaces change
- **THEN** the docs workflow builds and deploys the GitHub Pages site that represents the canonical public documentation experience

#### Scenario: Automation toolchain alignment
- **WHEN** workflows install dependencies or invoke builds
- **THEN** they use the documented package-manager and runtime choices instead of mixing conflicting toolchain expectations

---

### Requirement: Frontend Engineering Standards
The frontend SHALL use TypeScript with strict mode and the modern Vite toolchain already adopted by the repository.

#### Scenario: TypeScript strict mode
- **WHEN** TypeScript code is compiled
- **THEN** strict validation passes without errors

#### Scenario: Vite dev proxy
- **WHEN** the frontend dev server receives requests to `/api` or `/ws`
- **THEN** those requests are proxied to the Go backend at `localhost:8080`

#### Scenario: Tailwind CSS v4 integration
- **WHEN** frontend styles are processed
- **THEN** the repository uses `@tailwindcss/vite` rather than a PostCSS Tailwind setup

---

### Requirement: Security Standards
The system SHALL implement security-first design around authentication and network exposure.

#### Scenario: Password hashing
- **WHEN** a user registers or changes password
- **THEN** the password is hashed with bcrypt

#### Scenario: Token lifetime
- **WHEN** tokens are generated
- **THEN** access tokens and refresh tokens use the configured expiration windows

#### Scenario: Production JWT validation
- **WHEN** the application starts outside `dev` with the default JWT secret
- **THEN** startup fails with an explicit error

#### Scenario: CORS policy
- **WHEN** a cross-origin request is received
- **THEN** only configured origins are permitted

---

### Requirement: Observability
The system SHALL expose health and monitoring surfaces suitable for learning and operational verification.

#### Scenario: Metrics endpoint
- **WHEN** `/metrics` is accessed
- **THEN** Prometheus-formatted metrics are returned

#### Scenario: Structured logging
- **WHEN** an event is logged
- **THEN** the output respects the configured log format

#### Scenario: Health and readiness endpoints
- **WHEN** `/health` or `/ready` is accessed
- **THEN** the application reports liveness and readiness according to the current runtime state

---

### Requirement: Clean Documentation Build Surface
The documentation build SHALL complete without repository-caused language-highlighting warnings or similarly avoidable content-layer noise.

#### Scenario: Documentation build runs
- **WHEN** `npm --prefix docs run docs:build` is executed
- **THEN** unsupported repository-authored code-fence language tags do not generate warnings during the build

### Requirement: Anchored Workflow Tool Versions
Critical workflow tools SHALL use explicit versions when floating references would materially weaken reproducibility.

#### Scenario: CI installs repository-critical tooling
- **WHEN** the CI workflow configures lint or verification tools that can change behavior between releases
- **THEN** the workflow pins an explicit supported version instead of relying on `latest`

### Requirement: Finalization Program Sequencing
The project SHALL execute archive finalization through an ordered sequence of child changes that respects governance-first dependencies.

#### Scenario: Child changes are defined
- **WHEN** the umbrella finalization program is created
- **THEN** it defines focused child changes for governance/docs, runtime conformance, delivery/GitHub alignment, AI/tooling right-sizing, and final handoff

#### Scenario: Execution order is reviewed
- **WHEN** contributors decide what to implement next
- **THEN** governance and documentation constraints are completed before downstream delivery and handoff work that depends on them

### Requirement: Full Delivery Surface Preservation
The project SHALL preserve its documented public delivery surfaces while simplifying only the supporting workflow and configuration noise.

#### Scenario: Release automation is simplified
- **WHEN** workflows and packaging are refactored during finalization
- **THEN** GitHub Releases, supported binary bundles, Docker images, and GitHub Pages remain documented repository outputs unless explicitly deprecated through OpenSpec

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial technical design documented |
| 2026-04-23 | Simplified structure and CI rules to match the normalized repository |
