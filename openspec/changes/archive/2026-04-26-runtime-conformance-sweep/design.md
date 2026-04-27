## Context

The issue is not a failing build but a noisy and partially weak docs toolchain. Investigation shows two separate root causes:

1. The docs build warnings come from code fences tagged as `env` and `promql`, while the current Shiki bundle supports `dotenv` but not `env`, and does not support `promql` in the default language set.
2. The docs audit warnings come from the `vitepress -> vite -> esbuild/postcss` dependency chain. `postcss` has a safe patch upgrade available within the supported range, while `vite/esbuild` remain constrained by the currently published VitePress release line.

## Goals / Non-Goals

**Goals:**
- Make the docs build output clean by removing unsupported fence-language warnings.
- Apply safe dependency hygiene improvements that stay within VitePress's supported version ranges.
- Explicitly document any remaining upstream limitations instead of pretending the toolchain is fully warning-free.

**Non-Goals:**
- Replacing VitePress.
- Forcing unsupported major dependency overrides just to make `npm audit` look smaller.
- Broad application refactoring unrelated to the conformance sweep.

## Decisions

### 1. Fix warning sources at the content layer

**Decision**: Replace unsupported `env` fences with supported `dotenv` and replace unsupported `promql` fences with untyped code blocks.

**Rationale**:
- The root cause is content metadata, not VitePress configuration.
- This is the smallest safe change and keeps the content readable.

### 2. Apply only safe dependency patches

**Decision**: Use `overrides` only for dependencies that can be patched safely within the supported VitePress range, starting with `postcss`.

**Rationale**:
- `postcss` has a clear patch release available and is already allowed by the dependency range.
- Overriding `vite` or `esbuild` beyond what VitePress declares would trade one warning for uncertain build stability.

### 3. Treat remaining advisories as explicit upstream limits

**Decision**: If `vite`/`esbuild` advisories remain after safe fixes, record them in the change artifacts and handoff rather than masking them with unsupported overrides.

**Rationale**:
- Archive-ready does not mean pretending upstream limitations do not exist.
- Truthful documentation is better than risky dependency forcing.

## Risks / Trade-offs

- **[Untyped PromQL blocks lose syntax color]** -> Prefer clean builds and truthful defaults over pretending unsupported highlighting exists.
- **[PostCSS override changes lockfile behavior]** -> Keep the override patch-level and verify docs build output afterward.
- **[Remaining advisories still appear in audit]** -> Document them as upstream-constrained and keep the rest of the toolchain stable.

## Migration Plan

1. Add delta specs and tasks for the conformance sweep.
2. Update docs code fences to supported language tags.
3. Apply safe dependency hygiene updates and regenerate the docs lockfile.
4. Re-run docs build and audit, then record any remaining upstream-only advisories.

## Open Questions

None.
