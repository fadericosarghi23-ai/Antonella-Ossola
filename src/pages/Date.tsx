import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHeader, Section } from '@/components/site/blocks'
import { Photo } from '@/components/site/Photo'
import { Ph } from '@/components/site/Ph'
import { Reveal, RevealImage, stagger } from '@/components/site/Reveal'
import { photos } from '@/lib/photos'
import { percorsi } from '@/lib/site'
import { sendForm } from '@/lib/forms'
import { cn } from '@/lib/utils'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

/*
  Al posto di un calendario vuoto: lista d'attesa. Costruita con i componenti base shadcn
  (il Waitlist Form di 21st.dev è stato scartato: titoli con blur, opacità zero e coriandoli).
*/
export default function DatePage() {
  useSeo({ ...meta['/date'], path: '/date' })
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [interesse, setInteresse] = useState<string[]>([])
  const [consenso, setConsenso] = useState(false)
  const [bot, setBot] = useState('')
  const [errore, setErrore] = useState('')
  const [stato, setStato] = useState<'idle' | 'invio' | 'ok'>('idle')

  async function invia(e: React.FormEvent) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErrore('Controlla l’indirizzo email.')
    if (!consenso) return setErrore('Per iscriverti serve il consenso al trattamento dei dati.')
    setStato('invio')
    try {
      await sendForm('lista-attesa', { nome, email, interesse: interesse.join(', '), consenso: 'si', 'bot-field': bot })
      setStato('ok')
    } catch {
      setStato('idle')
      setErrore('Non è stato possibile completare l’iscrizione. Riprova tra poco.')
    }
  }

  return (
    <>
      <PageHeader
        kicker="Date e lista d’attesa"
        title={<Ph>Le prime uscite partono nel 2027.</Ph>}
        lead={
          <Ph as="p">
            Il calendario è in preparazione. Lascia il tuo nome: riceverai le date prima che vengano pubblicate qui, e
            una sola email per ogni nuova stagione.
          </Ph>
        }
      />
      <Section className="grid gap-8 pt-8 md:grid-cols-12 md:pt-10">
        <Reveal className="md:col-span-7">
          {stato === 'ok' ? (
            <div className="rounded-3xl border bg-card p-8 md:p-10" role="status">
              <CheckCircle2 className="size-10 text-muschio" aria-hidden="true" />
              <h2 className="mt-4 text-3xl">Sei nella lista.</h2>
              <p className="mt-2 text-lg text-muted-foreground">Ti scriverò a {email} appena le date sono pronte.</p>
            </div>
          ) : (
            <form name="lista-attesa" onSubmit={invia} noValidate className="rounded-3xl border bg-card p-6 md:p-10">
              <h2 className="text-3xl md:text-4xl">Avvisami delle date</h2>
              <p className="hidden">
                <label>
                  Non compilare: <input name="bot-field" value={bot} onChange={(e) => setBot(e.target.value)} />
                </label>
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="wl-nome">Nome (facoltativo)</Label>
                  <Input
                    id="wl-nome"
                    autoComplete="given-name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wl-email">Email</Label>
                  <Input
                    id="wl-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrore('')
                    }}
                    className="bg-background"
                  />
                </div>
              </div>
              <fieldset className="mt-6">
                <legend className="mb-3 text-sm font-medium">Mi interessano (facoltativo)</legend>
                <div className="flex flex-wrap gap-2">
                  {percorsi.map((p) => {
                    const on = interesse.includes(p.nome)
                    return (
                      <button
                        key={p.slug}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setInteresse((x) => (on ? x.filter((y) => y !== p.nome) : [...x, p.nome]))}
                        className={cn(
                          'rounded-full border px-4 py-2 text-sm transition-colors duration-150',
                          on ? 'border-castagno bg-castagno text-primary-foreground' : 'bg-background hover:border-muschio',
                        )}
                      >
                        {p.nome}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
              <div className="mt-6 flex items-start gap-3">
                <Checkbox
                  id="wl-consenso"
                  checked={consenso}
                  onCheckedChange={(v) => {
                    setConsenso(v === true)
                    setErrore('')
                  }}
                  className="mt-1"
                />
                <Label htmlFor="wl-consenso" className="block text-sm leading-relaxed font-normal text-muted-foreground">
                  Acconsento a ricevere le date dei percorsi via email e posso cancellarmi quando voglio.{' '}
                  <Link to="/privacy" className="link-underline text-bosco">
                    Informativa privacy
                  </Link>
                </Label>
              </div>
              {errore && (
                <p role="alert" className="mt-4 text-sm text-destructive">
                  {errore}
                </p>
              )}
              <Button type="submit" size="lg" className="mt-8" disabled={stato === 'invio'}>
                {stato === 'invio' ? 'Invio in corso' : 'Entra nella lista'}
              </Button>
            </form>
          )}
        </Reveal>
        <RevealImage delay={stagger(1)} className="aspect-[4/5] rounded-3xl md:col-span-5">
          <Photo photo={photos.nebbiaAbeti} sizes="(min-width: 768px) 40vw, 100vw" className="h-full w-full" />
        </RevealImage>
      </Section>
    </>
  )
}
