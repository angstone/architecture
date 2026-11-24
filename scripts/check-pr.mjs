// Pull request rule: a change under docs/spec cites an R-id (in the description or a commit message) and changes a Test: line.
// Usage: PR_BODY="..." node scripts/check-pr.mjs <base-ref>     (the workflow passes origin/<base> and the PR description)
import { spawnSync } from 'node:child_process'

const base = process.argv[2]
if (!base) throw new Error('usage: check-pr.mjs <base-ref>')
const git = (...a) => { const r = spawnSync('git', a, { encoding: 'utf8' }); if (r.status !== 0) throw new Error(`git ${a.join(' ')}: ${r.stderr}`); return r.stdout }
const files = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean)
if (!files.some((f) => f.startsWith('docs/spec/') && f.endsWith('.md') && !f.endsWith('README.md'))) { console.log('check-pr: no spec file touched, nothing to check'); process.exit(0) }

const cited = `${process.env.PR_BODY ?? ''}\n${git('log', '--format=%B', `${base}..HEAD`)}`
const ids = [...new Set(cited.match(/\bR[1-5]\.\d+\b/g) ?? [])]
const diff = git('diff', '-U0', `${base}...HEAD`, '--', 'docs/spec')
const testLineChanged = /^[+-]Test:/m.test(diff)
const fails = []
if (!ids.length) fails.push('a change under docs/spec must cite the R-id it touches (description or commit message)')
if (!testLineChanged) fails.push('a change under docs/spec must add or change a Test: line')
if (fails.length) { console.error('FAIL\n - ' + fails.join('\n - ')); process.exit(1) }
console.log(`check-pr: ok (cites ${ids.join(', ')})`)
