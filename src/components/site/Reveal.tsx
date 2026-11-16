import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useDesktop } from '@/hooks/use-desktop'
import { cn } from '@/lib/utils'

/*
  Entrate allo scroll (modalità ambizione alta):
  - opacità + spostamento verticale di 16px, 600ms, ease-out, una sola volta;
  - nelle sequenze ritardo di 80ms per elemento, su massimo sei elementi (usare stagger(i));
  - i titoli entrano come blocco insieme al loro testo, mai parola per parola;
  - nessun filtro, scala o maschera sul testo (la scala è solo in RevealImage, sulle immagini);
  - su mobile e con prefers-reduced-motion il contenuto è subito visibile e fermo.
*/

const EASE = [0.22, 1, 0.36, 1] as const
const VIEWPORT = { once: true, amount: 0.15, margin: '0px 0px -8% 0px' } as const

/** Ritardo per l'elemento i di una sequenza: 80ms ciascuno, tetto a sei elementi. */
export const stagger = (i: number) => Math.min(i, 5) * 0.08

function useAnimate() {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  return !reduce && desktop
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const animate = useAnimate()
  if (!animate) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Entrata per le immagini: dissolvenza e leggero rientro di scala dentro la cornice (solo foto). */
export function RevealImage({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const animate = useAnimate()
  if (!animate) return <div className={cn('overflow-hidden', className)}>{children}</div>
  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

/** Curve di livello decorative che si tracciano una volta all'ingresso (fascia finale). Solo SVG, mai testo. */
export function DrawRings({ className }: { className?: string }) {
  const animate = useAnimate()
  return (
    <svg aria-hidden="true" viewBox="0 0 400 400" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.ellipse
            key={i}
            cx="210"
            cy="200"
            rx={190 - i * 30}
            ry={160 - i * 25}
            transform={`rotate(${-12 + i * 4} 210 200)`}
            initial={animate ? { pathLength: 0 } : false}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: stagger(i) }}
          />
        ))}
      </g>
    </svg>
  )
}
