import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useDesktop } from '@/hooks/use-desktop'
import { cn } from '@/lib/utils'
import statico from '@/assets/terrain/rilievo-statico.webp'
import type { Marker, SceneApi } from '@/components/site/rilievo-scene'

/*
  Rilievo 3D del territorio (momento d'autore della pagina Luoghi).
  - three.js e la mappa delle altezze si caricano con import() solo da 768px in su, con WebGL,
    senza movimento ridotto e quando la sezione si avvicina allo schermo.
  - Fino al caricamento, e sempre su mobile, con movimento ridotto o senza WebGL, si vede
    un'immagine statica dello stesso rilievo: la sezione non è mai vuota.
*/

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export function Rilievo3D({ markers, className }: { markers: Marker[]; className?: string }) {
  const desktop = useDesktop()
  const reduce = useReducedMotion()
  const wrap = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const labels = useRef<HTMLSpanElement[]>([])
  const api = useRef<SceneApi | null>(null)
  const [ready, setReady] = useState(false)
  const interactive = desktop && !reduce

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => api.current?.setScroll(p))

  useEffect(() => {
    if (!interactive || !hasWebGL() || !wrap.current) return
    let cancelled = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        import('@/components/site/rilievo-scene')
          .then((m) => m.createScene(host.current!, markers, labels.current, () => !cancelled && setReady(true)))
          .then((a) => {
            if (cancelled) return a.dispose()
            api.current = a
            a.setScroll(scrollYProgress.get())
          })
          .catch(() => setReady(false))
      },
      { rootMargin: '300px' },
    )
    io.observe(wrap.current)
    return () => {
      cancelled = true
      io.disconnect()
      api.current?.dispose()
      api.current = null
      setReady(false)
    }
  }, [interactive, markers, scrollYProgress])

  return (
    <figure className={cn('relative', className)}>
      <div
        ref={wrap}
        className="relative aspect-[4/3] overflow-hidden rounded-3xl border bg-carta md:aspect-[16/9]"
      >
        <img
          src={statico}
          alt="Rilievo in 3D della zona tra Varese, Porto Ceresio e Luino, con il Sentiero Italia e i quattro luoghi"
          className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-500', ready && 'opacity-0')}
          width={1440}
          height={810}
          loading="lazy"
          decoding="async"
        />
        {interactive && (
          <div
            ref={host}
            aria-label="Rilievo 3D: trascina o usa le frecce per ruotare"
            className={cn(
              'absolute inset-0 transition-opacity duration-500 focus-visible:outline-2 focus-visible:outline-castagno',
              ready ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
        {interactive &&
          markers.map((m, i) => (
            <span
              key={m.id}
              ref={(el) => {
                if (el) labels.current[i] = el
              }}
              className={cn(
                'pointer-events-none absolute top-0 left-0 flex items-center gap-1.5 rounded-full bg-carta/95 py-1 pr-3 pl-1 text-xs font-medium whitespace-nowrap text-bosco shadow-sm transition-opacity duration-200',
                ready ? '' : 'invisible',
              )}
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-castagno text-[0.7rem] text-carta">
                {i + 1}
              </span>
              {m.nome}
            </span>
          ))}
      </div>
      <figcaption className="mt-3 flex flex-col justify-between gap-2 text-sm text-muted-foreground md:flex-row">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-0.5 w-6 bg-castagno" />
          Sentiero Italia, linea indicativa tra le località citate
          {interactive && <span className="hidden lg:inline">· trascina per ruotare</span>}
        </span>
        <span>Quote reali (Terrain Tiles, SRTM), rilievo esagerato 1,6 volte</span>
      </figcaption>
    </figure>
  )
}
