import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

/*
  Momento d'autore dell'hero: sei curve di livello che si tracciano una sola volta (800ms, stagger 80ms su sei elementi).
  Le curve sono generate in modo deterministico per ricordare un versante visto in pianta.
  Con prefers-reduced-motion le linee sono già complete al primo frame.
*/

const W = 1440
const H = 420

function line(i: number) {
  const base = 70 + i * 52
  const pts: [number, number][] = []
  for (let x = -40; x <= W + 40; x += 40) {
    const t = x / W
    const y =
      base +
      Math.sin(t * Math.PI * 2.1 + i * 0.55) * (34 - i * 2.5) +
      Math.sin(t * Math.PI * 5.3 + i * 1.3) * 11 +
      Math.cos(t * Math.PI * 1.2 - i * 0.4) * 22 * (1 - t)
    pts.push([x, y])
  }
  // Catmull-Rom → Bézier per una curva morbida
  let d = `M${pts[0][0]},${pts[0][1].toFixed(1)}`
  for (let k = 0; k < pts.length - 1; k++) {
    const p0 = pts[k - 1] ?? pts[k]
    const p1 = pts[k]
    const p2 = pts[k + 1]
    const p3 = pts[k + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1].toFixed(1)}`
  }
  return d
}

const PATHS = Array.from({ length: 6 }, (_, i) => line(i))

export function ContourLines({ className }: { className?: string }) {
  const reduce = useReducedMotion()

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.25">
        {PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            vectorEffect="non-scaling-stroke"
            opacity={0.9 - i * 0.1}
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: 0.15 + i * 0.08 }}
          />
        ))}
      </g>
    </svg>
  )
}
