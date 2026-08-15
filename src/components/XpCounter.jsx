import { useEffect, useRef, useState } from 'react'

// Compteur qui fait défiler les chiffres jusqu'à la valeur cible.
// Un nombre qui saute de 0 à 45 se lit mal ; un nombre qui défile
// se comprend sans réfléchir : « j'ai gagné quelque chose ».
export default function XpCounter({ value, duration = 900, className = '' }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    // Respecte le réglage système « réduire les animations »
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setDisplay(value); return }

    const start = performance.now()
    const from = 0

    function tick(now) {
      const elapsed = now - start
      const ratio = Math.min(elapsed / duration, 1)
      // ease-out : rapide au début, ralentit à l'arrivée
      const eased = 1 - Math.pow(1 - ratio, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (ratio < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return <span className={`xp-counter ${className}`}>+{display}</span>
}
