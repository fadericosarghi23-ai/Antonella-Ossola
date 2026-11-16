import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * [SEGNAPOSTO] Riquadro dimensionato al posto di una foto che ancora non c'è.
 * Dichiara cosa va scattato e in che formato, così nessuno lo scambia per una pagina non caricata.
 */
export function PhotoPlaceholder({
  soggetto,
  formato,
  note,
  className,
}: {
  soggetto: string
  formato: string
  note?: string
  className?: string
}) {
  return (
    <figure
      data-placeholder=""
      className={cn(
        'relative flex flex-col justify-end overflow-hidden rounded-2xl border border-dashed border-muschio/40 bg-pietra/70 p-6',
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full text-muschio/25">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <ellipse key={i} cx="170" cy="120" rx={150 - i * 20} ry={110 - i * 15} transform={`rotate(${-15 + i * 5} 170 120)`} />
          ))}
        </g>
      </svg>
      <figcaption className="relative">
        <Camera className="size-6 text-castagno" aria-hidden="true" />
        <p className="kicker mt-3">Foto da scattare · {formato}</p>
        <p className="mt-1 font-display text-2xl leading-snug text-bosco">{soggetto}</p>
        {note && <p className="mt-2 max-w-xs text-sm text-muted-foreground">{note}</p>}
      </figcaption>
    </figure>
  )
}
