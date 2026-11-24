// Negative control of the neutral-name check: a planted canary must be found in every spelling the check normalises, clean text must pass,
// and the digest table must be well formed. The canary is a harmless word registered only for this run, so the control holds no forbidden name.
// Usage: node scripts/neutral-name-control.mjs   exits 1 on the first failed assertion.
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { digestOf, makeChecker, leftovers } from './neutral-name.mjs'
import { readFileSync } from 'node:fs'

const assert = (ok, msg) => { if (!ok) { console.error(`neutral-name-control: FAILED: ${msg}`); process.exit(1) } }
const sha = digestOf

const table = [...readFileSync(new URL('./neutral-name.mjs', import.meta.url), 'utf8').matchAll(/'([0-9a-f]{64})'/g)].map((m) => m[1])
assert(table.length >= 20 && new Set(table).size === table.length, 'digest table is malformed or has duplicates')

const canary = makeChecker([sha('zzcanary'), sha('zzcanary pair')])
for (const t of ['zzcanary', 'ZZCanary', 'a zzcanary b', 'zzcanary_pair', 'zzcanary-pair', 'zzcanary   PAIR', 'x.zzcanary.']) assert(canary(t), `canary missed in: ${t}`)
for (const t of ['Merry', 'Sunny', 'the plain codename Merry', 'zz canary', 'canary', '']) assert(!canary(t), `false positive on: ${t}`)

const dir = mkdtempSync(join(tmpdir(), 'nn-'))
writeFileSync(join(dir, 'dirty.md'), 'clean line\nthe zzcanary appears here\n')
writeFileSync(join(dir, 'clean.md'), 'Merry and Sunny only\n')
const hits = leftovers(dir, [sha('zzcanary')])
rmSync(dir, { recursive: true })
assert(hits.length === 1 && hits[0] === 'dirty.md:2', `leftovers reported ${JSON.stringify(hits)}`)

console.log('neutral-name-control: ok')
