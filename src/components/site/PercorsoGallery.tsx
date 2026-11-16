import { Gallery, GalleryImage } from '@/components/ui/shared-element-gallery'
import { Reveal, stagger } from '@/components/site/Reveal'
import { Ph } from '@/components/site/Ph'
import type { PhotoSrc } from '@/lib/photos'

/**
 * Tre foto del percorso: si aprono a schermo intero e nel visore si scorre tra loro
 * (frecce, tastiera, trascinamento). [SEGNAPOSTO] foto provvisorie, da sostituire con quelle delle uscite.
 */
export function PercorsoGallery({ id, title, photos }: { id: string; title: string; photos: PhotoSrc[] }) {
  return (
    <Gallery>
      <Reveal className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-end">
        <h2 className="text-3xl md:text-4xl">{title}</h2>
        <Ph as="p" className="text-sm text-muted-foreground">
          Foto provvisorie · tocca una foto per aprirla
        </Ph>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {photos.map((p, i) => (
          <Reveal key={i} delay={stagger(i)} className={i === 0 ? 'col-span-2 md:col-span-1' : undefined}>
            <GalleryImage
              id={`${id}-${i}`}
              src={p.sm}
              full={p.src}
              alt={p.alt}
              width={800}
              height={600}
              fill
              className="mb-0 aspect-[4/3] sm:mb-0"
            />
          </Reveal>
        ))}
      </div>
    </Gallery>
  )
}
