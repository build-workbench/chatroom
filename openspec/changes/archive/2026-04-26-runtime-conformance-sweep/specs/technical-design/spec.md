## ADDED Requirements

### Requirement: Clean Documentation Build Surface
The documentation build SHALL complete without repository-caused language-highlighting warnings or similarly avoidable content-layer noise.

#### Scenario: Documentation build runs
- **WHEN** `npm --prefix docs run docs:build` is executed
- **THEN** unsupported repository-authored code-fence language tags do not generate warnings during the build
