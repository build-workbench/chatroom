## ADDED Requirements

### Requirement: Finalization Program Verification
The repository SHALL verify finalization work across code, docs, workflows, and handoff surfaces before declaring the program complete.

#### Scenario: Cross-surface finalization work is completed
- **WHEN** the finalization program changes repository guidance, workflows, runtime code, or docs
- **THEN** the relevant existing verification commands are run for each touched surface and the resulting repository story remains internally consistent

#### Scenario: Handoff readiness is evaluated
- **WHEN** the repository is prepared for GLM takeover or immediate archival
- **THEN** the program records what is complete, what is deferred, and which canonical sources describe the final state
