import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import EditorialServiceList from '@/components/ui/editorial-service-list'
import { ContourLines } from '@/components/site/ContourLines'
import { Photo } from '@/components/site/Photo'
import { CtaBand, Section } from '@/components/site/blocks'
import { Reveal, RevealImage, stagger } from '@/components/site/Reveal'
import { Ph } from '@/components/site/Ph'
import { photos } from '@/lib/photos'
import { percorsi, SITE_URL, contatti } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import { useDesktop } from '@/hooks/use-desktop'
import meta from '@/lib/routes-meta.json'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#antonella`,
      name: 'Antonella Ossola',
      jobTitle: 'Psicologa', // [SEGNAPOSTO] da confermare
      url: SITE_URL,
      areaServed: { '@type': 'AdministrativeArea', name: 'Provincia di Varese' },
      knowsAbout: ['Escursionismo', 'Psicologia', 'Benessere in natura'],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#attivita`,
      name: 'Antonella Ossola · Percorsi in natura',
      url: SITE_URL,
      email: contatti.email,
      telephone: contatti.telefono,
      areaServed: 'Provincia di Varese',
      address: { '@type': 'PostalAddress', addressLocality: 'Varese', addressRegion: 'VA', addressCountry: 'IT' },
      founder: { '@id': `${SITE_URL}/#antonella` },
    },
    { '@type': 'WebSite', url: SITE_URL, name: 'Antonella Ossola', inLanguage: 'it-IT' },
  ],
}

const luoghiTeaser = [
  { nome: 'Valle del Lanza', nota: 'Mulini e cave di Molera', photo: photos.ruscello },
  { nome: 'Sentiero Italia', nota: 'Da Marchirolo al Monte Sette Termini', photo: photos.sentieroAutunno },
  { nome: 'Valle del Bevera', nota: 'Un torrente e il suo bosco', photo: photos.sentieroVerde },
]

/**
 * Unico effetto legato allo scroll della Home: la foto dell'hero scende più lenta della pagina.
 * Solo immagine, solo da 768px in su, fermo con prefers-reduced-motion.
 */
function HeroPhoto({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const still = reduce || !desktop
  return (
    <motion.div className="absolute inset-0 -z-10" style={still ? undefined : { y, scale: 1.08 }}>
      <Photo photo={photos.hero} priority className="h-full w-full" imgClassName="object-[62%_60%] md:object-[50%_35%]" />
    </motion.div>
  )
}

export default function Home() {
  useSeo({ ...meta['/'], path: '/', jsonLd })
  const heroRef = useRef<HTMLElement>(null)

  return (
    <>
      {/* HERO: foto grande, titolo deciso, curve di livello che si tracciano una volta. Il testo è fermo. */}
      <section ref={heroRef} className="relative isolate -mt-16 overflow-hidden">
        <HeroPhoto target={heroRef} />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-carta/85 via-carta/30 to-bosco/20"
        />
        <ContourLines className="absolute inset-x-0 bottom-0 -z-10 h-[26%] w-full text-carta md:h-[34%]" />
        <div className="container-site flex min-h-[82svh] flex-col justify-start pt-32 pb-16 md:pt-40">
          <p className="kicker">
            <Ph>Varese · Psicologa e camminatrice</Ph>
          </p>
          <h1 className="mt-5 max-w-4xl text-[3.1rem] leading-[0.98] text-bosco sm:text-7xl md:text-[6.2rem]">
            <Ph>Camminare per tornare a sentirsi.</Ph>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bosco/85 md:text-xl">
            <Ph>
              Percorsi lenti nei boschi e lungo i laghi della provincia di Varese, con una psicologa che conosce i
              sentieri.
            </Ph>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/percorsi">
                Scopri i percorsi <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-bosco/25 bg-carta/70 hover:bg-carta">
              <Link to="/date">Lista d’attesa 2027</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* L'IDEA */}
      <Section className="grid gap-8 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-5">
          <p className="kicker">L’idea</p>
          <h2 className="mt-4 text-4xl leading-[1.06] md:text-5xl">
            <Ph>Il bosco come stanza, il passo come ritmo.</Ph>
          </h2>
        </Reveal>
        <Reveal delay={stagger(1)} className="space-y-5 text-lg text-muted-foreground md:col-span-6 md:col-start-7 md:pt-10">
          <Ph as="p">
            Non serve essere escursionisti esperti. Si cammina piano, su sentieri scelti perché poco frequentati, e ci
            si concede del tempo per ascoltare quello che di solito resta in sottofondo.
          </Ph>
          <Ph as="p">
            Antonella unisce due cose che conosce bene: l’ascolto, per formazione, e la montagna di casa, per passione.
          </Ph>
          <figure className="mt-6 border-l-2 border-castagno pl-5">
            <blockquote className="font-display text-2xl leading-snug text-bosco">
              “Ritornare alla natura fa bene al corpo e alla psiche.”
            </blockquote>
            <figcaption className="mt-2 text-sm">
              Antonella Ossola, intervista a <cite>Il Giorno</cite>, maggio 2020
            </figcaption>
          </figure>
        </Reveal>
      </Section>

      {/* PERCORSI: elenco editoriale (21st.dev) */}
      <Section className="pt-0 md:pt-0">
        <Reveal>
          <EditorialServiceList
            kicker="I percorsi"
            title={'Tre modi di camminare.\nUn solo passo: lento.'}
            subtitle={<Ph>Formati pensati per chi vuole fermarsi, da solo o in compagnia. Durate e prezzi in definizione.</Ph>}
            services={percorsi.map((p) => ({
              name: p.nome,
              discipline: p.sottotitolo,
              description: p.breve,
              href: p.href,
            }))}
            footer={
              <>
                <span>Tutti i percorsi si svolgono in provincia di Varese.</span>
                <Link to="/percorsi" className="link-underline text-bosco">
                  Confronta i percorsi
                </Link>
              </>
            }
          />
        </Reveal>
      </Section>

      {/* LUOGHI */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker">I luoghi</p>
            <h2 className="mt-4 max-w-2xl text-4xl leading-[1.06] md:text-5xl">
              I sentieri meno battuti, a pochi chilometri da casa.
            </h2>
          </div>
          <Link to="/luoghi" className="link-underline shrink-0 text-bosco">
            Vedi la carta dei luoghi
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {luoghiTeaser.map((l, i) => (
            <Reveal key={l.nome} delay={stagger(i)}>
              <Link to="/luoghi" className="group block">
                <RevealImage delay={stagger(i)} className="aspect-[3/2] rounded-2xl sm:aspect-[4/5]">
                  <Photo
                    photo={l.photo}
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="h-full w-full"
                    imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </RevealImage>
                <h3 className="mt-4 text-2xl transition-colors duration-150 group-hover:text-castagno">{l.nome}</h3>
                <p className="text-sm text-muted-foreground">{l.nota}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* COME FUNZIONA */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="rounded-3xl bg-pietra/70 px-6 py-10 sm:px-10 md:px-14 md:py-12">
          <p className="kicker">Come si comincia</p>
          <ol className="mt-6 grid gap-8 md:grid-cols-3">
            {[
              { t: 'Mi scrivi', d: 'Con il modulo in tre passi o su WhatsApp. Mi racconti cosa cerchi, anche in due righe.' },
              { t: 'Ci sentiamo', d: 'Una breve telefonata per capire il percorso più adatto, il ritmo e il luogo.' },
              { t: 'Camminiamo', d: 'Ci troviamo all’inizio del sentiero. Il resto lo fa il passo.' },
            ].map((s, i) => (
              <Reveal key={s.t} delay={stagger(i + 1)}>
                <li className="list-none">
                  <span className="font-display text-5xl text-castagno">{i + 1}</span>
                  <h3 className="mt-2 text-2xl">{s.t}</h3>
                  <Ph as="p" className="mt-2 text-muted-foreground">
                    {s.d}
                  </Ph>
                </li>
              </Reveal>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* CHI SONO, in breve */}
      <Section className="grid items-center gap-8 pt-0 md:grid-cols-2 md:gap-14 md:pt-0">
        <RevealImage className="aspect-[4/5] rounded-2xl md:aspect-[5/6]">
          <Photo photo={photos.luceBosco} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full" />
        </RevealImage>
        <Reveal delay={stagger(1)}>
          <p className="kicker">Chi sono</p>
          <h2 className="mt-4 text-4xl leading-[1.06] md:text-5xl">
            <Ph>Psicologa, di casa sui sentieri del Varesotto.</Ph>
          </h2>
          <Ph as="p" className="mt-5 text-lg text-muted-foreground">
            Da anni accompagno le persone a riscoprire il territorio vicino a casa. Oggi porto in cammino anche il mio
            lavoro di psicologa.
          </Ph>
          <Link to="/chi-sono" className="link-underline mt-6 inline-block text-bosco">
            La mia storia
          </Link>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  )
}
