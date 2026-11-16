import type { RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useDesktop } from '@/hooks/use-desktop'

/*
  Momento d'autore di Giornate e ritiri: mentre si scorre il programma, dalle 8:30 alle 17:00,
  il sole attraversa l'arco sopra un crinale. Unico effetto di scroll della pagina, solo SVG.
  Su mobile e con movimento ridotto il disegno è fermo, con il sole a metà giornata.
*/

const CX = 160
const CY = 150
const R = 120
const A0 = (165 * Math.PI) / 180 // mattino, a est (sinistra)
const A1 = (15 * Math.PI) / 180 // pomeriggio, a ovest (destra)
const pt = (a: number) => ({ x: CX + R * Math.cos(a), y: CY - R * Math.sin(a) })
const p0 = pt(A0)
const p1 = pt(A1)
const ARCO = `M${p0.x.toFixed(1)},${p0.y.toFixed(1)} A${R},${R} 0 0 1 ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`

export function ArcoDelSole({ target }: { target: RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const active = !reduce && desktop
  const { scrollYProgress } = useScroll({ target, offset: ['start 70%', 'end 60%'] })
  const angle = useTransform(scrollYProgress, [0, 1], [A0, A1])
  const cx = useTransform(angle, (a) => CX + R * Math.cos(a))
  const cy = useTransform(angle, (a) => CY - R * Math.sin(a))
  const trail = useTransform(scrollYProgress, [0, 1], [0, 1])
  const mid = pt((A0 + A1) / 2)

  return (
    <svg viewBox="0 0 320 190" className="h-auto w-full max-w-xs" aria-hidden="true">
      <path d={ARCO} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 6" />
      <motion.path d={ARCO} fill="none" stroke="var(--castagno)" strokeWidth="1.5" style={active ? { pathLength: trail } : undefined} />
      <motion.circle
        r="11"
        fill="var(--castagno)"
        cx={active ? cx : mid.x}
        cy={active ? cy : mid.y}
      />
      {/* crinale */}
      <path
        d="M0,170 C40,150 70,128 105,140 C135,150 150,118 185,112 C215,107 240,138 270,132 C292,128 305,140 320,146 L320,190 L0,190 Z"
        fill="var(--muschio)"
        fillOpacity="0.85"
      />
      <path
        d="M0,182 C50,168 90,160 140,170 C190,180 230,160 320,172 L320,190 L0,190 Z"
        fill="var(--bosco)"
        fillOpacity="0.9"
      />
      <text x="8" y="186" className="fill-carta text-[11px]">8:30</text>
      <text x="312" y="186" textAnchor="end" className="fill-carta text-[11px]">17:00</text>
    </svg>
  )
}
