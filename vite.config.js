import { createHash } from 'node:crypto'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Adds a Content-Security-Policy to the built page. GitHub Pages can't send response headers,
// so the policy ships as a <meta> tag. Inline scripts are allowed by hash, computed from the final
// HTML so the policy stays correct when index.html changes. Dev builds skip it (HMR needs inline code).
function contentSecurityPolicy(scoutUrl) {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
          .map(([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`)
        const policy = [
          "default-src 'self'",
          `script-src 'self' ${hashes.join(' ')}`.trim(),
          "style-src 'self' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob:",
          `connect-src 'self' ${new URL(scoutUrl).origin} https://api.emailjs.com`,
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
        return html.replace(/<meta charset="UTF-8" \/>/, m => `${m}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`)
      },
    },
  }
}

// Served from https://purvav0511.github.io/Porfolio/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  if (command === 'build' && !env.VITE_SCOUT_URL) {
    throw new Error('VITE_SCOUT_URL is not set. The Scout section would be broken. Set it in .env.production.')
  }
  return {
    plugins: [react(), command === 'build' && contentSecurityPolicy(env.VITE_SCOUT_URL)].filter(Boolean),
    base: '/Porfolio/',
  }
})
