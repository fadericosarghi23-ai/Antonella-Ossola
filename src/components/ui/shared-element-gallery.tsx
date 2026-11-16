// Da 21st.dev: @jahed/shared-element-gallery
// Adattato: colori del sito, sfocatura dello sfondo ridotta (più leggera), etichette in italiano,
// didascalia nel visore, ripristino corretto dello scroll. Logica e transizione condivisa invariate.
// Con prefers-reduced-motion la MotionConfig globale ("user") annulla le trasformazioni.
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

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
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [selectedImage])

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage }}>
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
}: {
  src: string
  full?: string
  alt?: string
  id: string
  width?: number
  height?: number
  className?: string
}) {
  const context = React.useContext(GalleryContext)
  const [loaded, setLoaded] = React.useState(false)
  if (!context) throw new Error("GalleryImage must be used within a Gallery")

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
          "h-auto w-full rounded-xl bg-pietra object-cover transition-opacity duration-300 ease-out",
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

  const { selectedImage, setSelectedImage } = context

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
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(_e, info) => {
              if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 300) {
                setSelectedImage(null)
              }
            }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.full ?? selectedImage.src}
              alt={selectedImage.alt || ""}
              className="h-auto max-h-[82vh] w-auto max-w-[95vw] rounded-xl object-contain will-change-transform"
              draggable={false}
              transition={spring}
            />
            {selectedImage.alt && (
              <p className="max-w-xl text-center text-sm text-carta/80">{selectedImage.alt}</p>
            )}
          </motion.div>

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
