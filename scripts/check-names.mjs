// No natural person is named in the published text. Usage: node scripts/check-names.mjs
// Scans every tracked-looking text file except the code-owner file (a platform handle is required there) and .git.
// The forbidden words are held only as salted SHA-256 digests, sha256(SALT + ':' + word) of the lowercased word: this
// file spells no name, and a digest cannot be read back without first guessing the word and the salt.
// Usage as a module: import { digestOf, makeChecker, leftovers } from './check-names.mjs'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SALT = '5ce15344b603d7be28153647d509b564937f98cc93cf236910815ec204c40170'
const FORBIDDEN = [
  '7b053440ab4c701cb70fcbe11d0008853bc8272ea2ef57c7f1d943182c5355b4',
  '350d73823486c9f0e571210f27da2799e95bd1c3f3dfda74cd7c71363ab20ee6',
  '74bfa9c082d271933e69f7e670150a200bbb5072de01d9a4ecc0311161c04e63',
]

export const digestOf = (word) => createHash('sha256').update(`${SALT}:${word.toLowerCase()}`).digest('hex')
const words = (line) => line.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)

// Returns a function: line -> true when any lowercased word of the line hashes into the given digest set.
export const makeChecker = (digests) => {
  const set = new Set(digests)
  return (line) => words(line).some((w) => set.has(digestOf(w)))
}

const SKIP = new Set(['.git', 'node_modules', '.github/CODEOWNERS'])
const TEXT = /\.(md|json|ya?ml|cff|mjs|svg|txt)$/
export const leftovers = (dir, digests = FORBIDDEN) => {
  const isForbidden = makeChecker(digests)
  const hits = []
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name
      if (SKIP.has(e.name) || SKIP.has(r)) continue
      if (e.isDirectory()) { walk(p, r); continue }
      if (!TEXT.test(e.name) && e.name !== 'LICENSE') continue
      readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (isForbidden(l)) hits.push(`${r}:${i + 1}`) })
    }
  }
  walk(dir, '')
  return hits
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const hits = leftovers('.')
  if (hits.length) { console.error(`FAIL: a natural person is named at\n${hits.slice(0, 20).join('\n')}`); process.exit(1) }
  console.log('check-names: ok')
}
