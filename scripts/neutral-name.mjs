// The public face of the architecture (owner ruling 2026-11-23): the plain codename "Merry" (later "Sunny"), tag "merry-N" and the neutral
// tag "arch-vN"; no franchise, ship, character or studio name, no ship imagery. The internal tokens of the Names section are rewritten here.
// Usage as a module: import { neutralize, leftovers } from './neutral-name.mjs'
// Usage as a command: node scripts/neutral-name.mjs <dir>   exits 1 and lists every file:line holding a forbidden name in <dir>.
// The plain words "Merry" and "Sunny" are allowed; the compound ship names and the names below are not.
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

// Built from pieces so this file does not hold the strings it forbids.
const w = (...p) => p.join('')
const FORBIDDEN = new RegExp([
  w('going', '[_ ]+', 'mer', 'ry'),
  w('thousand', '[_ ]+', 'sun', 'ny'),
  w('one', ' ', 'pi', 'ece'),
  w('straw', ' ', 'hat'),
  w('figure', 'head'),
  ...['lu' + 'ffy', 'zo' + 'ro', 'na' + 'mi', 'usop' + 'p', 'san' + 'ji', 'chop' + 'per', 'nico ' + 'robin', 'fran' + 'ky', 'bro' + 'ok', 'jin' + 'be', 'to' + 'ei', 'eiichi' + 'ro', 'shue' + 'isha'].map((x) => `\\b${x}\\b`),
].join('|'), 'i')
const TOKEN = new RegExp(`going_${w('mer', 'ry')}_alpha_(\\d[\\d.]*|N)`, 'g')
const SERIES = new RegExp(`${w('thousand', '_', 'sun', 'ny')}_(N)`, 'g')
const HEADER = new RegExp(`^\\*\\*${w('Mer', 'ry')} (\\d[\\d.]*)\\*\\*`, 'gm')

// the one version published under the public tags; the other versions are internal history and keep no public tag
const CURRENT = '5.2.1'

export const neutralize = (text) => text
  .replaceAll(TOKEN, (_, v) => (v === 'N' || v === CURRENT ? `merry-${v}` : `v${v}`))
  .replaceAll(SERIES, 'sunny-$1')
  .replaceAll(HEADER, '**Angstone Architecture — Merry $1**')

const SKIP = new Set(['.git', 'node_modules'])
const TEXT = /\.(md|json|ya?ml|cff|mjs|svg|txt)$/
export const leftovers = (dir) => {
  const hits = []
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (SKIP.has(e.name)) continue
      const p = join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) { walk(p, r); continue }
      if (!TEXT.test(e.name) && e.name !== 'LICENSE') continue
      readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (FORBIDDEN.test(l)) hits.push(`${r}:${i + 1}`) })
    }
  }
  walk(dir, '')
  return hits
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2]
  if (!dir) throw new Error('usage: neutral-name.mjs <dir>')
  const hits = leftovers(dir)
  if (hits.length) { console.error(`neutral-name: a forbidden name is left:\n${hits.map((h) => ' - ' + h).join('\n')}`); process.exit(1) }
  console.log('neutral-name: ok')
}
