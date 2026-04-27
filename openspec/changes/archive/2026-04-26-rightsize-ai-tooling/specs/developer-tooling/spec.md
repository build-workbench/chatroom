## ADDED Requirements

### Requirement: AI Scratch Artifact Hygiene
Transient AI session artifacts SHALL be ignored from version control unless the repository explicitly promotes them to canonical documentation.

#### Scenario: AI tools create working state directories
- **WHEN** local brainstorming or session tools produce scratch directories such as `.superpowers/`
- **THEN** those directories are ignored from version control by default unless the project intentionally tracks a documented subset

### Requirement: Minimal Repo-Local Skill Set
Repo-local AI skill directories SHALL be limited to the workflows the repository intentionally supports by default.

#### Scenario: Repo-local Claude skills are reviewed
- **WHEN** `.claude/skills/` is audited during finalization
- **THEN** generic or redundant skill packs that do not directly support the default OpenSpec or verification workflow are removed
