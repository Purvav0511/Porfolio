// Unit tests for the Worker. Claude API calls are stubbed by replacing global fetch, so these
// run offline and never spend credits. Run with `npm test`.
import { test, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import worker, { Budget } from '../src/index.js'

const SITE = 'https://purvav0511.github.io'
const JD = 'Data Engineer. Build batch pipelines in Python and SQL on AWS with Airflow, partner with analysts, own data quality.'
const REPORT = { is_job_description: true, verdict: 'Good fit', role_title: 'Data Engineer', headline: 'h', matches: [], gaps: [], talking_points: [] }

const realFetch = globalThis.fetch
let claudeCalls

function limiter(allow = true) {
  return { limit: async () => ({ success: allow }) }
}
// In-memory stand-in for Durable Object storage, driving the real Budget class.
function doStorage() {
  const store = new Map()
  let alarm = null
  return {
    store,
    get: async k => store.get(k),
    put: async entries => { for (const [k, v] of Object.entries(entries)) store.set(k, v) },
    list: async () => new Map(store),
    delete: async keys => { for (const k of keys) store.delete(k) },
    getAlarm: async () => alarm,
    setAlarm: async t => { alarm = t },
  }
}
function budgetNamespace() {
  const storage = doStorage()
  const instance = new Budget({ storage })
  return { storage, instance, idFromName: name => name, get: () => ({ fetch: (url, init) => instance.fetch(new Request(url, init)) }) }
}
function env(overrides = {}) {
  return {
    ANTHROPIC_API_KEY: 'test-key',
    ALLOWED_ORIGINS: `${SITE},http://localhost:5173`,
    MODEL: 'claude-opus-5-5',
    DAILY_LIMIT: '3',
    PER_VISITOR_DAILY_LIMIT: '2',
    PER_IP_LIMITER: limiter(),
    GLOBAL_LIMITER: limiter(),
    HEALTH_LIMITER: limiter(),
    BUDGET: budgetNamespace(),
    ...overrides,
  }
}
// Stub the Anthropic API: `respond(url, init)` returns [status, body].
function stubClaude(respond) {
  globalThis.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input.url
    claudeCalls.push(url)
    const [status, body] = respond(url, init)
    return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
  }
}
const messageOk = () => [200, {
  id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5-5', stop_reason: 'end_turn',
  content: [{ type: 'text', text: JSON.stringify(REPORT) }], usage: { input_tokens: 1, output_tokens: 1 },
}]
const apiError = (status, type) => [status, { type: 'error', error: { type, message: type } }]

const scoutReq = (body = { jd: JD }, origin = SITE, ip = '203.0.113.7') => new Request('https://w.dev/scout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': ip, ...(origin ? { Origin: origin } : {}) },
  body: typeof body === 'string' ? body : JSON.stringify(body),
})
const call = async (req, e = env()) => {
  const res = await worker.fetch(req, e)
  return { status: res.status, headers: res.headers, body: res.status === 204 ? null : await res.json() }
}

beforeEach(() => { claudeCalls = []; stubClaude(messageOk) })
afterEach(() => { globalThis.fetch = realFetch })

test('returns a report for a valid request from the site', async () => {
  const r = await call(scoutReq())
  assert.equal(r.status, 200)
  assert.deepEqual(r.body.report, REPORT)
  assert.equal(r.headers.get('Access-Control-Allow-Origin'), SITE)
})

test('CORS preflight is allowed only for the site origins', async () => {
  const ok = await worker.fetch(new Request('https://w.dev/scout', { method: 'OPTIONS', headers: { Origin: SITE } }), env())
  assert.equal(ok.status, 204)
  const bad = await worker.fetch(new Request('https://w.dev/scout', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }), env())
  assert.equal(bad.status, 403)
})

test('rejects other origins and missing origin without calling Claude', async () => {
  assert.equal((await call(scoutReq(undefined, 'https://evil.example'))).status, 403)
  assert.equal((await call(scoutReq(undefined, null))).status, 403)
  assert.equal(claudeCalls.length, 0)
})

test('validates input before spending rate limit or budget', async () => {
  let limited = 0
  const counting = { limit: async () => { limited++; return { success: true } } }
  const e = env({ PER_IP_LIMITER: counting })
  assert.equal((await call(scoutReq({ jd: 'too short' }), e)).body.error, 'too_short')
  assert.equal((await call(scoutReq({ jd: 'x'.repeat(15001) }), e)).body.error, 'too_long')
  assert.equal((await call(scoutReq('{not json'), e)).body.error, 'bad_request')
  assert.equal(limited, 0)
  assert.equal(e.BUDGET.storage.store.size, 0)
  assert.equal(claudeCalls.length, 0)
})

test('rate limits per visitor and globally', async () => {
  assert.equal((await call(scoutReq(), env({ PER_IP_LIMITER: limiter(false) }))).status, 429)
  assert.equal((await call(scoutReq(), env({ GLOBAL_LIMITER: limiter(false) }))).status, 429)
  assert.equal(claudeCalls.length, 0)
})

test('caps paid calls per visitor per day', async () => {
  const e = env()
  for (let i = 0; i < 2; i++) assert.equal((await call(scoutReq(), e)).status, 200)
  const r = await call(scoutReq(), e)
  assert.equal(r.status, 429)
  assert.equal(r.body.error, 'visitor_daily_limit')
  // A different visitor is unaffected.
  assert.equal((await call(scoutReq(undefined, SITE, '198.51.100.9'), e)).status, 200)
  assert.equal(claudeCalls.length, 3)
})

test('stops calling Claude once the global daily budget is spent', async () => {
  const e = env()
  const ips = ['192.0.2.1', '192.0.2.2', '192.0.2.3', '192.0.2.4']
  for (const ip of ips.slice(0, 3)) assert.equal((await call(scoutReq(undefined, SITE, ip), e)).status, 200)
  const r = await call(scoutReq(undefined, SITE, ips[3]), e)
  assert.equal(r.status, 429)
  assert.equal(r.body.error, 'budget_exhausted')
  assert.equal(claudeCalls.length, 3)
})

test('budget is atomic under concurrent requests', async () => {
  const e = env({ PER_VISITOR_DAILY_LIMIT: '100' })
  const results = await Promise.all(Array.from({ length: 10 }, (_, i) => call(scoutReq(undefined, SITE, `192.0.2.${i}`), e)))
  assert.equal(results.filter(r => r.status === 200).length, 3)
  assert.equal(claudeCalls.length, 3)
})

test('budget stores hashed visitors only, and its alarm clears past days', async () => {
  const e = env()
  await call(scoutReq(), e)
  const keys = [...e.BUDGET.storage.store.keys()]
  assert.ok(keys.every(k => !k.includes('203.0.113.7')))
  e.BUDGET.storage.store.set('g:2000-01-01', 99)
  e.BUDGET.storage.store.set('v:2000-01-01:abc', 5)
  await e.BUDGET.instance.alarm()
  assert.deepEqual([...e.BUDGET.storage.store.keys()].sort(), keys.sort())
})

test('reports not_configured when the API key secret is missing', async () => {
  assert.equal((await call(scoutReq(), env({ ANTHROPIC_API_KEY: undefined }))).body.error, 'not_configured')
})

test('maps Claude API failures to safe error codes', async () => {
  stubClaude(() => apiError(401, 'authentication_error'))
  assert.deepEqual((await call(scoutReq())).body, { error: 'upstream' })
  stubClaude(() => apiError(429, 'rate_limit_error'))
  assert.deepEqual((await call(scoutReq())).body, { error: 'busy' })
})

test('handles refusals, truncation and invalid JSON from the model', async () => {
  stubClaude(() => { const [s, b] = messageOk(); return [s, { ...b, stop_reason: 'refusal' }] })
  assert.equal((await call(scoutReq())).body.error, 'refused')
  stubClaude(() => { const [s, b] = messageOk(); return [s, { ...b, stop_reason: 'max_tokens' }] })
  assert.equal((await call(scoutReq())).body.error, 'truncated')
  stubClaude(() => { const [s, b] = messageOk(); return [s, { ...b, content: [{ type: 'text', text: '{oops' }] }] })
  assert.equal((await call(scoutReq())).status, 502)
})

test('unknown routes return 404', async () => {
  assert.equal((await call(new Request('https://w.dev/other', { headers: { Origin: SITE } }))).status, 404)
  assert.equal((await call(new Request('https://w.dev/scout', { headers: { Origin: SITE } }))).status, 404)
})

test('/health is ok when the key and model are valid, and spends no tokens', async () => {
  stubClaude(url => (url.includes('/v1/models/') ? [200, { id: 'claude-opus-5-5', type: 'model' }] : [500, {}]))
  const r = await call(new Request('https://w.dev/health'))
  assert.equal(r.status, 200)
  assert.equal(r.body.ok, true)
  assert.deepEqual(r.body.budget, { used: 0, limit: 3 })
  assert.ok(claudeCalls.every(u => !u.includes('/v1/messages')))
})

test('/health names the failure: expired key, retired model, missing secret', async () => {
  stubClaude(() => apiError(401, 'authentication_error'))
  let r = await call(new Request('https://w.dev/health'))
  assert.equal(r.status, 503)
  assert.equal(r.body.reason, 'invalid_api_key')

  stubClaude(() => apiError(404, 'not_found_error'))
  r = await call(new Request('https://w.dev/health'))
  assert.equal(r.body.reason, 'model_not_found')

  r = await call(new Request('https://w.dev/health'), env({ ANTHROPIC_API_KEY: undefined }))
  assert.equal(r.body.reason, 'not_configured')
})

test('/health is rate limited', async () => {
  const r = await call(new Request('https://w.dev/health'), env({ HEALTH_LIMITER: limiter(false) }))
  assert.equal(r.status, 429)
  assert.equal(claudeCalls.length, 0)
})
