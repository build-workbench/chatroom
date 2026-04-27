## ADDED Requirements

### Requirement: Finalization Program Documentation Boundaries
The repository SHALL execute archive finalization through a documented umbrella program that keeps README, docs, OpenSpec, and handoff artifacts as distinct canonical surfaces.

#### Scenario: Finalization tasks are organized
- **WHEN** contributors inspect the finalization program
- **THEN** the umbrella change defines which repository surfaces are canonical and delegates implementation details to focused child changes instead of duplicating guidance

#### Scenario: GLM handoff is prepared
- **WHEN** the repository is prepared for model handoff
- **THEN** the remaining tasks, deferred scope, and completion status are captured in canonical repository surfaces rather than only in transient chat context
