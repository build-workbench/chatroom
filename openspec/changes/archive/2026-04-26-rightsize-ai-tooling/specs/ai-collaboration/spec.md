## ADDED Requirements

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
