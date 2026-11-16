import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
  Entrate allo scroll, in CSS (non dipendono da requestAnimationFrame):
  - opacità + 16px, 600ms, ease-out, una sola volta; nelle sequenze 80ms per elemento, massimo sei;
  - il contenuto è nascosto solo se <html> ha la classe "reveal-ready" (impostata in main.tsx) e solo
    da 768px in su senza preferenza di movimento ridotto (regole in index.css, sezione "Entrate");
  - rete di sicurezza: dopo 2,5s tutto ciò che è già sopra il bordo inferiore dello schermo viene mostrato,
    anche se il browser ha rallentato l'osservatore (schede in background, risparmio energetico);
  - i titoli entrano come blocco con il loro testo; la scala si applica solo alle immagini (RevealImage).
*/

/** Ritardo per l'elemento i di una sequenza: 80ms ciascuno, tetto a sei elementi. */
export const stagger = (i: number) => Math.min(i, 5) * 0.08

let observer: IntersectionObserver | null = null
function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          observer?.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  )
  return observer
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = getObserver()
    if (!io) {
      el.classList.add('is-in')
      return
    }
    io.observe(el)
    const t = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('is-in')
        io.unobserve(el)
      }
    }, 2500)
    return () => {
      window.clearTimeout(t)
      io.unobserve(el)
    }
  }, [])
  return ref
}

const delayStyle = (delay: number) => (delay ? ({ '--reveal-delay': `${delay}s` } as CSSProperties) : undefined)

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-reveal="" className={className} style={delayStyle(delay)}>
      {children}
    </div>
  )
}

/** Entrata per le foto: dissolvenza e rientro di scala dentro la cornice (solo immagini, mai testo). */
export function RevealImage({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-reveal="" data-reveal-img="" className={cn('overflow-hidden', className)} style={delayStyle(delay)}>
      <div className="h-full w-full">{children}</div>
    </div>
  )
}

/** Curve di livello decorative che si tracciano all'ingresso (fascia finale). Solo SVG, mai testo. */
export function DrawRings({ className }: { className?: string }) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-reveal-draw="" className={className} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <ellipse
              key={i}
              pathLength={1}
              cx="210"
              cy="200"
              rx={190 - i * 30}
              ry={160 - i * 25}
              transform={`rotate(${-12 + i * 4} 210 200)`}
              style={{ '--draw-delay': `${stagger(i)}s` } as CSSProperties}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
