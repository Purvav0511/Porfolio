import { summary, strengths } from '../data/content'
import { Icon } from './Icons'

export default function Summary() {
  return (
    <section id="summary">
      <div className="wrap">
        <div className="eyebrow rv">Scouting report</div>
        <h2 className="title rv">Professional summary</h2>
        <div className="summary-grid">
          <div className="panel summary-text rv">
            <p>{summary.lead}</p>
            <p>{summary.more}</p>
            <div className="targets">
              {summary.targets.map(t => (
                <div key={t.code}><b className="metal-text">{t.code}</b><span>{t.text}</span></div>
              ))}
            </div>
          </div>
          <div className="panel strengths rv">
            <h3>Signature strengths</h3>
            {strengths.map(s => (
              <div className="trait" key={s.title}>
                <span className="ic"><Icon name={s.icon} /></span>
                <div><b>{s.title}</b><span>{s.text}</span></div>
                <em>{s.role}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
