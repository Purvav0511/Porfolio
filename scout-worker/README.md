# Scout Worker

Cloudflare Worker behind the portfolio's "Scout me for your role" section. It takes a pasted job description and returns a structured scouting report written by Claude: matched requirements with evidence, honest gaps, and interview questions.

- `src/profile.js` is the scout's only source of facts. Update it alongside `src/data/content.js` and the résumé.
- `src/prompt.js` holds the system prompt and the JSON schema for the report.
- Requests are limited to the site's origin, rate-limited per visitor and globally, and size-checked. The API key lives in a Worker secret.

## Setup

```bash
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler deploy
```

## Evaluation

`evals/cases.json` holds 10 job descriptions with expected verdicts, required matches and gaps, and skills that must never be claimed. Each run makes one paid Claude call per case.

```bash
SCOUT_URL=https://purvav-scout.purvavpunyani.workers.dev npm run eval
```
