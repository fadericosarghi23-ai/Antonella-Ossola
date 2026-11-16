// Da 21st.dev: @jahed/shared-element-gallery
// Adattato: colori del sito, sfocatura dello sfondo ridotta (più leggera), etichette in italiano,
// didascalia nel visore, ripristino corretto dello scroll. Logica e transizione condivisa invariate.
// Aggiunto da Altalogik: scorrimento tra le foto nel visore (frecce, tastiera, trascinamento orizzontale),
// contatore, foto a riempimento (prop "fill") per griglie regolari.
// Con prefers-reduced-motion la MotionConfig globale ("user") annulla le trasformazioni.
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

// --- Types ---
interface ImageData {
  id: string
  src: string
  alt?: string
  full?: string
}

interface GalleryContextType {
  selectedImage: ImageData | null
  setSelectedImage: (image: ImageData | null) => void
  register: (image: ImageData) => () => void
  images: React.MutableRefObject<ImageData[]>
  go: (dir: 1 | -1) => void
  navigated: boolean
  dir: 1 | -1
}

const GalleryContext = React.createContext<GalleryContextType | null>(null)

// --- Physics --- (molla smorzata, nessun rimbalzo visibile)
const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
} as const

// --- Components ---

export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelected] = React.useState<ImageData | null>(null)
  const [navigated, setNavigated] = React.useState(false)
  const [dir, setDir] = React.useState<1 | -1>(1)
  const images = React.useRef<ImageData[]>([])

  const setSelectedImage = React.useCallback((image: ImageData | null) => {
    setNavigated(false)
    setSelected(image)
  }, [])

  const register = React.useCallback((image: ImageData) => {
    images.current.push(image)
    return () => {
      images.current = images.current.filter((i) => i.id !== image.id)
    }
  }, [])

  const go = React.useCallback((d: 1 | -1) => {
    setSelected((cur) => {
      const list = images.current
      if (!cur || list.length < 2) return cur
      const i = list.findIndex((x) => x.id === cur.id)
      return list[(i + d + list.length) % list.length]
    })
    setDir(d)
    setNavigated(true)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null)
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [go, setSelectedImage])

  React.useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedImage])

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage, register, images, go, navigated, dir }}>
      {children}
      <GalleryModal />
    </GalleryContext.Provider>
  )
}

export function GalleryGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("columns-2 gap-3 sm:gap-4 lg:columns-3", className)}>
      {children}
    </div>
  )
}

export function GalleryImage({
  src,
  full,
  alt,
  id,
  width,
  height,
  className,
  fill = false,
}: {
  src: string
  full?: string
  alt?: string
  id: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
}) {
  const context = React.useContext(GalleryContext)
  const [loaded, setLoaded] = React.useState(false)
  if (!context) throw new Error("GalleryImage must be used within a Gallery")
  const { register } = context
  React.useEffect(() => register({ id, src, alt, full }), [register, id, src, alt, full])

  return (
    <motion.button
      type="button"
      whileHover="hover"
      whileTap="tap"
      aria-label={`Ingrandisci: ${alt ?? "foto"}`}
      className={cn(
        "relative mb-3 block w-full cursor-zoom-in sm:mb-4 break-inside-avoid overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      onClick={() => context.setSelectedImage({ id, src, alt, full })}
    >
      <motion.img
        layoutId={`image-${id}`}
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el: HTMLImageElement | null) => {
          if (el?.complete) setLoaded(true)
        }}
        className={cn(
          fill ? "h-full w-full" : "h-auto w-full",
          "rounded-xl bg-pietra object-cover transition-opacity duration-300 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
        variants={{
          hover: { scale: 0.98 },
          tap: { scale: 0.95 },
        }}
        transition={spring}
      />
      <motion.div
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 rounded-xl bg-bosco/10"
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

function GalleryModal() {
  const context = React.useContext(GalleryContext)
  if (!context) return null

  const { selectedImage, setSelectedImage, go, navigated, dir, images } = context
  const total = images.current.length
  const index = selectedImage ? images.current.findIndex((x) => x.id === selectedImage.id) + 1 : 0

  return (
    <AnimatePresence>
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt ?? "Foto"}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-bosco/90"
            onClick={() => setSelectedImage(null)}
          />

          <motion.div
            className="relative z-10 flex h-full w-full cursor-zoom-out flex-col items-center justify-center gap-3 p-4"
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_e, info) => {
              if (Math.abs(info.offset.x) > 80 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                go(info.offset.x < 0 ? 1 : -1)
              } else if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 300) {
                setSelectedImage(null)
              }
            }}
            onClick={() => setSelectedImage(null)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={selectedImage.id}
                layoutId={navigated ? undefined : `image-${selectedImage.id}`}
                src={selectedImage.full ?? selectedImage.src}
                alt={selectedImage.alt || ""}
                className="h-auto max-h-[78vh] w-auto max-w-[92vw] rounded-xl object-contain will-change-transform"
                draggable={false}
                initial={navigated ? { opacity: 0, x: dir * 40 } : undefined}
                animate={{ opacity: 1, x: 0 }}
                exit={navigated ? { opacity: 0, x: dir * -40 } : undefined}
                transition={navigated ? { duration: 0.3, ease: [0.22, 1, 0.36, 1] } : spring}
              />
            </AnimatePresence>
            {selectedImage.alt && (
              <p className="max-w-xl text-center text-sm text-carta/80">
                {selectedImage.alt}
                {total > 1 && <span className="ml-2 text-carta/50 tabular-nums">{index} / {total}</span>}
              </p>
            )}
          </motion.div>

          {total > 1 && (
            <>
              <button
                type="button"
                className="absolute top-1/2 left-3 z-50 -translate-y-1/2 rounded-full bg-carta/10 p-3 text-carta transition-colors duration-150 hover:bg-carta/25 sm:left-6"
                onClick={() => go(-1)}
                aria-label="Foto precedente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="absolute top-1/2 right-3 z-50 -translate-y-1/2 rounded-full bg-carta/10 p-3 text-carta transition-colors duration-150 hover:bg-carta/25 sm:right-6"
                onClick={() => go(1)}
                aria-label="Foto successiva"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.button
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute top-6 right-6 z-50 rounded-full bg-carta/10 p-2.5 text-carta transition-colors hover:bg-carta/20"
            onClick={() => setSelectedImage(null)}
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
