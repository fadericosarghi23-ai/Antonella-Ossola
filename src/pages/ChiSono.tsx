import { Link } from 'react-router-dom'
import { RevealImageMask } from '@/components/ui/reveal-image-mask'
import { CtaBand, PageHeader, Section } from '@/components/site/blocks'
import { Ph } from '@/components/site/Ph'
import { Reveal, stagger } from '@/components/site/Reveal'
import { photos } from '@/lib/photos'
import { SITE_URL } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: { '@id': `${SITE_URL}/#antonella` },
}

export default function ChiSono() {
  useSeo({ ...meta['/chi-sono'], path: '/chi-sono', jsonLd })
  return (
    <>
      <PageHeader
        kicker="Chi sono"
        title={<Ph>Ascolto le persone. E da sempre, i sentieri.</Ph>}
        lead={
          <Ph as="p">
            Mi chiamo Antonella Ossola, sono psicologa e vivo in provincia di Varese. Questo progetto nasce
            dall’incontro tra le due cose che conosco meglio.
          </Ph>
        }
      />

      {/* Momento d'autore della pagina: la foto si apre con lo scroll (solo l'immagine si muove) */}
      <Section className="pt-8 md:pt-10">
        <RevealImageMask
          src={photos.luceBosco.src}
          srcSet={`${photos.luceBosco.sm} 800w, ${photos.luceBosco.src} 1600w`}
          alt="[SEGNAPOSTO] Ritratto di Antonella sul sentiero, da fotografare"
        />
        <Ph as="p" className="mt-3 text-sm text-muted-foreground">
          Qui andrà un ritratto di Antonella in cammino, scattato su uno dei suoi sentieri.
        </Ph>
      </Section>

      <Section className="grid gap-10 pt-0 md:grid-cols-2 md:gap-14 md:pt-0">
        <Reveal className="border-t pt-6">
          <p className="kicker">Per formazione</p>
          <h2 className="mt-3 text-3xl md:text-4xl">La psicologa</h2>
          <Ph as="p" className="mt-4 text-lg text-muted-foreground">
            Il mio lavoro è ascoltare e aiutare le persone a dare forma a quello che vivono. Formazione, iscrizione
            all’Albo e ambiti di lavoro saranno indicati qui.
          </Ph>
        </Reveal>
        <Reveal delay={stagger(1)} className="border-t pt-6">
          <p className="kicker">Per passione</p>
          <h2 className="mt-3 text-3xl md:text-4xl">La montagna di casa</h2>
          <Ph as="p" className="mt-4 text-lg text-muted-foreground">
            Cammino da anni sulle montagne della provincia e ho fatto parte attiva del CAI di Varese, di cui sono stata
            presidente. Conosco i sentieri, i loro tempi e le loro attenzioni.
          </Ph>
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal>
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote className="font-display text-3xl leading-snug text-bosco md:text-5xl">
            “Muoviamoci con garbo, gentilezza, come quando siamo ospiti a casa di qualcuno.”
          </blockquote>
          <figcaption className="mt-6 text-sm text-muted-foreground">
            Antonella Ossola, intervista a <cite>Il Giorno</cite>, 17 maggio 2020
          </figcaption>
        </figure>
        </Reveal>
      </Section>

      <Section className="grid gap-10 pt-0 md:grid-cols-12 md:pt-0">
        <Reveal className="md:col-span-5">
          <h2 className="text-4xl leading-[1.06] md:text-5xl">Perché camminare</h2>
        </Reveal>
        <Reveal delay={stagger(1)} className="space-y-5 text-lg text-muted-foreground md:col-span-7">
          <Ph as="p">
            Camminando lo sguardo si apre, il respiro rallenta, le parole arrivano con meno fatica. Non serve andare
            lontano: i boschi e i laghi della provincia offrono sentieri tranquilli a pochi chilometri da casa.
          </Ph>
          <Ph as="p">
            Con questi percorsi voglio offrire un tempo protetto, all’aperto, in cui stare bene con sé e con gli altri.
          </Ph>
          <Link to="/percorsi" className="link-underline inline-block text-bosco">
            Scopri i percorsi
          </Link>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  )
}
