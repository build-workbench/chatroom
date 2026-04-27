# Developer Tooling Specification

> **Status**: implemented
> **Created**: 2026-04-23
> **Updated**: 2026-04-23

## Purpose

Define the supported local tooling baseline for contributors and AI-assisted workflows.
## Requirements
### Requirement: Toolchain Consistency
The repository SHALL declare one coherent toolchain and package-manager story across documentation, scripts, and GitHub workflows.

#### Scenario: A contributor follows setup instructions
- **WHEN** they read the repository docs and workflow configuration
- **THEN** the commands, package-manager choice, and supported runtime versions are consistent instead of conflicting

#### Scenario: CI uses a project toolchain
- **WHEN** GitHub Actions installs dependencies or runs builds
- **THEN** it uses the same package-manager and runtime expectations documented for contributors unless an explicit exception is documented

### Requirement: Supported LSP Baseline
The repository SHALL document a minimal high-value language tooling baseline for supported development environments.

#### Scenario: Go development tooling is documented
- **WHEN** a contributor sets up editor support for backend work
- **THEN** `gopls` is included in the recommended baseline

#### Scenario: Frontend development tooling is documented
- **WHEN** a contributor sets up editor support for TypeScript and React work
- **THEN** the documented baseline includes the TypeScript language service and ESLint-aware diagnostics

### Requirement: Minimal MCP and Plugin Policy
The repository SHALL prefer a minimal context-efficient tool integration strategy and MUST justify any additional MCP or plugin surface by concrete recurring value.

#### Scenario: A new MCP or plugin is proposed
- **WHEN** the integration is evaluated
- **THEN** the documented policy compares its maintenance and context cost against simpler native CLI, skill, or subagent workflows

#### Scenario: No strong justification exists
- **WHEN** an MCP or plugin does not materially improve this repository’s workflow
- **THEN** it is not adopted as part of the default project setup

### Requirement: Generated Artifact Hygiene
Generated and transient outputs SHALL NOT remain tracked in version control unless they are intentional release assets with documented purpose.

#### Scenario: A transient tool output appears in the repository
- **WHEN** the output is build, test, cache, or editor-generated state
- **THEN** it is ignored or removed from version control rather than preserved as normal source content

#### Scenario: A generated artifact must remain tracked
- **WHEN** a generated file is intentionally committed
- **THEN** its purpose and regeneration path are documented in the repository guidance

### Requirement: Docs Toolchain Hygiene
The repository SHALL keep the documentation toolchain free of avoidable warning noise and SHALL apply safe patch-level dependency hygiene updates when they fit the supported version ranges.

#### Scenario: Docs dependencies are reviewed
- **WHEN** the docs dependency tree contains an advisory that can be fixed with a supported patch-level update
- **THEN** the repository applies that update instead of leaving the warning unexplained

#### Scenario: Docs build configuration is reviewed
- **WHEN** build warnings are caused by repository-controlled content or configuration
- **THEN** the warning source is corrected in-repo rather than tolerated as permanent noise

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

### Requirement: Final Tooling Rationalization
The repository SHALL make explicit keep-or-remove decisions for AI/tooling surfaces before archive finalization is considered complete.

#### Scenario: AI and editor tooling is reviewed
- **WHEN** `.claude` assets, Copilot instructions, plugin posture, and LSP guidance are audited
- **THEN** each retained surface has a clear repository-specific purpose and low-value or redundant tooling is removed or consolidated

#### Scenario: Minimal integration policy is enforced
- **WHEN** a new MCP, plugin, or tool-specific integration is considered during finalization
- **THEN** it is rejected unless it has clear recurring value that outweighs its maintenance and context cost

