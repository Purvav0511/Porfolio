import { navLinks, profile } from '../data/content'
import { useScrollState } from '../hooks/usePageEffects'

const sectionIds = navLinks.map(l => l.id)

export default function Header() {
  const { solid, active } = useScrollState(sectionIds)
  return (
    <header className={solid ? 'solid' : undefined}>
      <div className="wrap">
        <a href="#hero" className="brand"><span className="crest">{profile.initials}</span><span>{profile.first}</span></a>
        <nav className="links" aria-label="Sections">
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'on' : undefined}>{l.label}</a>
          ))}
        </nav>
        <a className="btn gold" href="#contact">Hire me</a>
      </div>
    </header>
  )
}
