// Spec checks. Usage: node scripts/check-spec.mjs
//   1. every R-id exactly once in docs/spec, and the count equals scripts/spec-meta.json
//   2. every rationale points at an existing R-id, and every "Rationale: E-R<n>.<m>" pointer in a rule resolves to a file
//   3. one identical header on every spec file, naming the tag and status of spec-meta.json and its source commit
//   4. the tag exists in this repository and is an ancestor of HEAD (the tag is never moved)
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'

const SPEC = 'docs/spec', RAT = 'docs/rationale'
const meta = JSON.parse(readFileSync('scripts/spec-meta.json', 'utf8'))
const HEADER_RE = /^\*\*Merry 5\.2\*\* · `([^`]+)` · (candidate|frozen) · (\d{4}-\d{2}-\d{2}) · commit ([0-9a-f]{7,40})$/
const fails = []
const fail = (m) => fails.push(m)
const md = (d) => readdirSync(d).filter((f) => f.endsWith('.md') && f !== 'README.md').sort().map((f) => [f, readFileSync(join(d, f), 'utf8')])

const ids = new Map()
for (const [f, t] of md(SPEC)) for (const m of t.matchAll(/^\*\*(R[1-5]\.\d+)[ *]/gm)) ids.set(m[1], [...(ids.get(m[1]) ?? []), f])
const dup = [...ids].filter(([, v]) => v.length !== 1)
if (dup.length) fail(`R-ids not exactly once: ${dup.map(([k, v]) => `${k}x${v.length}`).join(' ')}`)
if (ids.size !== meta.rIdCount) fail(`R-id count ${ids.size}, scripts/spec-meta.json says ${meta.rIdCount}`)

const rationale = existsSync(RAT) ? md(RAT) : []
for (const [f, t] of rationale) {
  const m = t.match(/^Rationale for: (R[0-5](?:\.\d+)?)\b/m)
  if (!m) { fail(`rationale ${f} has no "Rationale for: <R-id>" line`); continue }
  const id = m[1]
  if (/^R[1-5]\.\d+$/.test(id) ? !ids.has(id) : !/^R[0-5]$/.test(id)) fail(`rationale ${f} points at ${id}, not in spec`)
  if (/^R[1-5]\.\d+$/.test(id) && f !== `E-${id}.md`) fail(`rationale ${f} must be named E-${id}.md`)
}
for (const [f, t] of md(SPEC)) for (const m of t.matchAll(/Rationale: E-(R[1-5]\.\d+)\b/g)) if (!rationale.some(([rf]) => rf === `E-${m[1]}.md`)) fail(`${f}: Rationale: E-${m[1]} has no file`)

const headers = new Map()
for (const [f, t] of md(SPEC)) {
  const first = t.split('\n')[0]
  const m = first.match(HEADER_RE)
  if (!m) { fail(`${f}: first line is not the Merry 5.2 header`); continue }
  if (m[1] !== meta.tag) fail(`${f}: header names ${m[1]}, expected ${meta.tag}`)
  if (m[2] !== meta.status) fail(`${f}: header status is ${m[2]}, expected ${meta.status}`)
  if (!m[4].startsWith(meta.headerCommit)) fail(`${f}: header commit ${m[4]} is not ${meta.headerCommit}`)
  headers.set(first, [...(headers.get(first) ?? []), f])
}
if (headers.size > 1) fail(`headers differ across files: ${[...headers].map(([h, v]) => `${v.length}x "${h}"`).join(' | ')}`)

const git = (...a) => spawnSync('git', a, { encoding: 'utf8' })
const tag = git('rev-parse', '--verify', '--quiet', `refs/tags/${meta.tag}^{commit}`)
if (tag.status !== 0) fail(`tag ${meta.tag} does not exist in this clone (fetch tags: git fetch --tags)`)
else if (git('merge-base', '--is-ancestor', tag.stdout.trim(), 'HEAD').status !== 0) fail(`tag ${meta.tag} is not an ancestor of HEAD`)

console.log(`R-ids=${ids.size}/${meta.rIdCount} rationale-files=${rationale.length} header-variants=${headers.size} tag=${meta.tag}`)
if (fails.length) { console.error('FAIL\n' + fails.map((f) => ' - ' + f).join('\n')); process.exit(1) }
console.log('check-spec: ok')
