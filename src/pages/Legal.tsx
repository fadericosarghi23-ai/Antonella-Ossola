import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Ph } from '@/components/site/Ph'
import { contatti, legale } from '@/lib/site'
import { useSeo } from '@/hooks/use-seo'
import meta from '@/lib/routes-meta.json'

/*
  Testi legali aggiornati a ciò che il sito usa davvero: hosting e moduli Netlify, nessun cookie,
  font ospitati sul sito, nessuna statistica, nessuna mappa esterna.
  [SEGNAPOSTO] dati del titolare da completare e testo da far verificare alla cliente.
*/

function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="container-site max-w-3xl py-16 md:py-24">
      <p className="kicker">Note legali</p>
      <h1 className="mt-4 text-5xl leading-[1.04] md:text-6xl">{title}</h1>
      <p className="mt-4 text-sm text-muted-foreground">Ultimo aggiornamento: {updated}</p>
      <div className="mt-10 space-y-8 text-[1.02rem] leading-relaxed [&_h2]:mt-12 [&_h2]:text-3xl [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  )
}

export function Privacy() {
  useSeo({ ...meta['/privacy'], path: '/privacy' })
  return (
    <LegalLayout title="Informativa privacy" updated="novembre 2026">
      <section>
        <h2>Titolare del trattamento</h2>
        <Ph as="p">
          {legale.denominazione}, {legale.sede}, P.IVA {legale.piva}, PEC {legale.pec}, email {contatti.email}.
        </Ph>
      </section>
      <section>
        <h2>Quali dati raccoglie il sito</h2>
        <ul>
          <li>
            <strong>Richiesta di informazioni</strong> (pagina Contatti): nome, email, telefono se indicato, percorso di
            interesse, periodo, numero di persone, abitudine a camminare ed eventuale messaggio.
          </li>
          <li>
            <strong>Lista d’attesa</strong> (pagina Date): email, nome se indicato, percorsi di interesse.
          </li>
          <li>
            <strong>Dati tecnici di navigazione</strong>: il fornitore di hosting registra in automatico dati come
            l’indirizzo IP e le pagine richieste, per motivi di sicurezza e funzionamento.
          </li>
        </ul>
        <p>
          Nei moduli ti chiediamo di non inserire informazioni sulla salute o altri dati particolari: per quelli c’è
          il colloquio di persona.
        </p>
      </section>
      <section>
        <h2>Perché e su quale base</h2>
        <ul>
          <li>Rispondere alla tua richiesta: misure precontrattuali richieste da te (art. 6.1.b GDPR).</li>
          <li>Inviarti le date dei percorsi se ti iscrivi alla lista d’attesa: consenso (art. 6.1.a GDPR), revocabile in qualsiasi momento.</li>
          <li>Sicurezza del sito: legittimo interesse del titolare (art. 6.1.f GDPR).</li>
        </ul>
      </section>
      <section>
        <h2>Per quanto tempo</h2>
        <Ph as="p">
          Le richieste di informazioni sono conservate per il tempo necessario a rispondere e comunque non oltre 12
          mesi. L’iscrizione alla lista d’attesa resta attiva finché non chiedi la cancellazione.
        </Ph>
      </section>
      <section>
        <h2>Chi tratta i dati per conto del titolare</h2>
        <p>
          Il sito è ospitato da Netlify, Inc. (San Francisco, Stati Uniti), che gestisce anche la ricezione dei moduli.
          Il trasferimento dei dati verso gli Stati Uniti avviene sulla base delle garanzie previste dal GDPR (Data
          Privacy Framework e clausole contrattuali standard).
        </p>
        <p>
          Se scegli di scrivere su WhatsApp, lasci il sito e il trattamento dei dati segue le condizioni di WhatsApp.
        </p>
      </section>
      <section>
        <h2>I tuoi diritti</h2>
        <p>
          Puoi chiedere in ogni momento accesso, rettifica, cancellazione, limitazione, portabilità dei tuoi dati,
          opporti al trattamento e revocare il consenso, scrivendo a {contatti.email}. Puoi anche presentare reclamo al
          Garante per la protezione dei dati personali (garanteprivacy.it).
        </p>
      </section>
      <section>
        <h2>Cookie</h2>
        <p>
          Il sito non usa cookie di profilazione né strumenti di statistica. Dettagli nella{' '}
          <Link to="/cookie" className="link-underline">
            pagina cookie
          </Link>
          .
        </p>
      </section>
    </LegalLayout>
  )
}

export function Cookie() {
  useSeo({ ...meta['/cookie'], path: '/cookie' })
  return (
    <LegalLayout title="Cookie" updated="novembre 2026">
      <section>
        <h2>In breve</h2>
        <p>
          Questo sito non installa cookie di profilazione, non usa strumenti di statistica e non carica contenuti da
          servizi esterni. Per questo non ti chiediamo alcun consenso all’ingresso.
        </p>
      </section>
      <section>
        <h2>Cosa usa il sito</h2>
        <ul>
          <li>I caratteri tipografici sono ospitati sul sito stesso: nessuna richiesta a Google Fonts.</li>
          <li>La carta dei luoghi è disegnata nel sito: nessun servizio di mappe esterno.</li>
          <li>
            I moduli sono gestiti dal fornitore di hosting (Netlify) senza cookie di tracciamento. Vedi l’
            <Link to="/privacy" className="link-underline">
              informativa privacy
            </Link>
            .
          </li>
        </ul>
      </section>
      <section>
        <h2>Link esterni</h2>
        <p>
          I collegamenti a WhatsApp aprono un servizio esterno, che applica le proprie regole sui cookie solo dopo il
          tuo clic.
        </p>
      </section>
      <section>
        <h2>Se in futuro cambiasse qualcosa</h2>
        <p>
          Se verranno aggiunti strumenti che usano cookie non tecnici, questa pagina sarà aggiornata e ti verrà chiesto
          il consenso prima di attivarli.
        </p>
      </section>
    </LegalLayout>
  )
}
