# AI Collaboration Specification

> **Status**: implemented
> **Created**: 2026-04-23
> **Updated**: 2026-04-23

## Purpose

Define how AI coding tools are expected to collaborate in this repository.
## Requirements
### Requirement: OpenSpec-First Change Lifecycle
Repository-level development guidance SHALL direct non-trivial changes through an OpenSpec-first lifecycle using proposal, application, and archive steps.

#### Scenario: Contributor starts a substantial change
- **WHEN** a contributor plans a feature, refactor, or cross-cutting fix
- **THEN** the documented workflow directs them to create or continue an OpenSpec change before implementation

#### Scenario: Contributor completes a change
- **WHEN** implementation is finished
- **THEN** the workflow directs them to archive the completed change so active and historical workstreams remain clear

### Requirement: Project-Specific AI Instruction Surface
The repository SHALL maintain concise, project-specific AI guidance files that explain how OpenSpec, docs, workflows, and verification are expected to work in this codebase.

#### Scenario: An AI coding tool reads repository instructions
- **WHEN** it consults `AGENTS.md`, `CLAUDE.md`, or `copilot-instructions.md`
- **THEN** it receives repository-specific guidance rather than generic boilerplate repeated across files

#### Scenario: Instructions drift from repository reality
- **WHEN** guidance references outdated paths, workflows, or tools
- **THEN** the instructions are corrected or removed as part of normal repository maintenance

### Requirement: Reliable Hook Automation
Any repository-managed hooks or post-edit automation SHALL use portable, repository-valid commands and MUST NOT rely on broken machine-specific absolute paths.

#### Scenario: A formatting or post-edit hook runs
- **WHEN** the hook executes in this repository
- **THEN** it uses commands that resolve correctly from the repo context and can be maintained by future contributors

#### Scenario: A hook references machine-specific state
- **WHEN** a hook configuration depends on a non-portable absolute path or stale local environment assumption
- **THEN** that configuration is removed or replaced with a repository-valid alternative

### Requirement: Review and Subagent Workflow
The repository SHALL document when to use review flows and subagents so long-running cleanup work stays high-signal without encouraging branch drift or unnecessary `/fleet` usage.

#### Scenario: A change reaches a meaningful milestone
- **WHEN** a contributor is ready to validate cross-cutting work
- **THEN** the workflow recommends targeted review or subagent assistance at that milestone instead of constant parallelization

#### Scenario: A contributor chooses an execution mode
- **WHEN** the documented workflow compares interactive, autopilot, and fleet-style execution
- **THEN** it favors longer-running single-stream autopilot work for this repository unless there is clear parallel payoff

### Requirement: Instruction Surface Separation
The repository SHALL keep one canonical workflow guide and SHALL use tool-specific instruction files only for concise delta guidance.

#### Scenario: AI guidance files are reviewed
- **WHEN** `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` are compared
- **THEN** one file acts as the canonical workflow source and the others avoid repeating the same repository guidance at length

### Requirement: Explicit Hook Failures
Repository-managed AI hooks SHALL guard non-applicable cases cleanly but MUST NOT silently swallow real formatter or automation failures.

#### Scenario: Claude post-edit automation runs
- **WHEN** a repository-managed hook formats a supported file
- **THEN** the hook exits quietly when no action is needed and surfaces real formatting failures instead of masking them

### Requirement: Repo-Native AI Handoff
AI-assisted repository work SHALL leave handoff context inside the repository rather than relying on transient chat memory alone.

#### Scenario: An implementation session ends
- **WHEN** another model or collaborator may continue the work later
- **THEN** the repository contains enough status and sequencing context to resume without depending on the original session transcript

### Requirement: Umbrella Change Execution Model
Large finalization work SHALL use one umbrella OpenSpec change plus a small number of focused child changes so long-running autopilot execution remains coherent.

#### Scenario: A cross-cutting cleanup program is started
- **WHEN** the repository enters a finalization phase that spans docs, workflows, code, and tooling
- **THEN** one umbrella change owns the end-state rules and child changes own focused implementation scopes

#### Scenario: Long-running AI execution is guided
- **WHEN** an AI agent continues the finalization work across multiple sessions
- **THEN** the documented workflow favors single-stream autopilot progress with milestone reviews instead of speculative `/fleet` expansion

