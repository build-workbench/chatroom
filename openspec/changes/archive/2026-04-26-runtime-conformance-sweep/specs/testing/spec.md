## ADDED Requirements

### Requirement: Explicit Advisory Triage
Build-surface dependency advisories SHALL be triaged into safe repository fixes or explicit upstream constraints before finalization is considered complete.

#### Scenario: Dependency audit reports issues
- **WHEN** `npm --prefix docs audit` reports advisories for the docs toolchain
- **THEN** each issue is either fixed through a supported repository change or recorded as an upstream-constrained limitation with no safe local fix
