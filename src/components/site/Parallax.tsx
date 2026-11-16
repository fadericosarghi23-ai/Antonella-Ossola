import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useDesktop } from '@/hooks/use-desktop'
import { cn } from '@/lib/utils'
import { CRINALE } from '@/components/brand/Logo'

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

/** Il crinale del marchio, grande e tenue, che scorre piano con lo scroll (intestazioni brevi). */
export function DriftRings({ className }: { className?: string }) {
  const active = useActive()
  const { scrollY } = useScroll()
  const x = useTransform(scrollY, [0, 900], [0, -60])
  const y = useTransform(scrollY, [0, 900], [0, 50])
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 92 44"
      className={cn('pointer-events-none text-muschio/25', className)}
      style={active ? { x, y } : undefined}
    >
      <circle cx="70" cy="9" r="3" fill="var(--castagno)" fillOpacity="0.5" />
      <path d={CRINALE} fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}
