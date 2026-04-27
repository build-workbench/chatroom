## Why

The repository currently passes its validation commands, but its docs build still emits avoidable warnings and the docs dependency tree contains moderate audit findings. Those issues are not product features, but they do contradict the repository's goal of being polished, truthful, and ready for low-touch archival.

## What Changes

- Remove avoidable docs-build warnings caused by unsupported code-fence language tags.
- Tighten docs dependency hygiene where a safe patch-level fix exists without stepping outside VitePress's supported range.
- Capture any remaining upstream audit risk explicitly instead of silently tolerating it as unexplained noise.
- Sweep for other small runtime or documentation conformance mismatches uncovered while fixing the docs pipeline.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `developer-tooling`: Add clearer requirements for docs dependency hygiene and supported build-time tooling behavior.
- `technical-design`: Add requirements for clean documentation-build surfaces as part of the repository's final delivery quality.
- `testing`: Add requirements that known build warnings and dependency advisories be either fixed safely or explicitly documented as upstream constraints.

## Impact

- `docs/package.json`, `docs/package-lock.json`
- `docs/en/**`, `docs/zh/**`, `docs/monitoring/**`
- `openspec/specs/developer-tooling/spec.md`
- `openspec/specs/technical-design/spec.md`
- `openspec/specs/testing/spec.md`
