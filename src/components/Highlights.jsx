import { useState } from 'react'
import { projects, projectFilters } from '../data/content'

// Renders "**bold** rest" without dangerouslySetInnerHTML.
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') ? <b key={i}>{part.slice(2, -2)}</b> : part,
  )
}

const initials = title => title.split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).map(w => w[0]).join('').slice(0, 3)

export default function Highlights() {
  const [filter, setFilter] = useState('all')
  return (
    <section id="highlights">
      <div className="wrap">
        <div className="eyebrow rv">Projects</div>
        <h2 className="title rv">Season highlights</h2>
        <p className="sub rv">Filter by the role you&apos;re hiring for.</p>
        <div className="filters rv" role="group" aria-label="Filter projects by role">
          {projectFilters.map(f => (
            <button key={f.id} type="button" className={filter === f.id ? 'on' : undefined} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="hl-grid">
          {projects.map(p => (
            <article key={p.title} className={`panel hl${filter !== 'all' && !p.roles.includes(filter) ? ' hide' : ''}`}>
              <div className="thumb">
                <div className="gen" style={{ '--c': p.tint }} aria-hidden="true">{initials(p.title)}</div>
                <div className="tags">{p.roles.map(r => <span key={r}>{r}</span>)}</div>
              </div>
              <div className="bd">
                <small className="ev">{p.event}</small>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="result"><Rich text={p.result} /></div>
                <div className="meta">
                  <span>{p.stack}</span>
                  <a href={p.code} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} source code on GitHub`}>Code ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
