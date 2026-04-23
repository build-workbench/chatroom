## MODIFIED Requirements

### Requirement: Project Directory Structure
The project SHALL organize source, specifications, documentation, and generated outputs so that the canonical repository structure is explicit and free of legacy path drift.

#### Scenario: Backend code location
- **WHEN** a developer needs to find backend code
- **THEN** all private application code is located in `internal/` and entrypoints remain under `cmd/`

#### Scenario: Specification location
- **WHEN** a developer needs to find project specifications or active changes
- **THEN** canonical requirements are in `openspec/specs/` and active changes are in `openspec/changes/`, with no tracked repository guidance relying on legacy `/specs/` paths

#### Scenario: Generated repository outputs
- **WHEN** build, test, or editor-generated artifacts are produced
- **THEN** they are excluded from the canonical source structure unless intentionally documented as tracked release assets

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
