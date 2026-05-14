/**
 * Sync CHANGELOG.md from repo root to docs for inclusion in the docs site.
 * This script runs before each docs build to ensure changelog is up-to-date.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..', '..')
const docsDir = join(__dirname, '..')

function syncChangelog() {
  const changelogPath = join(rootDir, 'CHANGELOG.md')
  const docsChangelogZh = join(docsDir, 'zh', 'release-notes', 'changelog.md')
  const docsChangelogEn = join(docsDir, 'en', 'release-notes', 'changelog.md')

  if (!existsSync(changelogPath)) {
    console.log('No CHANGELOG.md found at repo root, skipping sync')
    return
  }

  const changelog = readFileSync(changelogPath, 'utf-8')

  // Ensure directories exist
  const zhDir = dirname(docsChangelogZh)
  const enDir = dirname(docsChangelogEn)
  if (!existsSync(zhDir)) mkdirSync(zhDir, { recursive: true })
  if (!existsSync(enDir)) mkdirSync(enDir, { recursive: true })

  // Create zh version with frontmatter
  const zhContent = `---
title: 变更日志
---

# 变更日志

${changelog}
`
  writeFileSync(docsChangelogZh, zhContent)
  console.log('Synced changelog to docs/zh/release-notes/changelog.md')

  // Create en version with frontmatter
  const enContent = `---
title: Changelog
---

# Changelog

${changelog}
`
  writeFileSync(docsChangelogEn, enContent)
  console.log('Synced changelog to docs/en/release-notes/changelog.md')
}

syncChangelog()
