## ADDED Requirements

### Requirement: Umbrella Change Execution Model
Large finalization work SHALL use one umbrella OpenSpec change plus a small number of focused child changes so long-running autopilot execution remains coherent.

#### Scenario: A cross-cutting cleanup program is started
- **WHEN** the repository enters a finalization phase that spans docs, workflows, code, and tooling
- **THEN** one umbrella change owns the end-state rules and child changes own focused implementation scopes

#### Scenario: Long-running AI execution is guided
- **WHEN** an AI agent continues the finalization work across multiple sessions
- **THEN** the documented workflow favors single-stream autopilot progress with milestone reviews instead of speculative `/fleet` expansion
