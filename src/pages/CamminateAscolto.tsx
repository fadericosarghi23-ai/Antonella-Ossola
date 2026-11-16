import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Timeline } from '@/components/ui/timeline'
import { CtaBand, FactList, PageHeader, Section } from '@/components/site/blocks'
import { Photo } from '@/components/site/Photo'
import { Ph } from '@/components/site/Ph'
import { photos } from '@/lib/photos'
import { SITE_URL } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

const path = '/percorsi/camminate-di-ascolto'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: 'Camminate di ascolto',
  description: meta[path].description,
  touristType: ['Escursionisti principianti', 'Adulti'],
  provider: { '@id': `${SITE_URL}/#antonella` },
  url: SITE_URL + path,
  areaServed: 'Provincia di Varese',
}

// [SEGNAPOSTO] struttura della mattinata ipotizzata da Altalogik, da far confermare alla cliente
const tappe = [
  {
    title: 'Prima',
    content: (
      <div className="space-y-3 text-lg text-muted-foreground">
        <Ph as="p">
          Qualche giorno prima ricevi il punto d’incontro, il livello del sentiero e cosa mettere nello zaino. Se vuoi,
          una breve telefonata per conoscerci.
        </Ph>
      </div>
    ),
  },
  {
    title: 'L’arrivo',
    content: (
      <div className="space-y-3 text-lg text-muted-foreground">
        <Ph as="p">
          Ci troviamo all’inizio del sentiero. Un giro di nomi, poche regole condivise, un respiro prima di partire.
        </Ph>
      </div>
    ),
  },
  {
    title: 'Il cammino',
    content: (
      <div className="space-y-5">
        <Ph as="p" className="text-lg text-muted-foreground">
          Si cammina a passo lento, alternando tratti in silenzio e brevi soste. Ad ogni sosta una domanda semplice,
          da tenere con sé per il tratto successivo.
        </Ph>
        <Photo photo={photos.sentieroAutunno} sizes="(min-width: 768px) 640px, 100vw" className="aspect-[3/2] rounded-2xl" />
      </div>
    ),
  },
  {
    title: 'La sosta',
    content: (
      <div className="space-y-3 text-lg text-muted-foreground">
        <Ph as="p">
          In un punto aperto ci si ferma più a lungo. Chi vuole condivide, chi preferisce ascolta. Nessuno è obbligato
          a parlare.
        </Ph>
      </div>
    ),
  },
  {
    title: 'Il ritorno',
    content: (
      <div className="space-y-3 text-lg text-muted-foreground">
        <Ph as="p">
          Si scende con calma. Prima di salutarci, un momento per raccogliere quello che ognuno si porta a casa.
        </Ph>
      </div>
    ),
  },
]

export default function CamminateAscolto() {
  useSeo({ ...meta[path], path, jsonLd })
  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Percorsi', href: '/percorsi' }}
        kicker="In piccolo gruppo · Mezza giornata"
        title="Camminate di ascolto"
        lead={
          <Ph as="p">
            Una mattina nel bosco, a passo lento, con poche persone. Si alternano silenzio, piccole domande e momenti
            di condivisione, guidati da una psicologa.
          </Ph>
        }
        photo={photos.gruppo}
      />

      <Section className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="text-4xl leading-[1.06] md:text-5xl">A chi si rivolge</h2>
        </div>
        <ul className="space-y-4 text-lg md:col-span-7">
          {[
            'A chi sente il bisogno di rallentare, anche solo per qualche ora.',
            'A chi cammina poco e vuole cominciare senza fretta.',
            'A chi preferisce un gruppo piccolo a un’escursione affollata.',
            'A chi vuole conoscere sentieri della provincia meno frequentati.',
          ].map((t) => (
            <li key={t} className="flex gap-4 border-b pb-4">
              <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-castagno" />
              <Ph>{t}</Ph>
            </li>
          ))}
        </ul>
      </Section>

      <section className="py-8 md:py-12">
        <Timeline
          heading="Com’è fatta una mattina"
          intro={<Ph as="p">Ogni camminata ha lo stesso ritmo in cinque tempi. Cambiano il sentiero e la stagione.</Ph>}
          data={tappe}
        />
      </section>

      <Section className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="text-4xl leading-[1.06] md:text-5xl">In pratica</h2>
          <p className="mt-4 text-muted-foreground">
            I dettagli definitivi arriveranno con il calendario delle prime uscite.
          </p>
        </div>
        <div className="md:col-span-7">
          <FactList
            items={[
              { k: 'Durata', v: <Ph>Circa 3 ore e mezza</Ph> },
              { k: 'Gruppo', v: <Ph>Da 4 a 10 persone</Ph> },
              { k: 'Difficoltà', v: <Ph>Facile, dislivello contenuto, adatto a chi cammina poco</Ph> },
              { k: 'Dove', v: <Ph>Sentieri della provincia di Varese, indicati di volta in volta</Ph> },
              { k: 'Quando', v: <Ph>Da primavera ad autunno, anche in caso di pioggia leggera</Ph> },
              { k: 'Quota', v: <Ph>Da definire</Ph> },
            ]}
          />
          <Button asChild size="lg" className="mt-8">
            <Link to="/contatti?percorso=camminate-di-ascolto">
              Chiedi informazioni <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      <CtaBand />
    </>
  )
}
