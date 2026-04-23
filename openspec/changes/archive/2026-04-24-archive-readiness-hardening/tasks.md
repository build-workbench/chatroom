## 1. Baseline Audit and Scope Control

- [x] 1.1 Inventory current drift across `openspec/`, root docs, workflow files, AI guidance, GitHub metadata, and tracked generated artifacts
- [x] 1.2 Audit the former `add-mentions` workstream and classify what should be preserved, rewritten, deferred, or removed
- [x] 1.3 Record the closure-oriented source-of-truth boundaries for README, docs site, OpenSpec, and changelog surfaces before editing files

## 2. OpenSpec Normalization

- [x] 2.1 Rewrite legacy `/specs/` references in tracked guidance and documentation to `openspec/`
- [x] 2.2 Refine core `openspec/specs/` content so repository standards, technical design, and testing requirements match the normalized end state
- [x] 2.3 Fold any closure-relevant `add-mentions` context into the new umbrella change backlog and remove duplicate or misleading change artifacts

## 3. Repository Guidance and AI Workflow

- [x] 3.1 Redesign `AGENTS.md` as the concise canonical workflow for OpenSpec-driven repository work
- [x] 3.2 Redesign `CLAUDE.md` so it complements `AGENTS.md` without duplicating generic guidance
- [x] 3.3 Generate `copilot-instructions.md` and align it with the same OpenSpec-first workflow
- [x] 3.4 Fix `.claude/settings.json` hooks or replace them with portable repository-valid automation
- [x] 3.5 Document how to use review flows, subagents, autopilot, and long-running sessions without encouraging branch drift or unnecessary `/fleet`

## 4. Documentation and Historical Surface Cleanup

- [x] 4.1 Restructure `README.md` and `README.zh-CN.md` around project positioning, quick start, and canonical links
- [x] 4.2 Redesign the docs site landing pages and information architecture so GitHub Pages is a meaningful project showcase
- [x] 4.3 Consolidate or delete low-value historical files in `changelog/`, `release-notes.md`, and related redundant documentation
- [x] 4.4 Align contributing, security, and community-facing docs with the simplified repository boundaries

## 5. Engineering Configuration Simplification

- [x] 5.1 Choose and enforce one coherent package-manager/runtime story across docs, scripts, and GitHub workflows
- [x] 5.2 Simplify `.github/workflows/*` to keep only high-signal verification, docs deployment, release, and essential maintenance jobs
- [x] 5.3 Review `.github/dependabot.yml`, ignore rules, and other automation config for archive-ready maintainability
- [x] 5.4 Remove tracked transient artifacts and tighten repository hygiene around generated outputs

## 6. GitHub Presentation and Operations

- [x] 6.1 Finalize GitHub Pages URL strategy and make the docs site the repository homepage target
- [x] 6.2 Update repository About description and topics with `gh` to match the normalized project story
- [x] 6.3 Review issue templates, pull request template, and community files for minimal high-signal maintenance use

## 7. Tooling Strategy

- [x] 7.1 Define and document the supported LSP baseline for Go, TypeScript/React, and relevant docs authoring workflows
- [x] 7.2 Decide the default MCP/plugin posture and document why minimal integrations are preferred for this repository
- [x] 7.3 Align Copilot, Claude, Codex, and OpenSpec usage guidance so each tool has a clear role in the final workflow

## 8. Bug Sweep and Conformance Fixes

- [x] 8.1 Run a repo-wide audit for code, config, workflow, and documentation bugs that contradict the normalized specs
- [x] 8.2 Fix application-level bugs or mismatches that block archive-readiness
- [x] 8.3 Fix workflow, docs, and configuration defects uncovered by the audit
- [x] 8.4 Reconcile version pinning and technology selections so the repository presents one consistent stack story

## 9. Final Verification and Archive Readiness

- [x] 9.1 Run the relevant existing verification commands for backend, frontend, docs, and workflow-touched surfaces
- [x] 9.2 Perform a final pass on repository coherence, discoverability, and maintenance burden
- [x] 9.3 Update the umbrella change artifacts to reflect any deferred scope and the final archive-ready outcome
