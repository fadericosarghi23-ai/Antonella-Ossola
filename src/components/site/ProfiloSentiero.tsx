import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useDesktop } from '@/hooks/use-desktop'
import meta from '@/assets/terrain/rilievo.json'

/*
  Momento d'autore di Chi sono: il profilo altimetrico del Sentiero Italia che Antonella cita
  nell'intervista (Porto Ceresio, Marzio, Marchirolo, Monte Sette Termini, Luino).
  Quote reali da dati SRTM lungo la linea retta tra le località: un profilo indicativo, non il tracciato GPS.
  La linea si disegna seguendo lo scroll (unico effetto di scroll della pagina); il testo è fermo.
  Su mobile e con movimento ridotto il profilo è già completo.
*/

const W = 1000
const H = 260
const PAD = { l: 8, r: 58, t: 40, b: 30 }

const kmMax = meta.profilo[meta.profilo.length - 1][0]
const qMin = 150
const qMax = 1000
const sx = (km: number) => PAD.l + (km / kmMax) * (W - PAD.l - PAD.r)
const sy = (q: number) => PAD.t + (1 - (q - qMin) / (qMax - qMin)) * (H - PAD.t - PAD.b)

const linea = meta.profilo.map(([km, q], i) => `${i ? 'L' : 'M'}${sx(km).toFixed(1)},${sy(q).toFixed(1)}`).join(' ')
const area = `${linea} L${sx(kmMax).toFixed(1)},${H - PAD.b} L${sx(0).toFixed(1)},${H - PAD.b} Z`

export function ProfiloSentiero() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const active = !reduce && desktop
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])
  const areaOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1])

  return (
    <figure ref={ref} className="rounded-3xl border bg-card p-5 sm:p-8">
      <figcaption className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <div>
          <p className="kicker">La montagna di casa, in sezione</p>
          <h2 className="mt-2 text-3xl md:text-4xl">Da Porto Ceresio a Luino, sul Sentiero Italia</h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Le tappe che Antonella suggeriva nel 2020. Quote da dati SRTM lungo la linea tra le località: profilo indicativo.
        </p>
      </figcaption>
      <div className="mt-6 overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Profilo altimetrico indicativo da Porto Ceresio a Luino">
          {[200, 400, 600, 800].map((q) => (
            <g key={q}>
              <line x1={PAD.l} x2={W - PAD.r} y1={sy(q)} y2={sy(q)} stroke="var(--border)" strokeDasharray="2 6" />
              <text x={W - 4} y={sy(q) + 4} textAnchor="end" className="fill-muted-foreground text-[11px]">
                {q} m
              </text>
            </g>
          ))}
          <motion.path d={area} fill="var(--muschio)" style={active ? { opacity: areaOpacity } : undefined} opacity={active ? undefined : 1} fillOpacity={0.14} />
          <motion.path
            d={linea}
            fill="none"
            stroke="var(--castagno)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            style={active ? { pathLength } : undefined}
          />
          {meta.punti.map((p, i) => {
            const x = sx(p.km)
            const y = sy(p.quota)
            const anchor = i === 0 ? 'start' : i === meta.punti.length - 1 ? 'end' : 'middle'
            return (
              <g key={p.nome}>
                <line x1={x} x2={x} y1={y} y2={H - PAD.b} stroke="var(--castagno)" strokeOpacity="0.25" />
                <circle cx={x} cy={y} r="5" fill="var(--carta)" stroke="var(--castagno)" strokeWidth="2" />
                <text x={x} y={y - 14} textAnchor={anchor} className="fill-bosco text-[13px] font-medium" stroke="var(--card)" strokeWidth="5" paintOrder="stroke" strokeLinejoin="round">
                  {p.nome}
                </text>
                <text x={x} y={H - 10} textAnchor={anchor} className="fill-muted-foreground text-[11px]">
                  km {p.km.toFixed(1).replace('.', ',')}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </figure>
  )
}
