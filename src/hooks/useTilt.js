import { useEffect } from 'react'

// Tilts a player card toward the pointer and moves its holographic shine.
export function useTilt(ref, max = 20) {
  useEffect(() => {
    const card = ref.current
    if (!card) return
    const set = (k, v) => card.style.setProperty(k, v)
    const move = e => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      card.classList.add('live')
      set('--ry', `${(px - 0.5) * max}deg`)
      set('--rx', `${(0.5 - py) * max}deg`)
      set('--mx', `${px * 100}%`)
      set('--my', `${py * 100}%`)
      set('--hover', 1)
    }
    const leave = () => {
      card.classList.remove('live')
      set('--rx', '0deg')
      set('--ry', '0deg')
      set('--mx', '50%')
      set('--my', '50%')
      set('--hover', 0)
    }
    card.addEventListener('pointermove', move)
    card.addEventListener('pointerleave', leave)
    card.addEventListener('pointercancel', leave)
    return () => {
      card.removeEventListener('pointermove', move)
      card.removeEventListener('pointerleave', leave)
      card.removeEventListener('pointercancel', leave)
    }
  }, [ref, max])
}
