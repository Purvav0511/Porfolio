import { useEffect, useRef } from 'react'

// Loads Three.js after first paint so the page content never waits on WebGL.
export default function PitchBackground() {
  const ref = useRef(null)
  useEffect(() => {
    let dispose
    let cancelled = false
    import('../three/pitchScene').then(({ createPitchScene }) => {
      if (cancelled || !ref.current) return
      try {
        dispose = createPitchScene(ref.current)
      } catch {
        // No WebGL: the dark background still works without the stadium.
      }
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])
  return (
    <>
      <canvas id="bg" ref={ref} aria-hidden="true" />
      <div className="veil" />
    </>
  )
}
