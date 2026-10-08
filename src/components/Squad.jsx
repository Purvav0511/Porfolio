import { useState } from 'react'
import { squad, squadLines } from '../data/content'
import { MiniCard } from './PlayerCard'

export default function Squad() {
  const [selected, setSelected] = useState(0)
  const s = squad[selected]
  return (
    <section id="squad">
      <div className="wrap">
        <div className="eyebrow rv">Experience</div>
        <h2 className="title rv">The squad</h2>
        <p className="sub rv">Every club I&apos;ve played for, newest at the front, with the academy behind. Select a card to read the report.</p>
        <div className="squad">
          <div className="panel board rv">
            <svg className="lines" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="#fff" strokeWidth=".25">
              <rect x="2" y="2" width="96" height="66" /><line x1="2" y1="35" x2="98" y2="35" /><circle cx="50" cy="35" r="8" />
              <rect x="30" y="2" width="40" height="11" /><rect x="30" y="57" width="40" height="11" />
            </svg>
            <div className="formation">
              {squadLines.map(line => (
                <div key={line.id} style={{ display: 'contents' }}>
                  <div className="lbl">{line.label}</div>
                  <div className="row">
                    {squad.map((item, i) => item.line === line.id && (
                      <MiniCard key={item.co} item={item} selected={i === selected} onSelect={() => setSelected(i)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel detail rv" aria-live="polite">
            <div className="when">{s.when}</div>
            <h3>{s.title}</h3>
            <div className="co">{s.org}</div>
            <ul>{s.points.map(p => <li key={p}>{p}</li>)}</ul>
            <div className="chips">{s.stack.map(x => <span key={x}>{x}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
