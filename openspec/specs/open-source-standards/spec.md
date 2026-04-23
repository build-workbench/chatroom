# Open Source Standards Specification

> **Status**: implemented
> **Created**: 2026-03-08
> **Updated**: 2026-04-23

This specification defines the repository standards for public documentation, workflows, release history, and contributor-facing project hygiene.

---

## ADDED Requirements

### Requirement: Standard Project Files
The repository SHALL contain a compact set of high-signal project files that match the project’s actual teaching-oriented workflow.

#### Scenario: Standard repository documents are reviewed
- **WHEN** the repository root and `.github/` directory are examined
- **THEN** only documents and templates with clear ongoing value are preserved as canonical guidance

#### Scenario: Changelog policy is evaluated
- **WHEN** release history files are reviewed
- **THEN** `CHANGELOG.md` remains the canonical release history surface and redundant detail-heavy historical files are removed or consolidated unless they provide unique value

#### Scenario: AI instruction files are evaluated
- **WHEN** repository guidance for coding agents is examined
- **THEN** the canonical instruction files are present, project-specific, and aligned with the current OpenSpec workflow

---

### Requirement: Project Documentation
The project SHALL provide purposeful documentation with explicit boundaries between repository entry content, guided docs-site content, and normative OpenSpec artifacts.

#### Scenario: Repository overview is reviewed
- **WHEN** `README.md` is viewed
- **THEN** it explains positioning, quick start, architecture snapshot, and canonical links without duplicating deep tutorial content

#### Scenario: Documentation site is accessed
- **WHEN** the GitHub Pages site is opened
- **THEN** it provides a distinct landing experience and structured learning path rather than acting as a plain README mirror

#### Scenario: Normative requirements are needed
- **WHEN** a contributor needs authoritative behavior or process requirements
- **THEN** the documentation points them to `openspec/` instead of duplicating requirement details in general-purpose docs

---

### Requirement: CI/CD Pipeline
The project SHALL keep a small set of high-signal GitHub Actions workflows for verification, documentation publishing, release handling, and essential maintenance automation.

#### Scenario: Code is pushed or a pull request is opened
- **WHEN** the primary CI workflow runs
- **THEN** it executes the repository’s supported verification steps without redundant or low-value jobs

#### Scenario: Documentation is published
- **WHEN** the docs publishing workflow runs
- **THEN** it builds and deploys the canonical docs site that matches the repository’s public homepage positioning

#### Scenario: Repository automation is reviewed
- **WHEN** workflows and automation config are audited
- **THEN** jobs that do not materially improve quality, release readiness, or maintainability are removed or simplified

---

### Requirement: Version Management
The repository SHALL follow semantic versioning and keep release history concise and understandable.

#### Scenario: Version tag is created
- **WHEN** a release is created
- **THEN** the version tag follows `vMAJOR.MINOR.PATCH`

#### Scenario: Release history is reviewed
- **WHEN** someone needs to understand project evolution
- **THEN** the main release milestones are available in `CHANGELOG.md` without requiring a second detailed changelog system

#### Scenario: Release assets are published
- **WHEN** a release is created
- **THEN** the release workflow produces the documented deliverables for supported platforms

---

## Change History

| Date | Change |
|------|--------|
| 2026-03-08 | Initial requirements documented |
| 2026-04-23 | Simplified standards around docs, workflows, and release history |
