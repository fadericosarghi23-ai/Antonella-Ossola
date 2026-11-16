import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Stepper } from '@/components/ui/stepper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { percorsi } from '@/lib/site'
import { sendForm } from '@/lib/forms'
import { cn } from '@/lib/utils'

/*
  Richiesta guidata in tre passi (regola 5: strumento utile a chi deve chiedere informazioni).
  Nessun dato viene inviato prima dell'ultimo passo.
*/

const steps = [
  { id: 'cosa', title: 'Cosa ti interessa' },
  { id: 'come', title: 'Quando e con chi' },
  { id: 'chi', title: 'I tuoi recapiti' },
]

const opzioniPercorso = [...percorsi.map((p) => ({ v: p.slug, l: p.nome })), { v: 'non-so', l: 'Non lo so ancora' }]
const periodi = ['Primavera', 'Estate', 'Autunno', 'Indifferente']
const esperienza = ['Cammino poco', 'Cammino ogni tanto', 'Cammino spesso']

function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-xl border bg-background px-4 py-3 transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
        checked ? 'border-castagno' : 'hover:border-muschio',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-4 accent-[var(--castagno)]"
      />
      <span>{children}</span>
    </label>
  )
}

export function RequestForm() {
  const [params] = useSearchParams()
  const iniziale = percorsi.some((p) => p.slug === params.get('percorso')) ? params.get('percorso')! : ''
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    percorso: iniziale,
    periodo: '',
    persone: '1',
    esperienza: '',
    nome: '',
    email: '',
    telefono: '',
    messaggio: '',
    'bot-field': '',
  })
  const [consenso, setConsenso] = useState(false)
  const [errore, setErrore] = useState('')
  const [stato, setStato] = useState<'idle' | 'invio' | 'ok'>('idle')

  const set = (k: keyof typeof data) => (v: string) => {
    setData((d) => ({ ...d, [k]: v }))
    setErrore('')
  }

  function avanti() {
    if (step === 0 && !data.percorso) return setErrore('Scegli un’opzione per continuare.')
    setErrore('')
    setStep((s) => s + 1)
  }

  async function invia(e: React.FormEvent) {
    e.preventDefault()
    if (!data.nome.trim()) return setErrore('Scrivi il tuo nome.')
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return setErrore('Controlla l’indirizzo email.')
    if (!consenso) return setErrore('Per inviare la richiesta serve il consenso al trattamento dei dati.')
    setStato('invio')
    try {
      await sendForm('richiesta', { ...data, consenso: 'si' })
      setStato('ok')
    } catch {
      setStato('idle')
      setErrore('Non è stato possibile inviare la richiesta. Riprova, oppure scrivimi su WhatsApp.')
    }
  }

  if (stato === 'ok') {
    return (
      <div className="flex w-full flex-col items-start gap-4 py-6" role="status">
        <CheckCircle2 className="size-10 text-muschio" aria-hidden="true" />
        <h3 className="text-3xl">Grazie, {data.nome.split(' ')[0]}.</h3>
        <p className="text-lg text-muted-foreground">
          Ho ricevuto la tua richiesta. Ti rispondo entro qualche giorno all’indirizzo {data.email}.
        </p>
      </div>
    )
  }

  return (
    <form name="richiesta" onSubmit={invia} className="w-full" noValidate>
      <Stepper steps={steps} currentStep={step} className="mb-8" />
      <p className="hidden">
        <label>
          Non compilare: <input name="bot-field" value={data['bot-field']} onChange={(e) => set('bot-field')(e.target.value)} />
        </label>
      </p>

      {step === 0 && (
        <fieldset className="grid gap-3">
          <legend className="mb-3 font-display text-2xl">Quale percorso ti incuriosisce?</legend>
          {opzioniPercorso.map((o) => (
            <Choice key={o.v} name="percorso" value={o.v} checked={data.percorso === o.v} onChange={set('percorso')}>
              {o.l}
            </Choice>
          ))}
        </fieldset>
      )}

      {step === 1 && (
        <div className="grid gap-6">
          <fieldset className="grid gap-3">
            <legend className="mb-3 font-display text-2xl">In che periodo?</legend>
            <div className="grid grid-cols-2 gap-3">
              {periodi.map((p) => (
                <Choice key={p} name="periodo" value={p} checked={data.periodo === p} onChange={set('periodo')}>
                  {p}
                </Choice>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-2">
            <Label htmlFor="persone">Quante persone, te compresa o compreso?</Label>
            <Input
              id="persone"
              type="number"
              min={1}
              max={20}
              inputMode="numeric"
              value={data.persone}
              onChange={(e) => set('persone')(e.target.value)}
              className="max-w-28 bg-background"
            />
          </div>
          <fieldset className="grid gap-3">
            <legend className="mb-3 font-display text-2xl">Quanto cammini di solito?</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {esperienza.map((p) => (
                <Choice key={p} name="esperienza" value={p} checked={data.esperienza === p} onChange={set('esperienza')}>
                  {p}
                </Choice>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome e cognome</Label>
            <Input id="nome" autoComplete="name" value={data.nome} onChange={(e) => set('nome')(e.target.value)} className="bg-background" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={data.email} onChange={(e) => set('email')(e.target.value)} className="bg-background" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Telefono (facoltativo)</Label>
              <Input id="telefono" type="tel" autoComplete="tel" value={data.telefono} onChange={(e) => set('telefono')(e.target.value)} className="bg-background" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="messaggio">Vuoi aggiungere qualcosa? (facoltativo)</Label>
            <Textarea id="messaggio" rows={4} value={data.messaggio} onChange={(e) => set('messaggio')(e.target.value)} className="bg-background" />
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="consenso" checked={consenso} onCheckedChange={(v) => { setConsenso(v === true); setErrore('') }} className="mt-1" />
            <Label htmlFor="consenso" className="block text-sm leading-relaxed font-normal text-muted-foreground">
              Ho letto l’<Link to="/privacy" className="link-underline text-bosco">informativa privacy</Link> e acconsento al
              trattamento dei miei dati per ricevere una risposta.
            </Label>
          </div>
        </div>
      )}

      {errore && (
        <p role="alert" className="mt-5 text-sm text-destructive">
          {errore}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft /> Indietro
          </Button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <Button type="button" size="lg" onClick={avanti}>
            Avanti <ArrowRight />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={stato === 'invio'}>
            {stato === 'invio' ? 'Invio in corso' : 'Invia la richiesta'}
          </Button>
        )}
      </div>
    </form>
  )
}
