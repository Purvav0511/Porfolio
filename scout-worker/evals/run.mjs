// Runs every case in cases.json against a running scout Worker and scores the reports.
// Usage: SCOUT_URL=http://localhost:8787 node evals/run.mjs   (each case is one paid Claude call)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const SCOUT_URL = process.env.SCOUT_URL || 'http://localhost:8787'
const ORIGIN = process.env.SCOUT_ORIGIN || 'http://localhost:5173'
const cases = JSON.parse(readFileSync(new URL('./cases.json', import.meta.url)))
  .filter(c => !process.env.CASES || process.env.CASES.split(',').includes(c.id))

const has = (text, pattern) => new RegExp(pattern, 'i').test(text)
const matchText = r => r.matches.map(m => `${m.requirement} ${m.evidence}`).join(' | ')
const gapText = r => r.gaps.map(g => `${g.requirement} ${g.note}`).join(' | ')

function grade(c, r) {
  const fails = []
  if (c.expect_not_jd) {
    if (r.is_job_description) fails.push('should be flagged as not a job description')
    return fails
  }
  if (!r.is_job_description) return ['wrongly flagged as not a job description']
  if (!c.verdict_in.includes(r.verdict)) fails.push(`verdict "${r.verdict}" not in ${c.verdict_in.join('/')}`)
  for (const p of c.must_match) if (!has(matchText(r), p)) fails.push(`missing match: ${p}`)
  for (const p of c.must_gap) if (!has(gapText(r), p)) fails.push(`missing gap: ${p}`)
  // A skill he doesn't have must never show up as a match.
  for (const p of c.must_not_claim) if (r.matches.some(m => has(m.requirement, p) && !has(m.evidence, `no |not |lack`))) fails.push(`claimed absent skill: ${p}`)
  // Spark may be credited only as academic project work, never as production experience.
  if (c.spark_must_be_academic) {
    const spark = r.matches.filter(m => has(`${m.requirement} ${m.evidence}`, 'spark'))
    if (spark.some(m => !has(`${m.evidence} ${m.source}`, 'academic|course|NYU|CheapThrills|project'))) fails.push('Spark credited without academic framing')
    if (!spark.length && !has(gapText(r), 'spark')) fails.push('Spark neither matched as academic nor listed as a gap')
  }
  return fails
}

const results = []
for (const c of cases) {
  const res = await fetch(`${SCOUT_URL}/scout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN },
    body: JSON.stringify({ jd: c.jd }),
  })
  const body = await res.json().catch(() => ({}))
  const fails = res.ok ? grade(c, body.report) : [`HTTP ${res.status} ${body.error || ''}`]
  results.push({ id: c.id, pass: fails.length === 0, fails, report: body.report })
  console.log(`${fails.length ? 'FAIL' : 'pass'}  ${c.id}${fails.length ? '  — ' + fails.join('; ') : ''}`)
  await new Promise(r => setTimeout(r, 13000)) // stay under the 5/min per-visitor limit
}

const passed = results.filter(r => r.pass).length
console.log(`\n${passed}/${results.length} cases passed`)
mkdirSync(new URL('./results/', import.meta.url), { recursive: true })
writeFileSync(new URL(`./results/${new Date().toISOString().replace(/[:.]/g, '-')}.json`, import.meta.url), JSON.stringify(results, null, 2))
process.exit(passed === results.length ? 0 : 1)
