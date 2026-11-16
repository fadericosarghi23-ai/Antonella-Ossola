import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Footprints, MessageCircle, Phone, Sunrise, UserRound, Users, Leaf, Mountain } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import EditorialServiceList from '@/components/ui/editorial-service-list'
import { Photo } from '@/components/site/Photo'
import { CanopyHero } from '@/components/site/CanopyHero'
import { CtaBand, Section } from '@/components/site/blocks'
import { Reveal, RevealImage, stagger } from '@/components/site/Reveal'
import { Ph } from '@/components/site/Ph'
import { CRINALE } from '@/components/brand/Logo'
import { photos, type PhotoSrc } from '@/lib/photos'
import { percorsi, SITE_URL, contatti } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'
import rilievo from '@/assets/terrain/rilievo-statico.webp'
import pillGruppo from '@/assets/photos/gruppo-bosco-xs.webp'
import pillMuschio from '@/assets/photos/muschio-xs.webp'
import pillLago from '@/assets/photos/lago-colline-xs.webp'

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



export default function Home() {
  useSeo({ ...meta['/'], path: '/', jsonLd })
  const [aperto, setAperto] = useState(0)
  const attivo = percorsi[aperto] ?? percorsi[0]

  return (
    <>
      {/* HERO "sotto le chiome": si guarda in su tra gli alberi; scorrendo si sale sopra le chiome */}
      <CanopyHero photo={photos.chiome}>
        <p className="inline-flex items-center gap-2 rounded-full border border-bosco/10 bg-carta/85 px-4 py-1.5 text-sm text-bosco shadow-sm backdrop-blur">
          <span aria-hidden="true" className="size-2 rounded-full bg-castagno" />
          <Ph>Lista d’attesa aperta · prime uscite nel 2027</Ph>
        </p>
        <h1 className="mt-6 max-w-4xl text-[3rem] leading-[0.98] text-carta [text-shadow:0_2px_24px_rgb(20_28_22/0.55),0_1px_3px_rgb(20_28_22/0.45)] sm:text-7xl md:text-[5.6rem]">
          <Ph>Camminare per tornare a sentirsi.</Ph>
        </h1>
        <svg viewBox="0 0 92 44" className="crinale-traccia mt-5 h-7 w-16 text-carta" aria-hidden="true">
          <path d={CRINALE} pathLength={1} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-4 max-w-xl text-lg font-medium text-carta [text-shadow:0_2px_24px_rgb(20_28_22/0.55),0_1px_3px_rgb(20_28_22/0.45)] md:text-xl">
          <Ph>Percorsi lenti nei boschi e lungo i laghi della provincia di Varese, con una psicologa che conosce i sentieri.</Ph>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/percorsi">
              Scopri i percorsi <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-bosco/20 bg-carta/80 backdrop-blur hover:bg-carta">
            <Link to="/date">Entra nella lista d’attesa</Link>
          </Button>
        </div>
        <ul className="mt-8 hidden flex-wrap justify-center gap-x-6 gap-y-2 rounded-full border border-bosco/10 bg-carta/85 px-6 py-2.5 shadow-sm backdrop-blur sm:flex">
          {percorsi.map((p) => {
            const Icon = iconaPercorso[p.slug as keyof typeof iconaPercorso]
            return (
              <li key={p.slug}>
                <Link to={p.href} className="group flex items-center gap-2 text-[0.95rem] text-bosco transition-colors duration-150 hover:text-castagno">
                  <Icon className="size-4 text-castagno" aria-hidden="true" />
                  <span className="underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-castagno">{p.nome}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </CanopyHero>

      {/* (01) SOPRA LE CHIOME: frase d'apertura con piccole foto nel testo e quattro tratti */}
      <section className="bg-[linear-gradient(to_bottom,var(--carta),var(--carta))] pt-8 pb-16 md:pb-24">
        <div className="container-site">
          <Reveal>
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-castagno">( 01 )</span> Sopra le chiome
            </p>
            <p className="mt-6 max-w-5xl font-display text-[1.9rem] leading-[1.18] text-bosco md:text-[3.1rem]">
              <Ph>
                Non serve essere escursionisti esperti. <span className="mx-1 inline-block h-[0.82em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline"><img src={pillGruppo} alt="Un piccolo gruppo sul sentiero" className="h-full w-full object-cover" loading="lazy" /></span> Si cammina piano, su
                sentieri poco frequentati, <span className="mx-1 inline-block h-[0.82em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline"><img src={pillMuschio} alt="Muschio nel sottobosco" className="h-full w-full object-cover" loading="lazy" /></span> e ci si concede il tempo per ascoltare
                quello che di solito resta in sottofondo. <span className="mx-1 inline-block h-[0.82em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline"><img src={pillLago} alt="Lago tra le colline" className="h-full w-full object-cover" loading="lazy" /></span>
              </Ph>
            </p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 sm:grid-cols-2">
            {[
              { Icon: Leaf, t: 'Passo lento', d: 'Si cammina senza fretta, con soste per ascoltare.' },
              { Icon: Users, t: 'Gruppi piccoli', d: 'Poche persone alla volta, per restare in ascolto.' },
              { Icon: Mountain, t: 'Sentieri tranquilli', d: 'Lontano dai percorsi più battuti della provincia.' },
              { Icon: UserRound, t: 'Una psicologa accanto', d: 'L’ascolto per formazione, la montagna per passione.' },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={stagger(i)} className="flex items-start gap-4 border-t py-6">
                <Icon className="mt-1 size-6 shrink-0 text-castagno" aria-hidden="true" />
                <div>
                  <p className="font-display text-3xl text-bosco md:text-4xl">{t}</p>
                  <Ph as="p" className="mt-1 text-muted-foreground">
                    {d}
                  </Ph>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10">
            <figure className="border-l-2 border-castagno pl-5">
              <blockquote className="font-display text-2xl leading-snug text-bosco md:text-3xl">
                “Ritornare alla natura fa bene al corpo e alla psiche.”
              </blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                Antonella Ossola, intervista a <cite>Il Giorno</cite>, maggio 2020
              </figcaption>
            </figure>
          </Reveal>
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
