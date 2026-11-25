# Scout Worker

Cloudflare Worker behind the portfolio's "Scout me for your role" section. It takes a pasted job description and returns a structured scouting report written by Claude: matched requirements with evidence, honest gaps, and interview questions.

- `src/profile.js` is the scout's only source of facts. Update it alongside `src/data/content.js` and the résumé.
- `src/prompt.js` holds the system prompt and the JSON schema for the report.
- Requests are limited to the site's origin, size-checked, rate-limited per visitor and globally, and capped per UTC day at `DAILY_LIMIT` paid reports overall and `PER_VISITOR_DAILY_LIMIT` per visitor. The counters live in the `Budget` Durable Object (`src/budget.js`), which is atomic, so the caps hold under bursts; visitor IPs are stored only as hashes and cleared daily. The API key lives in a Worker secret.
- `GET /health` checks the API key and model by looking up the model, which spends no tokens. The repo's Monitor workflow calls it every 30 minutes.

## Setup

```bash
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

## Tests and deploys

`npm test` runs offline unit tests with the Claude API stubbed. `npm run check` bundles the Worker without uploading it. CI runs both on every PR, and `.github/workflows/deploy-worker.yml` deploys on merge to main once the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets are set.

## Evaluation

`evals/cases.json` holds 10 job descriptions with expected verdicts, required matches and gaps, and skills that must never be claimed. Each run makes one paid Claude call per case.

```bash
SCOUT_URL=https://purvav-scout.purvavpunyani.workers.dev npm run eval
```
