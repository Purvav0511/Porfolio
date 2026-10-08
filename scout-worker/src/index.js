import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM, REPORT_SCHEMA } from './prompt.js'

const MIN_CHARS = 80
const MAX_CHARS = 15000

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

function json(body, status, cors) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors } })
}

async function scout(jd, env) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1 })
  const response = await client.beta.messages.create({
    model: env.MODEL || 'claude-opus-5-5',
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

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 })
    }
    if (url.pathname !== '/scout' || request.method !== 'POST') return json({ error: 'not_found' }, 404, cors || {})
    if (!cors) return json({ error: 'origin_not_allowed' }, 403, {})
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503, cors)

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const perIp = await env.PER_IP_LIMITER.limit({ key: ip })
    const global = await env.GLOBAL_LIMITER.limit({ key: 'all' })
    if (!perIp.success || !global.success) return json({ error: 'rate_limited' }, 429, cors)

    let jd
    try {
      jd = String((await request.json()).jd || '').trim()
    } catch {
      return json({ error: 'bad_request' }, 400, cors)
    }
    if (jd.length < MIN_CHARS) return json({ error: 'too_short' }, 400, cors)
    if (jd.length > MAX_CHARS) return json({ error: 'too_long' }, 400, cors)

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
