# Purvav Punyani · Portfolio

Personal portfolio for Software, Data, and ML Engineering roles. Live at **https://purvav0511.github.io/Porfolio/**

A night-time football stadium rendered in Three.js sits behind the page. The camera moves between angles as you scroll, and experience is presented as a squad of player cards.

## Stack

- **React 18** + **Vite 5**
- **Three.js** — custom shader for the pitch markings, floodlights, and camera rig, lazy-loaded after first paint
- **EmailJS** for the contact form
- Plain CSS with design tokens, no UI framework
- Deployed to **GitHub Pages** by GitHub Actions on every push to `main`

## Editing content

All copy lives in [`src/data/content.js`](src/data/content.js): profile, card stats, summary, experience, projects, and links. The résumé is served from `public/resume.pdf`.

## Development

```bash
npm install
npm run dev      # http://localhost:5173/Porfolio/
npm run lint
npm run build
```
