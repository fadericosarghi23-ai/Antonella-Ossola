import { useEffect, useState } from 'react'
import { CRINALE } from '@/components/brand/Logo'

/*
  Animazione d'apertura della Home (parte del momento dell'hero, 800ms in tutto):
  - 0 a 450ms: su un sipario verde bosco si traccia il crinale del marchio e compare il sole;
  - 450 a 800ms: il sipario si alza e scopre le chiome.
  Non è un preloader: niente percentuali o contatori, non aspetta il caricamento.
  Parte solo alla prima apertura della sessione, solo sulla Home, mai con prefers-reduced-motion.
  Animazioni in CSS (index.css, sezione "Apertura").
*/

const CHIAVE = 'ao-apertura-vista'

function deveMostrare() {
  if (typeof window === 'undefined') return false
  if (window.location.pathname !== '/') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    if (window.sessionStorage.getItem(CHIAVE)) return false
    window.sessionStorage.setItem(CHIAVE, '1')
  } catch {
    // storage non disponibile: l'apertura si mostra comunque una volta per caricamento
  }
  return true
}

export function Apertura() {
  const [visibile, setVisibile] = useState(deveMostrare)

  useEffect(() => {
    if (!visibile) return
    const t = window.setTimeout(() => setVisibile(false), 850)
    return () => window.clearTimeout(t)
  }, [visibile])

  if (!visibile) return null
  return (
    <div aria-hidden="true" className="apertura fixed inset-0 z-[100] flex items-center justify-center bg-bosco">
      <svg viewBox="0 0 92 44" className="apertura-segno w-40 text-carta md:w-56">
        <circle cx="70" cy="9" r="4.2" fill="var(--castagno)" />
        <path d={CRINALE} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
