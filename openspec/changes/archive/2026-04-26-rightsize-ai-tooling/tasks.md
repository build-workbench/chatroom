## 1. Instruction Surface Cleanup

- [x] 1.1 Rebalance `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` around one canonical workflow source

## 2. Hook and Artifact Hygiene

- [x] 2.1 Rewrite `.claude/settings.json` so non-applicable cases exit cleanly and formatter failures are no longer hidden
- [x] 2.2 Prune repo-local Claude skills to the minimal supported set
- [x] 2.3 Ignore transient AI scratch directories in `.gitignore`

## 3. Verification

- [x] 3.1 Re-run the touched validation commands and confirm the AI guidance surfaces remain aligned
