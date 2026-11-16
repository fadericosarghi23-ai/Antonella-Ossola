import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CRINALE } from '@/components/brand/Logo'

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
      <svg aria-hidden="true" viewBox="0 0 92 44" className="absolute inset-x-6 top-8 w-[calc(100%-3rem)] text-muschio/40">
        <circle cx="70" cy="9" r="3" fill="var(--castagno)" fillOpacity="0.6" />
        <path d={CRINALE} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
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
