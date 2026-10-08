import { useEffect, useState } from 'react'

// Fades in every `.rv` element once it scrolls into view.
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    document.querySelectorAll('.rv').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// Tracks scroll position for the header background and the active nav link.
export function useScrollState(sectionIds) {
  const [state, setState] = useState({ solid: false, active: null })
  useEffect(() => {
    const update = () => {
      const y = window.scrollY + window.innerHeight * 0.35
      let active = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) active = id
      }
      setState(s => (s.solid === window.scrollY > 40 && s.active === active ? s : { solid: window.scrollY > 40, active }))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [sectionIds])
  return state
}
