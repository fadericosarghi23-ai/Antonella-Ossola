import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useDesktop } from '@/hooks/use-desktop'
import { cn } from '@/lib/utils'

/*
  Effetti legati allo scroll: al massimo uno per pagina, solo su immagini o decorazioni, mai sul testo.
  Solo da 768px in su; con prefers-reduced-motion restano fermi. Lo scroll resta nativo.
*/

function useActive() {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  return !reduce && desktop
}

/** Foto che scorre più lenta della sua cornice (parallasse leggera, solo immagine). */
export function ParallaxImage({ children, className, amount = 8 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useActive()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div className="absolute -inset-y-[10%] inset-x-0" style={active ? { y } : undefined}>
        {children}
      </motion.div>
    </div>
  )
}

/** Curve di livello decorative che ruotano piano con lo scroll della pagina (intestazioni brevi). */
export function DriftRings({ className }: { className?: string }) {
  const active = useActive()
  const { scrollY } = useScroll()
  const rotate = useTransform(scrollY, [0, 900], [0, 24])
  const y = useTransform(scrollY, [0, 900], [0, 80])
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={cn('pointer-events-none text-muschio/20', className)}
      style={active ? { rotate, y } : undefined}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <ellipse key={i} cx="210" cy="200" rx={190 - i * 26} ry={150 - i * 20} transform={`rotate(${-12 + i * 5} 210 200)`} />
        ))}
      </g>
    </motion.svg>
  )
}
