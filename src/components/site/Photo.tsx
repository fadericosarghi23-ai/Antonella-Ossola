import { useState } from 'react'
import type { PhotoSrc } from '@/lib/photos'
import { cn } from '@/lib/utils'

type Props = {
  photo: PhotoSrc
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  alt?: string
}

/** Foto responsive con dissolvenza al caricamento (risposta, 300ms). */
export function Photo({ photo, className, imgClassName, sizes = '100vw', priority = false, alt }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={cn('relative overflow-hidden bg-pietra', className)}>
      <img
        src={photo.src}
        srcSet={`${photo.sm} 800w, ${photo.src} ${photo.w}w`}
        sizes={sizes}
        width={photo.w}
        height={photo.h}
        alt={alt ?? photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          if (el?.complete) setLoaded(true)
        }}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300 ease-out',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </div>
  )
}
