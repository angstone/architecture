// No natural person is named in the published text. Usage: node scripts/check-names.mjs
// Scans every tracked-looking text file except this script, the code-owner file (a platform handle is required there) and .git.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// Built from pieces so this file does not contain the names it forbids.
const NAMES = [['lu', 'an'], ['este', 'ban'], ['ss', 'ribeiro']].map((p) => p.join(''))
const RE = new RegExp(`\\b(${NAMES.join('|')})\\b`, 'i')
const SKIP = new Set(['.git', 'node_modules', 'scripts/check-names.mjs', '.github/CODEOWNERS'])
const hits = []
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = dir === '.' ? e.name : join(dir, e.name)
    if (SKIP.has(p) || SKIP.has(e.name) && e.isDirectory()) continue
    if (e.isDirectory()) { walk(p); continue }
    if (!/\.(md|json|ya?ml|cff|mjs|svg|txt)$/.test(p) && p !== 'LICENSE') continue
    readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (RE.test(l)) hits.push(`${p}:${i + 1}`) })
  }
}
walk('.')
if (hits.length) { console.error(`FAIL: a natural person is named at\n${hits.slice(0, 20).join('\n')}`); process.exit(1) }
console.log('check-names: ok')
