## MODIFIED Requirements

### Requirement: CI Test Integration
Verification SHALL run automatically in CI using the repository’s supported commands and SHALL remain proportional to the project’s archive-ready maintenance goals.

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

## ADDED Requirements

### Requirement: Repository Hygiene Verification
Archive-readiness changes SHALL verify repository hygiene concerns in addition to application behavior.

#### Scenario: Legacy path drift is checked
- **WHEN** repository guidance and docs are audited
- **THEN** stale references to deprecated structure such as legacy `/specs/` paths are removed or corrected

#### Scenario: Generated artifact drift is checked
- **WHEN** the repository is reviewed before merge
- **THEN** tracked transient outputs and broken automation references are removed or corrected

### Requirement: Closure Change Verification
Cross-cutting closure work SHALL validate the surfaces it changes instead of treating docs and configuration updates as inherently safe.

#### Scenario: Documentation or configuration changes are made
- **WHEN** a change touches workflows, docs, or repository guidance
- **THEN** the relevant builds, checks, or smoke validations are run for those surfaces

#### Scenario: Bug fixes are included in closure work
- **WHEN** a closure task modifies application code
- **THEN** the affected existing test suites are updated or executed so the fix is verified against the normalized specs
