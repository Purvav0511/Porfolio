// Free uptime checks for the live portfolio and the Scout Worker. Spends no Claude credits:
// the Worker's /health only looks up the model, and the /scout probes are rejected before Claude runs.
// Writes a Markdown report to MONITOR_REPORT (default monitor-report.md) and exits 1 if any check fails.
// Usage: node .github/scripts/monitor.mjs
import { writeFileSync, appendFileSync } from 'node:fs'

const SITE = process.env.SITE_URL || 'https://purvav0511.github.io/Porfolio/'
const SCOUT = process.env.SCOUT_URL || 'https://purvav-scout.purvavpunyani.workers.dev'
const ORIGIN = new URL(SITE).origin
const REPORT = process.env.MONITOR_REPORT || 'monitor-report.md'

async function get(url, init = {}) {
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), ...init })
  return { res, text: await res.text() }
}

const checks = [
  ['Site loads', async () => {
    const { res, text } = await get(SITE)
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
    if (!text.includes('id="root"')) throw new Error('page is missing the React root')
    if (!text.includes('Content-Security-Policy')) throw new Error('Content-Security-Policy meta tag is missing')
    const assets = [...text.matchAll(/(?:src|href)="([^"]+\/assets\/[^"]+\.(?:js|css))"/g)].map(m => new URL(m[1], SITE).href)
    if (!assets.length) throw new Error('no built JS/CSS assets referenced')
    for (const a of assets) {
      const r = await fetch(a, { signal: AbortSignal.timeout(20000) })
      if (r.status !== 200) throw new Error(`${a} returned HTTP ${r.status}`)
    }
    return `${assets.length} assets OK`
  }],
  ['Résumé PDF downloads', async () => {
    const res = await fetch(new URL('resume.pdf', SITE), { signal: AbortSignal.timeout(20000) })
    if (res.status !== 200) throw new Error(`HTTP ${res.status}`)
    if (!(res.headers.get('content-type') || '').includes('pdf')) throw new Error(`content-type ${res.headers.get('content-type')}`)
    return 'OK'
  }],
  ['Scout API key and model valid (/health)', async () => {
    const { res, text } = await get(`${SCOUT}/health`)
    let body
    try { body = JSON.parse(text) } catch { throw new Error(`HTTP ${res.status}, non-JSON response`) }
    if (!body.ok && !body.reason) throw new Error(`HTTP ${res.status} ${body.error || ''}. If this is 404, the Worker is running a version without /health; redeploy it.`)
    if (!body.ok) {
      const hint = {
        invalid_api_key: 'The Anthropic API key is invalid or expired. Run `npx wrangler secret put ANTHROPIC_API_KEY` in scout-worker/.',
        model_not_found: `Model "${body.model}" no longer exists. Update MODEL in scout-worker/wrangler.toml.`,
        not_configured: 'The ANTHROPIC_API_KEY secret is not set on the Worker.',
        permission_denied: 'The API key lacks access to this model or the account is restricted.',
      }[body.reason] || ''
      throw new Error(`${body.reason}${body.status ? ` (Anthropic HTTP ${body.status})` : ''}. ${hint}`)
    }
    const { used, limit } = body.budget || {}
    if (limit && used >= limit) throw new Error(`daily report budget used up (${used}/${limit}); visitors are being turned away`)
    return `model ${body.model}, ${used}/${limit} reports used today`
  }],
  ['Scout accepts the site (CORS)', async () => {
    const res = await fetch(`${SCOUT}/scout`, { method: 'OPTIONS', headers: { Origin: ORIGIN, 'Access-Control-Request-Method': 'POST' }, signal: AbortSignal.timeout(20000) })
    if (res.status !== 204) throw new Error(`preflight HTTP ${res.status}`)
    if (res.headers.get('access-control-allow-origin') !== ORIGIN) throw new Error('site origin not allowed')
    return 'OK'
  }],
  ['Scout rejects other origins', async () => {
    const { res } = await get(`${SCOUT}/scout`, { method: 'POST', headers: { Origin: 'https://not-the-site.example', 'Content-Type': 'application/json' }, body: '{}' })
    if (res.status !== 403) throw new Error(`expected 403, got HTTP ${res.status}`)
    return 'OK'
  }],
  ['Scout validates input', async () => {
    const { res, text } = await get(`${SCOUT}/scout`, { method: 'POST', headers: { Origin: ORIGIN, 'Content-Type': 'application/json' }, body: JSON.stringify({ jd: 'monitor probe' }) })
    if (res.status !== 400 || !text.includes('too_short')) throw new Error(`expected 400 too_short, got HTTP ${res.status} ${text.slice(0, 120)}`)
    return 'OK'
  }],
]

const results = []
for (const [name, run] of checks) {
  try {
    results.push({ name, ok: true, detail: await run() })
  } catch (err) {
    results.push({ name, ok: false, detail: err.message || String(err) })
  }
}

const failed = results.filter(r => !r.ok)
const md = [
  failed.length ? `**${failed.length} of ${results.length} checks failing**` : `**All ${results.length} checks passing**`,
  '',
  '| Check | Status | Detail |',
  '|---|---|---|',
  ...results.map(r => `| ${r.name} | ${r.ok ? '✅' : '❌'} | ${r.detail.replace(/\|/g, '\\|')} |`),
  '',
  `Checked ${new Date().toISOString()} · site ${SITE} · worker ${SCOUT}`,
].join('\n')

writeFileSync(REPORT, md)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n')
console.log(md)
process.exit(failed.length ? 1 : 0)
