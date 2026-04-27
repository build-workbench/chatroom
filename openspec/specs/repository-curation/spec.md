# Repository Curation Specification

> **Status**: implemented
> **Created**: 2026-04-23
> **Updated**: 2026-04-23

## Purpose

Define how the repository presents itself through README, GitHub Pages, metadata, and curated historical surfaces.
## Requirements
### Requirement: Canonical Repository Surface
The repository SHALL maintain a clear, non-overlapping information architecture across root documentation, the docs site, OpenSpec artifacts, and release history.

#### Scenario: User lands on the repository root
- **WHEN** a reader opens `README.md`
- **THEN** the file presents project positioning, quick start, core architecture, and links to the docs site and OpenSpec without duplicating deep instructional material

#### Scenario: Contributor needs normative requirements
- **WHEN** a contributor needs authoritative requirements or change history
- **THEN** `openspec/` is the canonical source instead of root docs or ad hoc markdown files

### Requirement: Historical Artifact Minimization
The repository SHALL aggressively delete or consolidate low-signal historical changelog and release-note artifacts, preserving only the minimum history needed for release traceability and project comprehension.

#### Scenario: Low-value historical markdown is reviewed
- **WHEN** a detailed changelog or release-note file does not provide unique canonical value
- **THEN** it is removed or merged into a smaller canonical surface instead of being preserved as standalone history

#### Scenario: Release history must remain understandable
- **WHEN** historical cleanup removes detailed files
- **THEN** the remaining canonical release history still communicates meaningful project evolution

### Requirement: GitHub Presentation Alignment
The repository SHALL align GitHub About metadata, repository topics, and homepage URL with the project’s final documentation and teaching-oriented positioning.

#### Scenario: Repository metadata is configured
- **WHEN** the repository About section is updated
- **THEN** the description, topics, and homepage URL reinforce the project’s real-time chat, teaching, and OpenSpec-driven identity

#### Scenario: Docs site becomes the public landing page
- **WHEN** GitHub Pages is enabled for the repository
- **THEN** the repository homepage URL points to the final Pages site instead of remaining empty

### Requirement: Docs Landing Experience
The documentation site SHALL provide a distinct landing experience that introduces the project and guides readers deeper into the learning material.

#### Scenario: Reader opens the docs homepage
- **WHEN** a reader visits the GitHub Pages site
- **THEN** the landing page communicates why the project is interesting, what can be learned from it, and where to go next

#### Scenario: Docs content overlaps with README
- **WHEN** the docs site is reviewed for duplication
- **THEN** content is refactored so the site complements the repository entry point rather than mirroring it

### Requirement: Docs Navigation Truthfulness
The documentation site SHALL keep its learning paths, next-step links, and navigation aligned with pages and repository files that actually exist.

#### Scenario: Learner follows the docs navigation
- **WHEN** a reader uses docs-site sidebars, learning paths, or next-step sections
- **THEN** each referenced page or repository path exists and reflects a canonical surface rather than a stale or duplicated document

### Requirement: Redundant Design Narrative Removal
The documentation site SHALL remove overlapping design-narrative pages when architecture, deployment assets, and OpenSpec already cover the same ground more truthfully.

#### Scenario: Docs information architecture is reviewed
- **WHEN** a docs page duplicates architectural rationale without owning a unique canonical role
- **THEN** that page is removed or consolidated and its references are redirected to higher-signal surfaces

### Requirement: Canonical Handoff Status
The repository SHALL capture finalization status, deferred work, and next-step ordering in a canonical repository surface before handoff.

#### Scenario: Model handoff is prepared
- **WHEN** the repository is handed off to another model or maintainer
- **THEN** the canonical handoff surface records completed work, remaining tasks, and the recommended next action order

### Requirement: Finalization Program Documentation Boundaries
The repository SHALL execute archive finalization through a documented umbrella program that keeps README, docs, OpenSpec, and handoff artifacts as distinct canonical surfaces.

#### Scenario: Finalization tasks are organized
- **WHEN** contributors inspect the finalization program
- **THEN** the umbrella change defines which repository surfaces are canonical and delegates implementation details to focused child changes instead of duplicating guidance

#### Scenario: GLM handoff is prepared
- **WHEN** the repository is prepared for model handoff
- **THEN** the remaining tasks, deferred scope, and completion status are captured in canonical repository surfaces rather than only in transient chat context

