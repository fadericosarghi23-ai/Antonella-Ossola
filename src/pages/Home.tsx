import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Footprints, MessageCircle, Phone, Sunrise, UserRound, Users, Leaf, Mountain } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import EditorialServiceList from '@/components/ui/editorial-service-list'
import { Photo } from '@/components/site/Photo'
import { CtaBand, Section } from '@/components/site/blocks'
import { Reveal, RevealImage, stagger } from '@/components/site/Reveal'
import { Ph } from '@/components/site/Ph'
import { CRINALE } from '@/components/brand/Logo'
import { photos, type PhotoSrc } from '@/lib/photos'
import { percorsi, SITE_URL, contatti } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import { useDesktop } from '@/hooks/use-desktop'
import meta from '@/lib/routes-meta.json'
import rilievo from '@/assets/terrain/rilievo-statico.webp'
import profilo from '@/assets/terrain/rilievo.json'

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

const iconaPercorso = {
  'camminate-di-ascolto': Footprints,
  'percorsi-individuali': UserRound,
  'giornate-e-ritiri': Sunrise,
} as const

const fotoPercorso: Record<string, PhotoSrc> = {
  'camminate-di-ascolto': photos.gruppo,
  'percorsi-individuali': photos.bivio,
  'giornate-e-ritiri': photos.albaLago,
}

const luoghiTeaser = [
  { n: 1, nome: 'Valle del Lanza', nota: 'Mulini e cave di Molera', photo: photos.ruscello },
  { n: 2, nome: 'Valle del Bevera', nota: 'Un torrente e il suo bosco', photo: photos.sentieroVerde },
  { n: 4, nome: 'Monte Sette Termini', nota: 'Sul Sentiero Italia, verso Luino', photo: photos.lagoDallAlto },
]

// mini profilo del Sentiero Italia per la scheda dell'hero (quote SRTM, indicativo)
const miniProfilo = (() => {
  const pts = profilo.profilo
  const kmMax = pts[pts.length - 1][0]
  return pts
    .map(([km, q], i) => `${i ? 'L' : 'M'}${((km / kmMax) * 200).toFixed(1)},${(52 - ((q - 180) / 820) * 48).toFixed(1)}`)
    .join(' ')
})()

/** Foto principale dell'hero: scende più lenta della pagina (unico effetto di scroll della Home). */
function ParallaxHero({ target, children }: { target: React.RefObject<HTMLElement | null>; children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const desktop = useDesktop()
  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  return (
    <motion.div className="h-full w-full" style={reduce || !desktop ? undefined : { y, scale: 1.06 }}>
      {children}
    </motion.div>
  )
}

export default function Home() {
  useSeo({ ...meta['/'], path: '/', jsonLd })
  const heroRef = useRef<HTMLElement>(null)
  const [aperto, setAperto] = useState(0)
  const attivo = percorsi[aperto] ?? percorsi[0]

  return (
    <>
      {/* HERO editoriale: titolo deciso a sinistra, collage di foto a destra che si apre al caricamento */}
      <section ref={heroRef} className="container-site grid items-center gap-10 pt-8 pb-14 md:grid-cols-12 md:gap-8 md:pt-12 md:pb-20 lg:min-h-[calc(100svh-4rem)]">
        <div className="md:col-span-6 lg:pr-6">
          <p className="kicker">
            <Ph>Varese · Psicologa e camminatrice</Ph>
          </p>
          <h1 className="mt-5 text-[3.1rem] leading-[0.98] text-bosco sm:text-7xl md:text-[4.6rem] lg:text-[5.4rem]">
            <Ph>Camminare per tornare a sentirsi.</Ph>
          </h1>
          <svg viewBox="0 0 92 44" className="crinale-traccia mt-6 h-8 w-20 text-castagno" aria-hidden="true">
            <path d={CRINALE} pathLength={1} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground md:text-xl">
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
            <Button asChild size="lg" variant="outline" className="border-bosco/25 bg-transparent hover:bg-card">
              <Link to="/date">Lista d’attesa 2027</Link>
            </Button>
          </div>
          <ul className="mt-10 grid gap-2 border-t pt-5 sm:grid-cols-3">
            {percorsi.map((p) => {
              const Icon = iconaPercorso[p.slug as keyof typeof iconaPercorso]
              return (
                <li key={p.slug}>
                  <Link
                    to={p.href}
                    className="group flex items-center gap-2.5 rounded-lg py-1.5 text-sm text-bosco transition-colors duration-150 hover:text-castagno"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pietra transition-colors duration-150 group-hover:bg-castagno group-hover:text-carta">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="leading-tight">{p.nome}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative h-[420px] sm:h-[520px] md:col-span-6 md:h-[600px] lg:h-[660px]">
          <div className="collage-foto absolute top-0 right-0 h-[80%] w-[80%] overflow-hidden rounded-[2rem]" style={{ '--d': '0ms' } as CSSProperties}>
            <ParallaxHero target={heroRef}>
              <Photo photo={photos.hero} priority sizes="(min-width: 768px) 45vw, 80vw" className="h-full w-full" imgClassName="object-[60%_55%]" />
            </ParallaxHero>
          </div>
          <div
            className="collage-foto absolute bottom-0 left-0 h-[52%] w-[46%] overflow-hidden rounded-[1.6rem] border-[6px] border-background"
            style={{ '--d': '120ms' } as CSSProperties}
          >
            <Photo photo={photos.gruppo} priority sizes="(min-width: 768px) 22vw, 46vw" className="h-full w-full" imgClassName="object-[50%_40%]" />
          </div>
          <div
            className="collage-foto absolute top-[6%] left-[4%] hidden h-[26%] w-[22%] overflow-hidden rounded-[1.2rem] border-[5px] border-background sm:block"
            style={{ '--d': '240ms' } as CSSProperties}
          >
            <Photo photo={photos.muschio} sizes="12vw" className="h-full w-full" />
          </div>
          {/* scheda ferma (testo leggibile dal primo frame): il Sentiero Italia citato da Antonella */}
          <Link
            to="/luoghi"
            className="group absolute right-2 bottom-3 w-[54%] rounded-2xl border bg-card/95 p-4 shadow-[0_18px_40px_-20px_rgb(30_38_32/0.45)] backdrop-blur transition-transform duration-200 hover:-translate-y-0.5 sm:right-4 sm:bottom-6 sm:p-5"
          >
            <p className="kicker flex items-center gap-1.5">
              <Mountain className="size-3.5" aria-hidden="true" /> Sentiero Italia
            </p>
            <p className="mt-1.5 font-display text-lg leading-snug text-bosco sm:text-xl">Da Porto Ceresio a Luino</p>
            <svg viewBox="0 0 200 56" className="mt-2 h-10 w-full" aria-hidden="true">
              <path d={`${miniProfilo} L200,56 L0,56 Z`} fill="var(--muschio)" fillOpacity="0.15" />
              <path d={miniProfilo} fill="none" stroke="var(--castagno)" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              Tra il lago di Lugano e il Maggiore
              <ArrowUpRight className="size-4 text-castagno transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </p>
          </Link>
        </div>
      </section>

      {/* L'IDEA: foto, testo, tre tratti del modo di camminare e citazione */}
      <section className="bg-pietra/60 py-14 md:py-20">
        <div className="container-site grid items-center gap-10 md:grid-cols-12 md:gap-12">
          <RevealImage className="relative aspect-[4/5] rounded-[2rem] md:col-span-5">
            <Photo photo={photos.luceBosco} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full" imgClassName="object-[45%_50%]" />
          </RevealImage>
          <div className="md:col-span-7">
            <Reveal>
              <p className="kicker">L’idea</p>
              <h2 className="mt-4 text-4xl leading-[1.04] md:text-6xl">
                <Ph>Il bosco come stanza, il passo come ritmo.</Ph>
              </h2>
              <div className="mt-6 grid gap-5 text-lg text-muted-foreground lg:grid-cols-2">
                <Ph as="p">
                  Non serve essere escursionisti esperti. Si cammina piano, su sentieri scelti perché poco frequentati, e
                  ci si concede del tempo per ascoltare quello che di solito resta in sottofondo.
                </Ph>
                <Ph as="p">
                  Antonella unisce due cose che conosce bene: l’ascolto, per formazione, e la montagna di casa, per
                  passione.
                </Ph>
              </div>
            </Reveal>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { Icon: Leaf, t: 'Passo lento', d: 'Si cammina senza fretta' },
                { Icon: Users, t: 'Gruppi piccoli', d: 'Poche persone alla volta' },
                { Icon: Mountain, t: 'Sentieri tranquilli', d: 'Lontano dai più battuti' },
              ].map(({ Icon, t, d }, i) => (
                <li key={t} className="list-none">
                  <Reveal delay={stagger(i + 1)} className="h-full rounded-2xl bg-background/80 p-4">
                    <Icon className="size-5 text-castagno" aria-hidden="true" />
                    <p className="mt-2 font-display text-xl text-bosco">{t}</p>
                    <Ph as="p" className="text-sm text-muted-foreground">
                      {d}
                    </Ph>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal delay={stagger(2)}>
              <figure className="mt-8 border-l-2 border-castagno pl-5">
                <blockquote className="font-display text-2xl leading-snug text-bosco md:text-3xl">
                  “Ritornare alla natura fa bene al corpo e alla psiche.”
                </blockquote>
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  Antonella Ossola, intervista a <cite>Il Giorno</cite>, maggio 2020
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PERCORSI: elenco editoriale (21st.dev) con anteprima fotografica che segue la voce aperta */}
      <Section className="grid gap-10 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-7">
          <EditorialServiceList
            kicker="I percorsi"
            title={'Tre modi di camminare.\nUn solo passo: lento.'}
            subtitle={<Ph>Formati pensati per chi vuole fermarsi, da solo o in compagnia. Durate e prezzi in definizione.</Ph>}
            state={{ expanded: aperto }}
            onStateChange={(s) => setAperto(s.expanded ?? -1)}
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
        <div className="hidden md:col-span-5 md:block">
          <RevealImage className="sticky top-28 aspect-[4/5] rounded-[2rem]">
            <div className="relative h-full w-full">
              <AnimatePresence initial={false}>
                <motion.div
                  key={attivo.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Photo photo={fotoPercorso[attivo.slug]} sizes="40vw" className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
              <Link
                to={attivo.href}
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-card/95 py-2 pr-4 pl-3 text-sm font-medium text-bosco shadow-sm transition-colors duration-150 hover:text-castagno"
              >
                <ArrowUpRight className="size-4 text-castagno" aria-hidden="true" />
                {attivo.nome}
              </Link>
            </div>
          </RevealImage>
        </div>
      </Section>

      {/* LUOGHI: il rilievo 3D in vetrina, con tre luoghi */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="kicker">I luoghi</p>
            <h2 className="mt-4 max-w-2xl text-4xl leading-[1.04] md:text-5xl">
              I sentieri meno battuti, a pochi chilometri da casa.
            </h2>
          </div>
          <Link to="/luoghi" className="link-underline shrink-0 text-bosco">
            Esplora il territorio in 3D
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <RevealImage className="rounded-[2rem] border bg-card md:col-span-7">
            <Link to="/luoghi" className="group relative block h-full">
              <img
                src={rilievo}
                alt="Rilievo in 3D della zona tra Varese, Porto Ceresio e Luino con i luoghi dei percorsi"
                width={1440}
                height={810}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
              />
              <span className="absolute top-4 left-4 rounded-full bg-bosco/90 px-3 py-1.5 text-xs font-medium text-carta">
                Rilievo reale · ruotalo nella pagina Luoghi
              </span>
            </Link>
          </RevealImage>
          <ul className="grid content-start gap-3 md:col-span-5">
            {luoghiTeaser.map((l, i) => (
              <li key={l.nome} className="list-none">
                <Reveal delay={stagger(i)}>
                  <Link
                    to="/luoghi"
                    className="group flex items-center gap-4 rounded-2xl border bg-card p-3 transition-colors duration-150 hover:border-castagno/50"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-xl">
                      <Photo
                        photo={l.photo}
                        sizes="80px"
                        className="h-full w-full"
                        imgClassName="transition-transform duration-200 ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-display text-xl text-bosco transition-colors duration-150 group-hover:text-castagno">
                        <span className="flex size-6 items-center justify-center rounded-full bg-castagno font-sans text-[0.7rem] text-carta">
                          {l.n}
                        </span>
                        {l.nome}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{l.nota}</p>
                    </div>
                    <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </Reveal>
              </li>
            ))}
            <li className="list-none">
              <Reveal delay={stagger(3)} className="rounded-2xl bg-pietra/70 p-4 text-sm text-muted-foreground">
                Luoghi citati da Antonella nell’intervista a <cite>Il Giorno</cite> del 2020.
              </Reveal>
            </li>
          </ul>
        </div>
      </Section>

      {/* COME SI COMINCIA */}
      <Section className="pt-0 md:pt-0">
        <Reveal className="rounded-[2rem] border bg-card px-6 py-10 sm:px-10 md:px-14 md:py-12">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <h2 className="text-3xl md:text-4xl">Come si comincia</h2>
            <Link to="/contatti" className="link-underline text-bosco">
              Scrivimi ora
            </Link>
          </div>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { Icon: MessageCircle, t: 'Mi scrivi', d: 'Con il modulo in tre passi o su WhatsApp. Mi racconti cosa cerchi, anche in due righe.' },
              { Icon: Phone, t: 'Ci sentiamo', d: 'Una breve telefonata per capire il percorso più adatto, il ritmo e il luogo.' },
              { Icon: Footprints, t: 'Camminiamo', d: 'Ci troviamo all’inizio del sentiero. Il resto lo fa il passo.' },
            ].map(({ Icon, t, d }, i) => (
              <li key={t} className="list-none">
                <Reveal delay={stagger(i + 1)} className="h-full rounded-2xl bg-pietra/50 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-castagno text-carta">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-display text-4xl text-castagno/30">{i + 1}</span>
                  </div>
                  <h3 className="mt-4 text-2xl">{t}</h3>
                  <Ph as="p" className="mt-2 text-muted-foreground">
                    {d}
                  </Ph>
                </Reveal>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* CHI SONO, in breve */}
      <Section className="grid items-center gap-8 pt-0 md:grid-cols-12 md:gap-12 md:pt-0">
        <RevealImage className="aspect-[16/10] rounded-[2rem] md:col-span-6">
          <Photo photo={photos.lagoColline} sizes="(min-width: 768px) 50vw, 100vw" className="h-full w-full" imgClassName="object-[50%_60%]" />
        </RevealImage>
        <Reveal delay={stagger(1)} className="md:col-span-6">
          <p className="kicker">Chi sono</p>
          <h2 className="mt-4 text-4xl leading-[1.04] md:text-5xl">
            <Ph>Psicologa, di casa sui sentieri del Varesotto.</Ph>
          </h2>
          <Ph as="p" className="mt-5 text-lg text-muted-foreground">
            Da anni accompagno le persone a riscoprire il territorio vicino a casa. Oggi porto in cammino anche il mio
            lavoro di psicologa.
          </Ph>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/chi-sono">
              La mia storia <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </Section>

      <CtaBand />
    </>
  )
}
