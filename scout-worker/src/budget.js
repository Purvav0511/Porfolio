// Durable Object that counts paid Claude calls per UTC day, globally and per visitor.
// A single instance serves every request, and Durable Objects run one request at a time with
// storage reads and writes kept in order, so check-and-increment is atomic: the cap holds even
// under a distributed burst (unlike KV, which is eventually consistent).
// Visitor IPs are stored only as salted SHA-256 hashes, and old days are deleted by a daily alarm.
// Uses the fetch interface (not RPC) so it imports nothing Cloudflare-specific and runs under Node tests.

const today = () => new Date().toISOString().slice(0, 10)
const nextMidnight = () => {
  const d = new Date()
  d.setUTCHours(24, 0, 30, 0)
  return d.getTime()
}

export class Budget {
  constructor(state) {
    this.storage = state.storage
  }

  async fetch(request) {
    const url = new URL(request.url)
    const day = today()
    const globalKey = `g:${day}`

    if (url.pathname === '/usage') {
      return Response.json({ used: (await this.storage.get(globalKey)) || 0 })
    }

    if (url.pathname === '/take' && request.method === 'POST') {
      const { visitor, limit, perVisitor } = await request.json()
      const visitorKey = `v:${day}:${visitor}`
      const used = (await this.storage.get(globalKey)) || 0
      const mine = (await this.storage.get(visitorKey)) || 0
      if (used >= limit) return Response.json({ denied: 'global' })
      if (mine >= perVisitor) return Response.json({ denied: 'visitor' })
      await this.storage.put({ [globalKey]: used + 1, [visitorKey]: mine + 1 })
      if (!(await this.storage.getAlarm())) await this.storage.setAlarm(nextMidnight())
      return Response.json({ denied: null, used: used + 1 })
    }

    return new Response('not found', { status: 404 })
  }

  // Drops every counter that isn't today's.
  async alarm() {
    const day = today()
    const stale = [...(await this.storage.list()).keys()].filter(k => !k.includes(`:${day}`))
    while (stale.length) await this.storage.delete(stale.splice(0, 128))
  }
}
