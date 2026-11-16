import { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Header } from '@/components/ui/header-2'
import { Footer2 } from '@/components/ui/footer-2'
import Home from '@/pages/Home'
const Percorsi = lazy(() => import('@/pages/Percorsi'))
const CamminateAscolto = lazy(() => import('@/pages/CamminateAscolto'))
const PercorsiIndividuali = lazy(() => import('@/pages/PercorsiIndividuali'))
const GiornateRitiri = lazy(() => import('@/pages/GiornateRitiri'))
const Luoghi = lazy(() => import('@/pages/Luoghi'))
const ChiSono = lazy(() => import('@/pages/ChiSono'))
const DatePage = lazy(() => import('@/pages/Date'))
const Contatti = lazy(() => import('@/pages/Contatti'))
const Privacy = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Privacy })))
const Cookie = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Cookie })))
const NotFound = lazy(() => import('@/pages/NotFound'))

/** Torna in cima a ogni cambio di pagina (salvo ancore). */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

/** Con ?segnaposto=1 evidenzia tutti i testi provvisori. */
function PlaceholderToggle() {
  const { search } = useLocation()
  useEffect(() => {
    const on = new URLSearchParams(search).get('segnaposto') === '1'
    document.documentElement.classList.toggle('show-placeholders', on)
  }, [search])
  return null
}

export default function App() {
  const location = useLocation()
  const reduce = useReducedMotion()
  // Al primo caricamento la pagina è subito visibile (nessuna dissolvenza): il testo si legge al primo frame.
  const first = useRef(true)
  useEffect(() => {
    first.current = false
  }, [])
  return (
    <>
      <a
        href="#contenuto"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-bosco focus:px-4 focus:py-2 focus:text-carta"
      >
        Vai al contenuto
      </a>
      <ScrollToTop />
      <PlaceholderToggle />
      <Header />
      {/* Transizione tra pagine: solo dissolvenza breve (orientamento) */}
      <AnimatePresence mode="wait">
        <motion.main
          id="contenuto"
          key={location.pathname}
          initial={first.current ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<div className="min-h-[70svh]" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/percorsi" element={<Percorsi />} />
            <Route path="/percorsi/camminate-di-ascolto" element={<CamminateAscolto />} />
            <Route path="/percorsi/percorsi-individuali" element={<PercorsiIndividuali />} />
            <Route path="/percorsi/giornate-e-ritiri" element={<GiornateRitiri />} />
            <Route path="/luoghi" element={<Luoghi />} />
            <Route path="/chi-sono" element={<ChiSono />} />
            <Route path="/date" element={<DatePage />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookie" element={<Cookie />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer2 />
    </>
  )
}
