# README, Docs & Workflow Alignment

**Date**: 2026-03-22

## Summary

Alignment of README, documentation, and workflow configurations to current code reality.

## Changes

### Documentation
- **README Restructure**: Rewrote `README.md` as stable English entry page highlighting project positioning, runtime modes, minimal startup, and documentation links
- **Chinese README**: Refactored `README.zh-CN.md` with clear teaching positioning, runtime mode matrix, core capabilities, verification checklist
- **Getting Started**: Updated `docs/getting-started.md` with corrected `.env` behavior documentation
- **FAQ Updates**: Updated `docs/FAQ.md` GitHub Pages description from future tense to current facts

### Configuration Corrections
- Corrected misleading `.env` references across root README, Chinese README, `docs/getting-started.md`, and `.env.example`
- Clarified that service reads process environment variables, `go run ./cmd/server` doesn't auto-load `.env`
- Added `ALLOWED_ORIGINS` documentation with purpose, format rules, and production notes

### Workflow Alignment
- Updated `docs/.vitepress/config.mts` edit links from `main` to `master`
- Added canonical / Open Graph / Twitter meta information
- Updated `.github/workflows/pages.yml` to monitor `master` branch and include `README.zh-CN.md` triggers
- Aligned `.github/workflows/ci.yml` and `.github/workflows/security.yml` branch configs to `refs/heads/master`

## Impact

- **Consistency**: All entry documents unified with code reality
- **Clarity**: Reduced future documentation drift risk
- **Accuracy**: Configuration documentation matches actual behavior

## Testing

- Verified documentation accuracy
- Confirmed workflow trigger alignment

## References

- Documentation alignment requirements
- GitHub workflow best practices
