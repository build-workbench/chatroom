# Testing Specification

> **Status**: implemented
> **Created**: 2026-04-17
> **Updated**: 2026-04-23

This specification defines the testing and verification expectations for the ChatRoom repository.

---

## ADDED Requirements

### Requirement: Go Test Naming Conventions
Tests SHALL follow standard Go naming patterns and same-package conventions where the repository already uses them.

#### Scenario: Unit test naming
- **WHEN** a unit test is written
- **THEN** the function name follows `Test<Function>_<Scenario>_<Expected>` or an equivalent clear Go convention

#### Scenario: Integration test naming
- **WHEN** an integration test is written
- **THEN** the function name makes the tested feature and scenario explicit

#### Scenario: Test package naming
- **WHEN** a Go test file is created
- **THEN** its package naming follows the repository’s established same-package style unless there is a strong reason not to

---

### Requirement: Table-Driven Tests
Tests SHALL use table-driven patterns when multiple related cases are exercised against the same behavior.

#### Scenario: Multiple cases exist
- **WHEN** a function has several meaningful input and edge-case combinations
- **THEN** a table-driven test structure is used with named cases and subtests

---

### Requirement: Authentication Tests
Authentication flows SHALL be covered by tests for the repository’s supported login and token behavior.

#### Scenario: Valid registration is tested
- **WHEN** registration with valid credentials is exercised
- **THEN** the test verifies success and persisted user state

#### Scenario: Duplicate username is tested
- **WHEN** registration with an existing username is exercised
- **THEN** the test verifies a conflict response

#### Scenario: Valid login is tested
- **WHEN** login with correct credentials is exercised
- **THEN** the test verifies successful token issuance

#### Scenario: Token refresh is tested
- **WHEN** a valid refresh flow is exercised
- **THEN** the test verifies issuance of a new access token

---

### Requirement: WebSocket Tests
WebSocket functionality SHALL be covered for core room and message scenarios.

#### Scenario: Connection test
- **WHEN** a valid WebSocket connection is established
- **THEN** the test verifies the connection succeeds

#### Scenario: Broadcast test
- **WHEN** a message is sent to a room
- **THEN** all connected room members receive the broadcast

#### Scenario: Room isolation test
- **WHEN** a message is sent in one room
- **THEN** members of a different room do not receive it

---

### Requirement: HTTP API Tests
Core HTTP endpoints SHALL be covered through the existing backend test suite.

#### Scenario: Health endpoint test
- **WHEN** `/health` is exercised
- **THEN** the test verifies a successful liveness response

#### Scenario: Room creation test
- **WHEN** the authenticated room creation flow is exercised
- **THEN** the test verifies the expected success response

---

### Requirement: CI Test Integration
Verification SHALL run automatically in CI using the repository’s supported commands and SHALL remain proportional to the project’s maintenance goals.

#### Scenario: Go verification in CI
- **WHEN** the primary verification workflow runs
- **THEN** it executes the supported Go test command against the backend with the required services configured

#### Scenario: Frontend verification in CI
- **WHEN** the primary verification workflow runs
- **THEN** it executes the supported frontend test, lint, and build steps used by contributors locally

#### Scenario: Documentation verification in CI
- **WHEN** documentation or presentation surfaces are changed
- **THEN** the docs site build runs as part of the relevant workflow before deployment

#### Scenario: Workflow signal is evaluated
- **WHEN** a verification job does not materially protect correctness, maintainability, or release readiness
- **THEN** it is removed or downgraded instead of remaining in the required CI path

---

### Requirement: Repository Hygiene Verification
Repository-level cleanup work SHALL verify repository hygiene concerns in addition to application behavior.

#### Scenario: Legacy path drift is checked
- **WHEN** repository guidance and docs are audited
- **THEN** stale references to deprecated structures are removed or corrected

#### Scenario: Generated artifact drift is checked
- **WHEN** the repository is reviewed before merge
- **THEN** tracked transient outputs and broken automation references are removed or corrected

---

### Requirement: Closure Change Verification
Cross-cutting cleanup SHALL validate the surfaces it changes instead of treating docs and configuration updates as inherently safe.

#### Scenario: Documentation or configuration changes are made
- **WHEN** a change touches workflows, docs, or repository guidance
- **THEN** the relevant builds, checks, or smoke validations are run for those surfaces

#### Scenario: Bug fixes are included in cleanup work
- **WHEN** cleanup tasks modify application code
- **THEN** the affected existing test suites are updated or executed so the fix is verified

---

## Change History

| Date | Change |
|------|--------|
| 2026-04-17 | Initial testing specification created |
| 2026-04-23 | Simplified verification expectations for repository hygiene and cross-cutting cleanup |
