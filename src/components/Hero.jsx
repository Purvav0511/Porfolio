import { profile } from '../data/content'
import { HeroCard } from './PlayerCard'

export default function Hero() {
  const toSummary = () => document.getElementById('summary')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <div className="wrap hero" id="hero">
      <div>
        <div className="eyebrow">Software · Data · ML Engineer</div>
        <h1>{profile.first} <span>{profile.last}</span></h1>
        <div className="roles">{profile.roles.map(r => <span key={r}>{r}</span>)}</div>
        <p className="lede">{profile.lede}</p>
        <div className="cta">
          <a className="btn gold" href={profile.resume} download>Download résumé</a>
          <a className="btn" href="#contact">Get in touch</a>
        </div>
        <div className="status"><span className="dot" />{profile.status}</div>
      </div>

      <div className="card-stage">
        <div className="aura" />
        <div className="flare" />
        <div className="float"><HeroCard onActivate={toSummary} /></div>
        <div className="tap-hint" aria-hidden="true">Tap the card</div>
      </div>
    </div>
  )
}
