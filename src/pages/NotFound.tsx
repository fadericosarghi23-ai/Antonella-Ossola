import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogoMark } from '@/components/brand/Logo'
import { useSeo } from '@/hooks/use-seo'

export default function NotFound() {
  useSeo({ title: 'Pagina non trovata · Antonella Ossola', description: 'La pagina cercata non esiste.', path: '/404' })
  return (
    <section className="container-site flex flex-col items-start justify-center py-16 md:py-24">
      <LogoMark className="size-16 text-muschio" />
      <p className="kicker mt-8">Errore 404</p>
      <h1 className="mt-4 max-w-2xl text-5xl leading-[1.04] md:text-7xl">Questo sentiero non porta da nessuna parte.</h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        La pagina che cerchi non esiste o è stata spostata. Torniamo all’inizio del cammino.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/">Torna alla home</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/percorsi">Vedi i percorsi</Link>
        </Button>
      </div>
    </section>
  )
}
