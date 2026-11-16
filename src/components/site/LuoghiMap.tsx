import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Photo } from '@/components/site/Photo'
import { Ph } from '@/components/site/Ph'
import type { PhotoSrc } from '@/lib/photos'
import { cn } from '@/lib/utils'
import { useDesktop } from '@/hooks/use-desktop'

/*
  Carta dei luoghi: disegnata in SVG, in scala (proiezione equirettangolare corretta per la latitudine),
  nessun servizio esterno e nessun cookie. Le coordinate sono approssimate al centro della località.
  Momento d'autore: al cambio di luogo la foto si apre con una maschera (clip-path, 600ms, solo immagine).
*/

export type Luogo = {
  id: string
  nome: string
  zona: string
  lat: number
  lon: number
  testo: string
  fonte?: string
  photo: PhotoSrc
}

const LON0 = 8.66
const LON1 = 8.99
const LAT0 = 45.76
const LAT1 = 46.03
const K = Math.cos((45.9 * Math.PI) / 180)
const W = 600
const H = Math.round((W * (LAT1 - LAT0)) / ((LON1 - LON0) * K))
const PX_PER_KM = H / ((LAT1 - LAT0) * 111.2)

const px = (lon: number, lat: number): [number, number] => [
  ((lon - LON0) / (LON1 - LON0)) * W,
  ((LAT1 - lat) / (LAT1 - LAT0)) * H,
]

// Tracciato indicativo del Sentiero Italia citato nell'intervista (Porto Ceresio, Cuasso al Monte, Marzio, Marchirolo, Monte Sette Termini, Luino)
const sentieroItalia: [number, number][] = [
  [8.898, 45.906],
  [8.878, 45.912],
  [8.857, 45.938],
  [8.836, 45.951],
  [8.795, 45.975],
  [8.744, 46.001],
]

const riferimenti = [
  { nome: 'Varese', lon: 8.8251, lat: 45.8206 },
  { nome: 'Luino', lon: 8.744, lat: 46.001 },
  { nome: 'Porto Ceresio', lon: 8.898, lat: 45.906 },
]

function rilievo(cx: number, cy: number, n: number, r: number, rot: number) {
  return Array.from({ length: n }, (_, i) => {
    const k = 1 - i / n
    return (
      <ellipse
        key={i}
        cx={cx + i * 3}
        cy={cy - i * 2}
        rx={r * k * 1.25}
        ry={r * k * 0.8}
        transform={`rotate(${rot + i * 3} ${cx} ${cy})`}
      />
    )
  })
}

export function LuoghiMap({ luoghi }: { luoghi: Luogo[] }) {
  const [sel, setSel] = useState(luoghi[0].id)
  const desktop = useDesktop()
  const reduce = useReducedMotion() || !desktop
  const attivo = luoghi.find((l) => l.id === sel) ?? luoghi[0]
  const [cfx, cfy] = px(8.762, 45.868) // Campo dei Fiori
  const [stx, sty] = px(8.79, 45.978) // Monte Sette Termini
  const scala = 5 * PX_PER_KM

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-6">
        <div className="relative rounded-3xl border bg-card p-3 sm:p-5">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="group" aria-label="Carta dei luoghi in provincia di Varese">
            {/* rilievi decorativi: Campo dei Fiori e Monte Sette Termini */}
            <g fill="none" stroke="var(--muschio)" strokeOpacity="0.28" strokeWidth="1">
              {rilievo(cfx, cfy, 7, 120, -18)}
              {rilievo(stx, sty, 6, 90, 12)}
            </g>
            <text x={cfx - 52} y={cfy + 6} className="fill-muschio-scuro text-[13px] italic" style={{ fontFamily: 'var(--font-serif)' }}>
              Campo dei Fiori
            </text>

            {/* acque, solo come direzioni */}
            <g className="fill-muschio-scuro text-[12px] uppercase" style={{ letterSpacing: '0.12em' }}>
              <text x={14} y={H * 0.42}>← Lago Maggiore</text>
              <text x={W - 14} y={px(0, 45.93)[1]} textAnchor="end">
                Lago di Lugano →
              </text>
              <text x={14} y={px(0, 45.81)[1]}>↙ Lago di Varese</text>
            </g>

            {/* Sentiero Italia */}
            <polyline
              points={sentieroItalia.map(([lo, la]) => px(lo, la).join(',')).join(' ')}
              fill="none"
              stroke="var(--castagno)"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />

            {/* località di riferimento */}
            {riferimenti.map((r) => {
              const [x, y] = px(r.lon, r.lat)
              return (
                <g key={r.nome}>
                  <rect x={x - 3.5} y={y - 3.5} width="7" height="7" className="fill-bosco" />
                  <text x={x + 9} y={y + 4} className="fill-bosco text-[13px]">
                    {r.nome}
                  </text>
                </g>
              )
            })}

            {/* luoghi selezionabili */}
            {luoghi.map((l, i) => {
              const [x, y] = px(l.lon, l.lat)
              const on = l.id === sel
              return (
                <g
                  key={l.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  aria-label={l.nome}
                  className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-ring"
                  onClick={() => setSel(l.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSel(l.id)
                    }
                  }}
                >
                  <circle cx={x} cy={y} r="22" fill="transparent" stroke="transparent" strokeWidth="2" />
                  <circle
                    cx={x}
                    cy={y}
                    r={on ? 15 : 12}
                    className={cn('transition-all duration-200', on ? 'fill-castagno' : 'fill-carta stroke-castagno')}
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y + 4.5}
                    textAnchor="middle"
                    className={cn('pointer-events-none text-[13px] font-medium', on ? 'fill-carta' : 'fill-castagno')}
                  >
                    {i + 1}
                  </text>
                </g>
              )
            })}

            {/* nord e scala */}
            <g transform={`translate(${W - 40} 40)`} className="fill-bosco">
              <path d="M0 -18 L7 6 L0 1 L-7 6 Z" />
              <text y="24" textAnchor="middle" className="text-[12px]">
                N
              </text>
            </g>
            <g transform={`translate(24 ${H - 26})`}>
              <line x1="0" x2={scala} y1="0" y2="0" stroke="var(--bosco)" strokeWidth="2" />
              <line x1="0" x2="0" y1="-5" y2="5" stroke="var(--bosco)" strokeWidth="2" />
              <line x1={scala} x2={scala} y1="-5" y2="5" stroke="var(--bosco)" strokeWidth="2" />
              <text x={scala / 2} y="-9" textAnchor="middle" className="fill-bosco text-[12px]">
                5 km
              </text>
            </g>
          </svg>
          <p className="mt-2 flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <svg width="28" height="6" aria-hidden="true">
              <line x1="0" x2="28" y1="3" y2="3" stroke="var(--castagno)" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
            Tracciato indicativo del Sentiero Italia
          </p>
        </div>

        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {luoghi.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setSel(l.id)}
                aria-pressed={l.id === sel}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-150',
                  l.id === sel ? 'border-castagno bg-card' : 'hover:bg-card',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-castagno text-sm',
                    l.id === sel ? 'bg-castagno text-carta' : 'text-castagno',
                  )}
                >
                  {i + 1}
                </span>
                <span className="font-display text-lg leading-tight">{l.nome}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-6" aria-live="polite">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-pietra">
          <AnimatePresence initial={false}>
            <motion.div
              key={attivo.id}
              className="absolute inset-0"
              initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0% round 24px)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
              exit={{ opacity: 0.999 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Photo photo={attivo.photo} sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="kicker mt-6">{attivo.zona}</p>
        <h2 className="mt-2 text-4xl leading-[1.06] md:text-5xl">{attivo.nome}</h2>
        <Ph as="p" className="mt-4 text-lg text-muted-foreground">
          {attivo.testo}
        </Ph>
        {attivo.fonte && <p className="mt-4 text-sm text-muted-foreground">{attivo.fonte}</p>}
      </div>
    </div>
  )
}
