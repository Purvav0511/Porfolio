import { profile, resumeFacts } from '../data/content'

const sections = [[100, 85, 70], [100, 90, 60, 80], [75, 100, 50], [88, 66]]

export default function Resume() {
  return (
    <section id="resume">
      <div className="wrap">
        <div className="eyebrow rv">The paperwork</div>
        <h2 className="title rv">Résumé</h2>
        <div className="panel resume rv">
          <div className="paper" aria-hidden="true">
            <div className="n">{profile.first} {profile.last}</div>
            <div className="r">Software Engineer · Leidos</div>
            {sections.map((lines, i) => (
              <div key={i}>
                <div className="h" />
                {lines.map((w, j) => <div key={j} className="l" style={{ width: `${w}%` }} />)}
              </div>
            ))}
          </div>
          <div>
            <h3>One page.<br /><span className="metal-text">Everything that matters.</span></h3>
            <p>Leidos, GreenPortfolio, HighRadius, and Grroom, plus projects, skills, and education, in a one-page, ATS-readable PDF.</p>
            <div className="facts">
              {resumeFacts.map(f => <div key={f.label}><b className="metal-text">{f.value}</b><span>{f.label}</span></div>)}
            </div>
            <div className="acts">
              <a className="btn gold" href={profile.resume} download>Download PDF</a>
              <a className="btn" href={profile.resume} target="_blank" rel="noopener noreferrer">View in browser</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
