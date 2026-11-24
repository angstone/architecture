// Negative control of the names check: a planted canary must be found in every spelling the check normalises, clean text must
// pass, and the digest table must be well formed. The canary is a harmless word registered only for this run, so the control holds no name.
// Usage: node scripts/check-names-control.mjs   exits 1 on the first failed assertion.
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { digestOf, makeChecker, leftovers } from './check-names.mjs'

const assert = (ok, msg) => { if (!ok) { console.error(`check-names-control: FAILED: ${msg}`); process.exit(1) } }

const table = [...readFileSync(new URL('./check-names.mjs', import.meta.url), 'utf8').matchAll(/'([0-9a-f]{64})'/g)].map((m) => m[1])
assert(table.length >= 4 && new Set(table).size === table.length, 'digest table is malformed or has duplicates')

const canary = makeChecker([digestOf('zzcanary')])
for (const t of ['zzcanary', 'ZZCanary', 'a zzcanary b', 'x.zzcanary.', '@zzcanary', 'https://example.org/zzcanary/x', 'zzcanary-pair']) assert(canary(t), `canary missed in: ${t}`)
for (const t of ['Merry', 'Sunny', 'zzcanaryx', 'zz canary', 'canary', '']) assert(!canary(t), `false positive on: ${t}`)

const dir = mkdtempSync(join(tmpdir(), 'cn-'))
writeFileSync(join(dir, 'dirty.md'), 'clean line\nthe zzcanary appears here\n')
writeFileSync(join(dir, 'clean.md'), 'Merry and Sunny only\n')
const hits = leftovers(dir, [digestOf('zzcanary')])
rmSync(dir, { recursive: true })
assert(hits.length === 1 && hits[0] === 'dirty.md:2', `leftovers reported ${JSON.stringify(hits)}`)

console.log('check-names-control: ok')
