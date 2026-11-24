import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM, REPORT_SCHEMA } from './prompt.js'

export { Budget } from './budget.js'

const MIN_CHARS = 80
const MAX_CHARS = 15000
const DEFAULT_DAILY_LIMIT = 150
const DEFAULT_PER_VISITOR_DAILY_LIMIT = 10

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || ''
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
  if (!allowed.includes(origin)) return null
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
  })
}

const model = env => env.MODEL || 'claude-opus-5-5'
const dailyLimit = env => Number(env.DAILY_LIMIT) || DEFAULT_DAILY_LIMIT
const perVisitorLimit = env => Number(env.PER_VISITOR_DAILY_LIMIT) || DEFAULT_PER_VISITOR_DAILY_LIMIT
const budget = env => env.BUDGET.get(env.BUDGET.idFromName('global'))

async function hashVisitor(ip, env) {
  const data = new TextEncoder().encode(`${env.VISITOR_SALT || 'purvav-scout'}:${ip}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(digest)].slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('')
}

// Daily caps on paid Claude calls: a global one so a script forging the Origin header can't run up
// the bill, and a per-visitor one so a single client can't use up the global cap for everyone.
// Returns null when the call may proceed, or 'global' / 'visitor' naming the cap that was hit.
async function takeBudget(env, ip) {
  const res = await budget(env).fetch('https://budget/take', {
    method: 'POST',
    body: JSON.stringify({ visitor: await hashVisitor(ip, env), limit: dailyLimit(env), perVisitor: perVisitorLimit(env) }),
  })
  return (await res.json()).denied
}

async function budgetUsage(env) {
  const { used } = await (await budget(env).fetch('https://budget/usage')).json()
  return { used, limit: dailyLimit(env) }
}

async function scout(jd, env) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1 })
  const response = await client.beta.messages.create({
    model: model(env),
    max_tokens: 16000,
    // Re-runs a safety-declined request on Anthropic's recommended fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: REPORT_SCHEMA },
    },
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `<job_description>\n${jd}\n</job_description>` }],
  })

  if (response.stop_reason === 'refusal') return { error: 'refused' }
  if (response.stop_reason === 'max_tokens') return { error: 'truncated' }

  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('')
  return { report: JSON.parse(text) }
}

// Free liveness check for the monitor: looking up the model validates the API key and the model ID
// without generating tokens, so it catches expired keys and retired models at no cost.
async function health(env) {
  if (!env.ANTHROPIC_API_KEY) return json({ ok: false, reason: 'not_configured' }, 503)
  const { success } = await env.HEALTH_LIMITER.limit({ key: 'all' })
  if (!success) return json({ ok: false, reason: 'rate_limited' }, 429)

  const usage = await budgetUsage(env)
  try {
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1 })
    await client.models.retrieve(model(env))
    return json({ ok: true, model: model(env), budget: usage }, 200)
  } catch (err) {
    const reason = err instanceof Anthropic.AuthenticationError ? 'invalid_api_key'
      : err instanceof Anthropic.PermissionDeniedError ? 'permission_denied'
        : err instanceof Anthropic.NotFoundError ? 'model_not_found'
          : 'upstream'
    console.error('Health check failed', reason, err?.status)
    return json({ ok: false, reason, status: err?.status ?? null, model: model(env), budget: usage }, 503)
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/health' && request.method === 'GET') return health(env)

    const cors = corsHeaders(request, env)
    if (request.method === 'OPTIONS') {
      return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 })
    }
    if (url.pathname !== '/scout' || request.method !== 'POST') return json({ error: 'not_found' }, 404, cors || {})
    if (!cors) return json({ error: 'origin_not_allowed' }, 403)
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503, cors)

    // Validate before rate-limiting, so a malformed paste doesn't cost the visitor a request.
    let jd
    try {
      jd = String((await request.json()).jd || '').trim()
    } catch {
      return json({ error: 'bad_request' }, 400, cors)
    }
    if (jd.length < MIN_CHARS) return json({ error: 'too_short' }, 400, cors)
    if (jd.length > MAX_CHARS) return json({ error: 'too_long' }, 400, cors)

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const perIp = await env.PER_IP_LIMITER.limit({ key: ip })
    const global = await env.GLOBAL_LIMITER.limit({ key: 'all' })
    if (!perIp.success || !global.success) return json({ error: 'rate_limited' }, 429, cors)
    const denied = await takeBudget(env, ip)
    if (denied) return json({ error: denied === 'global' ? 'budget_exhausted' : 'visitor_daily_limit' }, 429, cors)

    try {
      const result = await scout(jd, env)
      if (result.error) return json({ error: result.error }, 422, cors)
      return json(result, 200, cors)
    } catch (err) {
      if (err instanceof Anthropic.RateLimitError) return json({ error: 'busy' }, 503, cors)
      if (err instanceof Anthropic.APIError) {
        console.error('Claude API error', err.status)
        return json({ error: 'upstream' }, 502, cors)
      }
      if (err instanceof SyntaxError) {
        console.error('Report was not valid JSON')
        return json({ error: 'upstream' }, 502, cors)
      }
      console.error('Unexpected scout error', err?.name)
      return json({ error: 'upstream' }, 500, cors)
    }
  },
}
