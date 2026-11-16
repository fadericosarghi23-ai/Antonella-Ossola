import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CtaBand, Section } from '@/components/site/blocks'
import { Photo } from '@/components/site/Photo'
import { Ph } from '@/components/site/Ph'
import { photos } from '@/lib/photos'
import { SITE_URL } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

const path = '/percorsi/percorsi-individuali'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: 'Percorsi individuali',
  description: meta[path].description,
  provider: { '@id': `${SITE_URL}/#antonella` },
  url: SITE_URL + path,
  areaServed: 'Provincia di Varese',
}

/*
  Pagina volutamente più raccolta delle altre: niente intestazione con foto a tutta larghezza,
  testo in primo piano, una sola immagine. Il tono è quello di uno studio, non di un'escursione.
*/
export default function PercorsiIndividuali() {
  useSeo({ ...meta[path], path, jsonLd })
  return (
    <>
      <section className="container-site grid gap-10 pt-10 md:grid-cols-12 md:gap-8 md:pt-16">
        <div className="md:col-span-7">
          <nav aria-label="Percorso di navigazione" className="mb-6 text-sm text-muted-foreground">
            <Link to="/percorsi" className="link-underline">
              Percorsi
            </Link>
          </nav>
          <p className="kicker">Una persona, un sentiero</p>
          <h1 className="mt-4 text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl">Percorsi individuali</h1>
          <p className="mt-8 font-display text-2xl leading-snug text-bosco md:text-3xl">
            <Ph>
              A volte una domanda si scioglie meglio camminando fianco a fianco che seduti uno di fronte all’altro.
            </Ph>
          </p>
          <Ph as="p" className="mt-6 max-w-xl text-lg text-muted-foreground">
            Incontri a due, su un sentiero scelto insieme. Il passo detta il tempo della conversazione, le pause
            arrivano da sole. È uno spazio riservato, con le stesse attenzioni di uno studio.
          </Ph>
        </div>
        <div className="md:col-span-5 md:pt-24">
          <Photo
            photo={photos.bivio}
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/5] rounded-2xl"
            imgClassName="object-[40%_50%]"
          />
        </div>
      </section>

      <Section>
        <h2 className="max-w-2xl text-4xl leading-[1.06] md:text-5xl">Quando può essere utile</h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { t: 'Un passaggio', d: 'Un cambio di lavoro, di casa, di fase della vita che chiede di essere pensato.' },
            { t: 'Un periodo pieno', d: 'Quando la testa non si ferma e serve uno spazio fuori dalla routine.' },
            { t: 'Una decisione', d: 'Per guardare una scelta da più lati, con il tempo che il cammino concede.' },
            { t: 'Ripartire', d: 'Per ritrovare il gusto di muoversi all’aperto, con qualcuno accanto.' },
          ].map((x) => (
            <div key={x.t} className="border-t pt-5">
              <h3 className="text-2xl">{x.t}</h3>
              <Ph as="p" className="mt-2 text-muted-foreground">
                {x.d}
              </Ph>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="grid gap-8 rounded-3xl border bg-card p-6 sm:p-10 md:grid-cols-12">
          <div className="md:col-span-1">
            <Lock className="size-7 text-castagno" aria-hidden="true" />
          </div>
          <div className="md:col-span-7">
            <h2 className="text-3xl md:text-4xl">Riservatezza</h2>
            <Ph as="p" className="mt-4 text-lg text-muted-foreground">
              Scegliamo insieme sentieri tranquilli e orari poco frequentati. Quello che ci diciamo resta tra noi, con le
              stesse regole di riservatezza di un colloquio.
            </Ph>
          </div>
          <div className="text-sm text-muted-foreground md:col-span-4">
            <p className="kicker mb-2">In pratica</p>
            <Ph as="p">Incontri di circa un’ora e mezza. Numero di incontri e quota da concordare.</Ph>
          </div>
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <h2 className="text-4xl leading-[1.06] md:text-5xl">Come si inizia</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            'Mi scrivi due righe su cosa cerchi, senza bisogno di spiegare tutto.',
            'Una telefonata di un quarto d’ora per capire se il cammino è la forma giusta.',
            'Fissiamo il primo incontro su un sentiero vicino a te.',
          ].map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="font-display text-4xl text-castagno">{i + 1}</span>
              <Ph as="p" className="pt-2 text-lg text-muted-foreground">
                {t}
              </Ph>
            </li>
          ))}
        </ol>
        <Button asChild size="lg" className="mt-10">
          <Link to="/contatti?percorso=percorsi-individuali">
            Scrivimi in modo riservato <ArrowRight />
          </Link>
        </Button>
      </Section>

      <CtaBand title="Preferisci iniziare in gruppo?" text="Le camminate di ascolto sono un buon primo passo." />
    </>
  )
}
