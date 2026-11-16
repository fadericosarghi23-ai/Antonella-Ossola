import { Link } from 'react-router-dom'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CtaBand, PageHeader, Section } from '@/components/site/blocks'
import { Photo } from '@/components/site/Photo'
import { Ph } from '@/components/site/Ph'
import { photos } from '@/lib/photos'
import { percorsi } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

const foto = {
  'camminate-di-ascolto': photos.gruppo,
  'percorsi-individuali': photos.bivio,
  'giornate-e-ritiri': photos.albaLago,
} as const

// [SEGNAPOSTO] valori ipotizzati, da confermare
const confronto = [
  { k: 'Con chi', v: ['Piccolo gruppo', 'Solo tu e Antonella', 'Piccolo gruppo'] },
  { k: 'Durata', v: ['Mezza giornata', 'Circa un’ora e mezza', 'Una giornata o due'] },
  { k: 'Fatica', v: ['Facile', 'Su misura', 'Facile o media'] },
  { k: 'Adatto se', v: ['Vuoi iniziare', 'Hai una domanda tua', 'Vuoi staccare davvero'] },
]

// [SEGNAPOSTO] domande frequenti scritte da Altalogik
const faq = [
  {
    q: 'Serve essere allenati?',
    a: 'No. I sentieri delle camminate di ascolto sono facili e il passo è lento. Se hai dubbi, ne parliamo prima.',
  },
  {
    q: 'È una psicoterapia?',
    a: 'No. I percorsi sono esperienze di benessere e di ascolto in natura. Se emerge un bisogno diverso, Antonella saprà indicarti la strada più adatta.',
  },
  {
    q: 'E se piove?',
    a: 'Con pioggia leggera si cammina comunque, con l’attrezzatura giusta. In caso di maltempo l’uscita viene rinviata e avvisata per tempo.',
  },
  {
    q: 'Posso venire con un’amica o un amico?',
    a: 'Sì, nelle camminate di gruppo e nelle giornate. I percorsi individuali restano a due.',
  },
  {
    q: 'Quanto costa?',
    a: 'Le quote sono in definizione e saranno pubblicate con il calendario delle prime uscite.',
  },
]

export default function Percorsi() {
  useSeo({ ...meta['/percorsi'], path: '/percorsi' })
  return (
    <>
      <PageHeader
        kicker="Percorsi"
        title="Tre modi di camminare."
        lead={<Ph as="p">Scegli in base a quanto tempo hai, a chi vuoi accanto e a cosa cerchi.</Ph>}
      />

      <Section className="pt-12 md:pt-16">
        <div className="grid gap-6 md:grid-cols-3">
          {percorsi.map((p) => (
            <Link key={p.slug} to={p.href} className="group flex flex-col">
              <Photo
                photo={foto[p.slug as keyof typeof foto]}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[4/5] rounded-2xl"
                imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <p className="kicker mt-5">{p.sottotitolo}</p>
              <h2 className="mt-2 text-3xl transition-colors duration-150 group-hover:text-castagno">{p.nome}</h2>
              <Ph as="p" className="mt-2 text-muted-foreground">
                {p.breve}
              </Ph>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0">
        <h2 className="text-4xl leading-[1.06] md:text-5xl">A confronto</h2>
        <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Confronto tra i tre percorsi</caption>
            <thead>
              <tr className="border-b">
                <th scope="col" className="w-40 py-4" />
                {percorsi.map((p) => (
                  <th key={p.slug} scope="col" className="py-4 pr-4 align-bottom font-display text-xl font-normal">
                    <Link to={p.href} className="link-underline">
                      {p.nome}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confronto.map((r) => (
                <tr key={r.k} className="border-b">
                  <th scope="row" className="kicker py-4 pr-4 align-top font-medium">
                    {r.k}
                  </th>
                  {r.v.map((v, i) => (
                    <td key={i} className="py-4 pr-4 align-top">
                      <Ph>{v}</Ph>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="grid gap-10 pt-0 md:grid-cols-12 md:pt-0">
        <div className="md:col-span-4">
          <h2 className="text-4xl leading-[1.06] md:text-5xl">Domande frequenti</h2>
        </div>
        <Accordion type="single" collapsible className="md:col-span-8">
          {faq.map((f, i) => (
            <AccordionItem key={f.q} value={`q${i}`}>
              <AccordionTrigger className="font-display text-xl font-normal hover:no-underline md:text-2xl">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground md:text-lg">
                <Ph as="p">{f.a}</Ph>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <CtaBand />
    </>
  )
}
