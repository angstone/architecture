// Every relative link and image in every Markdown file resolves to a file or folder. Usage: node scripts/check-links.mjs
// External links (http, https, mailto) and pure anchors are not fetched here.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'

const bad = []
let checked = 0
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue
    const p = dir === '.' ? e.name : join(dir, e.name)
    if (e.isDirectory()) { walk(p); continue }
    if (!p.endsWith('.md')) continue
    const text = readFileSync(p, 'utf8').replace(/```[\s\S]*?```/g, '')
    for (const m of text.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)|<img[^>]+src="([^"]+)"/g)) {
      const raw = m[1] ?? m[2]
      if (/^(https?:|mailto:|#)/.test(raw)) continue
      const target = decodeURIComponent(raw.split('#')[0])
      if (!target) continue
      checked++
      if (!existsSync(join(dirname(p), target))) bad.push(`${p}: ${raw}`)
    }
  }
}
walk('.')
console.log(`check-links: ${checked} relative links`)
if (bad.length) { console.error('FAIL\n' + bad.slice(0, 30).join('\n')); process.exit(1) }
console.log('check-links: ok')
