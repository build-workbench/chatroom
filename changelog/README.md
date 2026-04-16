# Changelog Index

This directory contains detailed change records for the project. The main [CHANGELOG.md](../CHANGELOG.md) provides version summaries, while this directory offers detailed explanations for each refactoring.

---

## Change Index

### 2025 Q4

| Date | File | Subject | Type |
|------|------|---------|------|
| 2025-11-23 | [frontend-refactor](2025-11-23_frontend_refactor.md) | Frontend Refactoring & Optimization | ♻️ Refactor |
| 2025-11-25 | [modern-im-upgrade](2025-11-25_modern_im_upgrade.md) | Modern IM Upgrade | ✨ Feature |
| 2025-12-15 | [react-migration](2025-12-15_react_migration.md) | React Migration & Backend Security | ♻️ Refactor |

### 2026 Q1

| Date | File | Subject | Type |
|------|------|---------|------|
| 2026-02-13 | [code-optimization](2026-02-13_code_optimization.md) | Code Optimization | ⚡ Performance |
| 2026-02-13 | [optimization-round2](2026-02-13_optimization_round2.md) | Optimization Round 2 | ⚡ Performance |
| 2026-03-06 | [teaching-release-alignment](2026-03-06_teaching_release_alignment.md) | Teaching & Release Alignment | 📝 Documentation |
| 2026-03-08 | [comprehensive-refactor](2026-03-08_comprehensive_refactor.md) | Comprehensive Code Refactor | ♻️ Refactor |
| 2026-03-10 | [pages-optimization](2026-03-10_pages-optimization.md) | GitHub Pages Optimization | 🚀 Deployment |
| 2026-03-10 | [workflow-deep-standardization](2026-03-10_workflow-deep-standardization.md) | Workflow Deep Standardization | 🔧 CI/CD |
| 2026-03-13 | [release-readiness-hardening](2026-03-13_release_readiness_hardening.md) | Release Readiness & Security Hardening | 🔒 Security |
| 2026-03-22 | [readme-docs-workflow-alignment](2026-03-22_readme-docs-workflow-alignment.md) | README, Docs & Workflow Alignment | 📝 Documentation |
| 2026-04-16 | [docs-internationalization](2026-04-16_docs-internationalization.md) | Documentation Internationalization | 📝 Documentation |

---

## Change Type Legend

| Icon | Type | Description |
|------|------|-------------|
| ✨ | Feature | New feature added |
| ♻️ | Refactor | Code refactoring |
| 🔒 | Security | Security-related improvements |
| ⚡ | Performance | Performance optimization |
| 📝 | Documentation | Documentation updates |
| 🔧 | CI/CD | CI/CD configuration updates |
| 🚀 | Deployment | Deployment-related improvements |
| 🐛 | Bug Fix | Bug fixes |

---

## Version Milestones

### v0.3.0 (2026-04-16)

**Documentation Internationalization**

- Complete bilingual (EN/ZH) documentation site
- Professional API documentation in both languages
- Comprehensive architecture and design guides
- Standardized changelog format

**Related Changes**:
- 2026-04-16: Documentation Internationalization

### v0.2.0 (2026-03-08)

**Open Source Standards & Engineering**

- Open source standard files (LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY)
- CI/CD pipelines (GitHub Actions)
- VitePress documentation site
- Docker multi-stage builds
- Kubernetes deployment manifests
- Health check endpoints
- Security hardening (CORS, JWT validation)

**Related Changes**:
- 2026-03-06: Teaching & Release Alignment
- 2026-03-08: Comprehensive Refactor
- 2026-03-10: Workflow Standardization
- 2026-03-13: Security Hardening
- 2026-03-22: Documentation Alignment

### v0.1.0 (2025-01-08)

**Initial Release**

- User registration and login (JWT authentication)
- Chat room creation and management
- WebSocket real-time messaging
- PostgreSQL message persistence
- React frontend

**Related Changes**:
- 2025-11-23: Frontend Refactoring
- 2025-11-25: IM Feature Upgrade
- 2025-12-15: React Migration
- 2026-02-13: Code Optimization

---

## Change Statistics

### By Module

| Module | Count |
|--------|-------|
| Backend | 6 |
| Frontend | 5 |
| CI/CD | 3 |
| Documentation | 5 |
| Deployment | 2 |

### By Impact Scope

| Scope | Count |
|-------|-------|
| Architecture Refactor | 3 |
| Security Hardening | 2 |
| Performance Optimization | 2 |
| Engineering | 3 |
| Feature Addition | 2 |

---

## Contributing Guidelines

When adding new changelog entries:

### File Naming

```
YYYY-MM-DD_short-description.md
```

### Content Template

```markdown
# [English Title]

**Date**: YYYY-MM-DD

## Summary

One-sentence description of the change objective.

## Changes

### Added
- New feature description

### Changed
- Changed behavior description

### Fixed
- Bug fix description

### Security
- Security improvement description

## Impact

- Affected modules or features
- Database migration required
- Configuration changes required

## Testing

- Verification steps and results

## References

- Refs #123
- PR #456
```

### Notes

1. Use English for the title and commit descriptions
2. Use ISO date format (YYYY-MM-DD)
3. Use kebab-case for short description
4. Reference related Issue/PR numbers
5. Include both English and Chinese descriptions where appropriate
