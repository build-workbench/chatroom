## Why

ChatRoom already preserves the right delivery surfaces, but parts of the GitHub automation and metadata still lean toward "works" rather than "final and intentional." For an archive-ready repository, workflow inputs should be version-anchored, dependency PR volume should stay proportional, and GitHub About metadata should match the final project story deliberately rather than by accident.

## What Changes

- Pin critical workflow tool versions where the repository currently uses floating references that weaken reproducibility.
- Reduce Dependabot churn so update volume matches the repository's low-touch end state.
- Review and update GitHub About metadata through `gh` so description, homepage, and topics stay tightly aligned with the final teaching-oriented positioning.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `technical-design`: Tighten requirements for anchored workflow tool versions and proportional automation.
- `open-source-standards`: Tighten requirements for curated GitHub About metadata and community-facing release truthfulness.

## Impact

- `.github/workflows/ci.yml`
- `.github/dependabot.yml`
- GitHub repository metadata managed through `gh`
- `openspec/specs/technical-design/spec.md`
- `openspec/specs/open-source-standards/spec.md`
