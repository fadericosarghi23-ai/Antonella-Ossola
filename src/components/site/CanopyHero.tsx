import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useDesktop } from '@/hooks/use-desktop'
import type { PhotoSrc } from '@/lib/photos'

/*
  Hero "sotto le chiome" (costruito da Altalogik, ispirato al concetto di Overstory Studio Landing di
  kedhar-components: il codice originale non è pubblicato né licenziato, quindi non è stato copiato).
  - Primo frame: si guarda in su tra le chiome, titolo al centro sul cielo, fermo e leggibile.
  - Al caricamento la foto entra con dissolvenza e rientro di scala (800ms, solo immagine).
  - Una sola foto. Scorrendo si sale verso il varco di cielo: le chiome si ingrandiscono piano
    (da 1 a 1,4) e restano sempre piene, così la scena non si svuota. Unico effetto di scroll della
    Home, scroll nativo con contenitore sticky. Il testo non si anima mai.
  - Mobile e prefers-reduced-motion: un'altezza di schermo, foto ferma.
*/
export function CanopyHero({ photo, children }: { photo: PhotoSrc; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const active = desktop && !reduce
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.4])

  return (
    <section ref={ref} className={`relative -mt-16 md:-mt-[78px] ${active ? 'h-[160vh]' : 'h-[100svh] min-h-[640px]'}`}>
      <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden bg-bosco">
        <motion.div className="chiome-in absolute inset-0" style={active ? { scale } : undefined}>
          <img
            src={photo.src}
            srcSet={`${photo.sm} 800w, ${photo.src} ${photo.w}w`}
            sizes="100vw"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
        {/* nessuna velatura sulla foto: titolo e testo chiari con un'ombra scura morbida (in Home.tsx) */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
          {children}
        </div>
        <p className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 rounded-full bg-carta/85 px-5 py-2 text-[0.72rem] font-medium tracking-[0.2em] whitespace-nowrap text-bosco uppercase shadow-sm backdrop-blur md:flex">
          <span aria-hidden="true" className="h-px w-10 bg-bosco/40" />
          Scorri per salire sopra gli alberi
          <ArrowDown className="size-3.5 text-castagno" aria-hidden="true" />
          <span aria-hidden="true" className="h-px w-10 bg-bosco/40" />
        </p>
      </div>
    </section>
  )
}
