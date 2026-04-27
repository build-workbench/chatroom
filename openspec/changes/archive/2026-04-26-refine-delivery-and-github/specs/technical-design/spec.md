## ADDED Requirements

### Requirement: Anchored Workflow Tool Versions
Critical workflow tools SHALL use explicit versions when floating references would materially weaken reproducibility.

#### Scenario: CI installs repository-critical tooling
- **WHEN** the CI workflow configures lint or verification tools that can change behavior between releases
- **THEN** the workflow pins an explicit supported version instead of relying on `latest`
