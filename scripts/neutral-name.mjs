// The public face of the architecture: the plain codename "Merry" (later "Sunny"), tag "merry-N" and the neutral tag "arch-vN";
// no franchise, ship, character or studio name, no ship imagery.
// The forbidden names are held only as salted SHA-256 digests, sha256(SALT + ':' + n-gram), of normalised lowercase word n-grams:
// no readable forbidden string exists in this repository, and a digest cannot be read back without first guessing the n-gram and the salt.
// Normalisation: lowercase, accents stripped, every run of non-alphanumerics is one separator; n-grams of 1 to 3 words are joined by one space and hashed.
// Usage as a module: import { digestOf, makeChecker, leftovers } from './neutral-name.mjs'
// Usage as a command: node scripts/neutral-name.mjs <dir>   exits 1 and lists every file:line holding a forbidden name in <dir>.
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const SALT = '5ce15344b603d7be28153647d509b564937f98cc93cf236910815ec204c40170'
const FORBIDDEN_SHA256 = [
  '07aae89b0239c170382865cd83c8176c85b3836042210ed043ed0ebb453b5285',
  '08d99cd10cf9edc1a7762c028fde6b80d384f97d00227e89412dec1cec4231cc',
  '0b9a41c842a794cc6ab993236275d103c7d5afbf077b5ca159d34241987dede9',
  '12ec4dc841ed5ce2999aa0ad060d66a36850fe2aa1c32de19f74746b1ac74ae1',
  '15f21272df65f6a8b8ee51822f7572ae85993a415f8a9bab6ab407dc698eb227',
  '19cc8a7e2a14a57e1d2ded6e6f9cdba3e6bf138ccf2a96783b474642192ee083',
  '26f266d9c4daee159a2f3888fbc9ecb028f8f71d47488b872ff97116156c3f59',
  '2f21138a1fad4a789cfb8ef70010ba675d7b32800579d5ce0e3324296db5a447',
  '30654189bf1d51644a9f63fc2a9364c7fec88c843d27ad2704818650e166d5dd',
  '3615403ff08a790b82d1da6e79d398c93bb38b3a96cb01ceb5ee1c576c86ed89',
  '3a0dd4f51b1db87fe1bce9fb806af1c281c97967fc55e356f8a62d7e0e95abc4',
  '3c219efe46c688800383ae6f4379901aa9befda45fae980f2eabde7315b9444e',
  '4074965468999c9f24f4146389fa32f59c22e284e921b1e71c1919cd49f88c10',
  '4a3d932d7455d395c353e96418db9ba6d439b08b298609f04f055d6615d505be',
  '4bfaf5c47b2d941e00a046b91a26203affa424fc19e47ac7bf289a5fbf8c77e9',
  '5a653cea8ea8265b460992b461b56366650d1775663c9896b147cacb9a0b45ff',
  '6b16cb45e447d1e2bef74935e5414ea819f862c0e3470d948eb1264c7dcd2dc9',
  '7a064d9942208d8e69360373763a961f532126d34c621adf2ba6beb3e220cafb',
  '9f268015217859a312b3a03d2ba66a9b8ce879f00ca01b6df28e0d92ee11c2be',
  'a3bc1bc811833544c4bcc28fb8dec6ad19ba72c3f1c28fe27645c119702ba2d9',
  'b55971a8d4db6525e7f74f44aad9483e6c5c1c9e85d883101141e243a5bbc121',
  'b928ce0b424c7eeffb3325b229315768c4663b42f6a5a7b1bf344f50bfe295b0',
  'b9de97433a1fa863d62cfdac022bbb45bd7dd7c721a28e869dbc4ffcd7878bcb',
  'd32d3fca3f03cd66b0a4e2a70162c1f9acd1c89c7edc38a099526d223da7bbf6',
  'dd37d53154d16e9eaead16741ea4b3cc14a30446060360e25cdd2061bf8fca46',
  'dea3a45a31fb1b2df03105db79f47ae1d6a144d4fc627a42572bc3f19cfa5318',
  'e1ff301d2960b1376686a84102779c6f412835cbcd0ee2116ed9ebe533287247',
  'ea93251e654acbb139e6e4374696c8d55eb01c58b8a27ab32a0489e844573808',
]
const MAX_WORDS = 3

/** The salted digest of one normalised n-gram (words joined by one space). */
export const digestOf = (s) => createHash('sha256').update(`${SALT}:${s}`).digest('hex')
const sha = digestOf
const words = (line) => line.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(Boolean)

// Returns a function: line -> true when any 1..MAX_WORDS word n-gram of the line hashes into the given digest set.
export const makeChecker = (digests) => {
  const set = new Set(digests)
  return (line) => {
    const w = words(line)
    for (let i = 0; i < w.length; i++) {
      for (let n = 1; n <= MAX_WORDS && i + n <= w.length; n++) {
        if (set.has(sha(w.slice(i, i + n).join(' ')))) return true
      }
    }
    return false
  }
}

const SKIP = new Set(['.git', 'node_modules'])
const TEXT = /\.(md|json|ya?ml|cff|mjs|svg|txt)$/
export const leftovers = (dir, digests = FORBIDDEN_SHA256) => {
  const isForbidden = makeChecker(digests)
  const hits = []
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (SKIP.has(e.name)) continue
      const p = join(d, e.name), r = rel ? `${rel}/${e.name}` : e.name
      if (e.isDirectory()) { walk(p, r); continue }
      if (!TEXT.test(e.name) && e.name !== 'LICENSE') continue
      readFileSync(p, 'utf8').split('\n').forEach((l, i) => { if (isForbidden(l)) hits.push(`${r}:${i + 1}`) })
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
