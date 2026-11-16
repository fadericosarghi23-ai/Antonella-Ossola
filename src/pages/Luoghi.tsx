import { Gallery, GalleryGrid, GalleryImage } from '@/components/ui/shared-element-gallery'
import { LuoghiMap, type Luogo } from '@/components/site/LuoghiMap'
import { Rilievo3D } from '@/components/site/Rilievo3D'
import { CtaBand, PageHeader, Section } from '@/components/site/blocks'
import { Ph } from '@/components/site/Ph'
import { Reveal, stagger } from '@/components/site/Reveal'
import { photos } from '@/lib/photos'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

const fonteGiorno = 'Luogo indicato da Antonella in un’intervista a Il Giorno, maggio 2020.'

/*
  I luoghi sono quelli che Antonella ha citato nell'intervista del 2020 come sentieri meno frequentati.
  [SEGNAPOSTO] Vanno confermati come mete effettive dei percorsi; testi descrittivi scritti da Altalogik.
*/
const luoghi: Luogo[] = [
  {
    id: 'lanza',
    nome: 'Valle del Lanza',
    zona: 'Malnate e Cagno',
    lat: 45.803,
    lon: 8.905,
    testo:
      'Una valle stretta e boscosa lungo il torrente, con i vecchi mulini e le cave di Molera. Un sentiero facile, adatto a chi comincia.',
    fonte: fonteGiorno,
    photo: photos.ruscello,
  },
  {
    id: 'bevera',
    nome: 'Valle del Bevera',
    zona: 'Arcisate e dintorni',
    lat: 45.862,
    lon: 8.885,
    testo:
      'Interessante dal punto di vista naturalistico: un torrente, il suo bosco e un paesaggio che cambia molto con le stagioni.',
    fonte: fonteGiorno,
    photo: photos.sentieroVerde,
  },
  {
    id: 'ceresio',
    nome: 'Da Porto Ceresio a Marchirolo',
    zona: 'Sentiero Italia',
    lat: 45.93,
    lon: 8.862,
    testo:
      'Una tappa del Sentiero Italia che sale dal lago passando per Cuasso al Monte e Marzio, tra boschi di castagno e radure.',
    fonte: fonteGiorno,
    photo: photos.castagne,
  },
  {
    id: 'settetermini',
    nome: 'Monte Sette Termini',
    zona: 'Sentiero Italia, verso Luino',
    lat: 45.978,
    lon: 8.79,
    testo:
      'Da Marchirolo a Luino passando dal Monte Sette Termini: il tratto più ampio, con lo sguardo che si apre sul Lago Maggiore.',
    fonte: fonteGiorno,
    photo: photos.lagoDallAlto,
  },
]

// Punti per il rilievo 3D (costante di modulo: non cambia a ogni render)
const marcatori = luoghi.map((l) => ({ id: l.id, nome: l.nome, lon: l.lon, lat: l.lat }))

const galleria = [
  photos.nebbiaAbeti,
  photos.lagoColline,
  photos.muschio,
  photos.pontile,
  photos.castagne,
  photos.sentieroAutunno,
  photos.luceBosco,
  photos.ruscello,
  photos.albaLago,
]

export default function Luoghi() {
  useSeo({ ...meta['/luoghi'], path: '/luoghi' })
  return (
    <>
      <PageHeader
        kicker="I luoghi"
        title="I sentieri meno battuti, a pochi chilometri da casa."
        lead={
          <p>
            In un’intervista del 2020 Antonella invitava a riscoprire il territorio vicino, scegliendo itinerari poco
            frequentati. Questi sono alcuni dei luoghi che citava.
          </p>
        }
      />

      {/* Momento d'autore: il rilievo reale del territorio, in 3D */}
      <Section className="pt-8 md:pt-10">
        <Reveal>
          <Rilievo3D markers={marcatori} />
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-8">
          <h2 className="text-3xl md:text-4xl">Quattro luoghi, da vicino</h2>
        </Reveal>
        <Reveal>
          <LuoghiMap luoghi={luoghi} />
        </Reveal>
      </Section>

      <Section className="pt-0 md:pt-0">
        <Reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="text-4xl leading-[1.06] md:text-5xl">Stagioni e dettagli</h2>
          <Ph as="p" className="max-w-sm text-muted-foreground">
            Foto provvisorie: saranno sostituite con immagini scattate sui percorsi.
          </Ph>
        </Reveal>
        <Gallery>
          <GalleryGrid>
            {galleria.map((p, i) => (
              <Reveal key={i} delay={stagger(i % 3)} className={i >= 6 ? 'hidden break-inside-avoid sm:block' : 'break-inside-avoid'}>
                <GalleryImage
                  id={`g${i}`}
                  src={p.sm}
                  full={p.src}
                  width={800}
                  height={Math.round((800 * p.h) / p.w)}
                  alt={p.alt}
                />
              </Reveal>
            ))}
          </GalleryGrid>
        </Gallery>
      </Section>

      <CtaBand title="Hai un sentiero del cuore?" text="Raccontamelo: alcuni percorsi nasceranno dai luoghi di chi cammina con me." />
    </>
  )
}
