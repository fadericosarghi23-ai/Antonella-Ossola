import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CtaBand, PageHeader, Section } from '@/components/site/blocks'
import { Photo } from '@/components/site/Photo'
import { Ph } from '@/components/site/Ph'
import { PercorsoGallery } from '@/components/site/PercorsoGallery'
import { Reveal, RevealImage, stagger } from '@/components/site/Reveal'
import { photos } from '@/lib/photos'
import { SITE_URL } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

const path = '/percorsi/giornate-e-ritiri'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: 'Giornate e ritiri in natura',
  description: meta[path].description,
  provider: { '@id': `${SITE_URL}/#antonella` },
  url: SITE_URL + path,
  areaServed: 'Provincia di Varese',
}

// [SEGNAPOSTO] programma tipo ipotizzato da Altalogik
const programma = [
  { ora: '8:30', cosa: 'Ritrovo e colazione leggera', nota: 'Presentazioni, il tema della giornata.' },
  { ora: '9:30', cosa: 'Primo tratto di cammino', nota: 'In silenzio, fino al primo punto panoramico.' },
  { ora: '11:30', cosa: 'Sosta e scrittura', nota: 'Un quaderno, una domanda, mezz’ora per sé.' },
  { ora: '13:00', cosa: 'Pranzo condiviso', nota: 'In rifugio o al sacco, secondo il luogo.' },
  { ora: '14:30', cosa: 'Secondo tratto, verso il lago', nota: 'Passo libero e conversazioni a due.' },
  { ora: '17:00', cosa: 'Cerchio di chiusura', nota: 'Cosa ci si porta a casa.' },
]

const zaino = [
  'Scarpe da escursione già usate',
  'Giacca impermeabile leggera',
  'Acqua, almeno un litro',
  'Un quaderno e una penna',
  'Uno strato caldo in più',
  'Pranzo al sacco, se indicato',
]

export default function GiornateRitiri() {
  useSeo({ ...meta[path], path, jsonLd })
  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Percorsi', href: '/percorsi' }}
        kicker="Un giorno intero, o un fine settimana"
        title="Giornate e ritiri"
        lead={
          <Ph as="p">
            Quando qualche ora non basta. Una giornata intera, o due, per staccare davvero: cammino, pause, scrittura e
            un pasto condiviso.
          </Ph>
        }
        photo={photos.albaLago}
      />

      <Section className="grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="kicker">Programma tipo</p>
          <h2 className="mt-4 text-4xl leading-[1.06] md:text-5xl">Una giornata, ora per ora</h2>
          <p className="mt-4 text-muted-foreground">
            <Ph>Indicativo: il programma reale cambia con il luogo e la stagione.</Ph>
          </p>
        </Reveal>
        <ol className="md:col-span-8">
          {programma.map((p, i) => (
            <li key={p.ora}>
              <Reveal delay={stagger(i)} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t py-4 sm:grid-cols-[6rem_1fr]">
              <span className="font-display text-2xl text-castagno tabular-nums">{p.ora}</span>
              <div>
                <h3 className="font-sans text-lg font-medium tracking-normal">
                  <Ph>{p.cosa}</Ph>
                </h3>
                <Ph as="p" className="text-muted-foreground">
                  {p.nota}
                </Ph>
              </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="grid items-center gap-8 pt-0 md:grid-cols-2 md:gap-14 md:pt-0">
        <RevealImage className="aspect-[4/3] rounded-2xl">
          <Photo photo={photos.pontile} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full" />
        </RevealImage>
        <Reveal delay={stagger(1)}>
          <h2 className="text-4xl leading-[1.06] md:text-5xl">Il fine settimana</h2>
          <Ph as="p" className="mt-5 text-lg text-muted-foreground">
            Due giorni con una notte in struttura, in un luogo vicino al sentiero. Il secondo giorno si cammina più a
            lungo e si chiude con un momento di restituzione.
          </Ph>
          <p className="mt-6 text-sm text-muted-foreground">
            <Ph>Strutture, date e quote saranno comunicate con il calendario 2027.</Ph>
          </p>
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal className="rounded-3xl bg-pietra/70 px-6 py-10 sm:px-10 md:px-14">
          <h2 className="text-3xl md:text-4xl">Nello zaino</h2>
          <ul className="mt-8 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {zaino.map((z) => (
              <li key={z} className="flex items-start gap-3 text-lg">
                <Check className="mt-1 size-5 shrink-0 text-muschio" aria-hidden="true" />
                <Ph>{z}</Ph>
              </li>
            ))}
          </ul>
        </Reveal>
        <Button asChild size="lg" className="mt-8">
          <Link to="/contatti?percorso=giornate-e-ritiri">
            Chiedi il programma <ArrowRight />
          </Link>
        </Button>
      </Section>

      <Section className="pt-0 md:pt-0">
        <PercorsoGallery id="giornate" title="Dal bosco al lago" photos={[photos.albaLago, photos.lagoColline, photos.nebbiaAbeti]} />
      </Section>

      <CtaBand />
    </>
  )
}
