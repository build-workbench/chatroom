## ADDED Requirements

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
