## ADDED Requirements

### Requirement: Verified Handoff Claims
Final handoff summaries SHALL distinguish verified repository state from upstream limitations or deferred work.

#### Scenario: Final status is documented
- **WHEN** the handoff surface claims a task is complete or a problem remains
- **THEN** the claim matches the current verified repository state and marks upstream-constrained items explicitly
