import { useRef } from 'react'
import { useTilt } from '../hooks/useTilt'
import { profile, cardStats } from '../data/content'
import portrait from '../assets/purvav.webp'

// Shared card layers: metal rim, body, inner rim, then content, foil and shine on top.
function Face({ children, className = 'face', shine = true }) {
  return (
    <div className={className}>
      <div className="rim cut" />
      <div className="body cut" />
      <div className="inner-rim cut" />
      <div className="content">{children}</div>
      <div className="foil cut" />
      {shine && <div className="shine cut" />}
    </div>
  )
}

function activate(handler) {
  return {
    onClick: handler,
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handler()
      }
    },
  }
}

export function HeroCard({ onActivate }) {
  const ref = useRef(null)
  useTilt(ref, 22)
  return (
    <div
      ref={ref}
      className="pcard hero-card tier-gold intro"
      role="button"
      tabIndex={0}
      aria-label={`Player card: ${profile.first} ${profile.last}. Opens the professional summary.`}
      onAnimationEnd={e => e.currentTarget.classList.remove('intro')}
      {...activate(onActivate)}
    >
      <Face>
        <div className="pc-top">
          <div className="pc-pos"><b className="metal-text">{profile.primaryRole}</b><span>{profile.secondaryRoles}</span></div>
          <div className="pc-crest">{profile.initials}</div>
        </div>
        <div className="pc-photo">
          <img src={portrait} alt="" width="880" height="688" decoding="async" />
        </div>
        <div className="pc-name"><span>{profile.first}</span><b className="metal-text">{profile.last}</b></div>
        <div className="pc-divider" />
        <div className="pc-stats">
          {cardStats.map(s => (
            <div key={s.label}><b className="metal-text">{s.value}</b><span>{s.label}</span></div>
          ))}
        </div>
        <div className="pc-unit">Years of experience</div>
        <div className="pc-foot"><span className="dot" />Open to work</div>
      </Face>
      <Face className="back" shine={false}>
        <div className="pc-crest">{profile.initials}</div>
      </Face>
    </div>
  )
}

export function MiniCard({ item, selected, onSelect }) {
  const ref = useRef(null)
  useTilt(ref, 14)
  return (
    <div
      ref={ref}
      className={`pcard mini tier-${item.tier}${selected ? ' sel' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${item.co}: ${item.role}`}
      {...activate(onSelect)}
    >
      <Face>
        <div className="pc-top">
          <div className="pc-pos">
            <b className="metal-text" style={item.pos.length > 3 ? { fontSize: 'calc(var(--w) * .13)' } : undefined}>{item.pos}</b>
            <span>{item.sub}</span>
          </div>
        </div>
        <div className="logo">
          {item.logo
            ? <span><img src={item.logo} alt="" loading="lazy" /></span>
            : <span className="mono">{item.mono}</span>}
        </div>
        <div className="pc-name">
          <b className="metal-text" style={item.co.length > 9 ? { fontSize: 'calc(var(--w) * .1)' } : undefined}>{item.co}</b>
          <span>{item.role}</span>
        </div>
        <div className="pc-foot">{item.foot}</div>
      </Face>
    </div>
  )
}
