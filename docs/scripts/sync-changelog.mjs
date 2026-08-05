/**
 * Sync CHANGELOG.md from repo root into the docs site (single Chinese locale).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..', '..')
const docsChangelog = join(__dirname, '..', 'reference', 'changelog.md')

const changelogPath = join(rootDir, 'CHANGELOG.md')
if (!existsSync(changelogPath)) {
  console.log('No CHANGELOG.md found at repo root, skipping sync')
  process.exit(0)
}

mkdirSync(dirname(docsChangelog), { recursive: true })
const changelog = readFileSync(changelogPath, 'utf-8')
writeFileSync(docsChangelog, `---
title: 变更日志
---

# 变更日志

${changelog}
`)
console.log('Synced changelog to docs/reference/changelog.md')
