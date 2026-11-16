/*
  Dati del sito. Tutto ciò che è marcato [SEGNAPOSTO] è stato scritto da Altalogik
  e va confermato o sostituito con i dati della cliente prima della pubblicazione.
*/

export const SITE_URL = 'https://antonellaossola.it' // [SEGNAPOSTO] dominio da definire

export const contatti = {
  nome: 'Antonella Ossola',
  ruolo: 'Psicologa · Percorsi in natura', // [SEGNAPOSTO] da confermare titolo e dicitura
  email: 'info@antonellaossola.it', // [SEGNAPOSTO]
  telefono: '+39 000 000 0000', // [SEGNAPOSTO]
  whatsapp: '390000000000', // [SEGNAPOSTO] numero in formato internazionale senza +
  zona: 'Varese e provincia',
  instagram: '', // [SEGNAPOSTO] se presente
}

export const legale = {
  denominazione: '[SEGNAPOSTO] Antonella Ossola',
  sede: '[SEGNAPOSTO] Indirizzo, CAP Varese (VA)',
  piva: '[SEGNAPOSTO] 00000000000',
  pec: '[SEGNAPOSTO] pec@esempio.it',
  albo: '[SEGNAPOSTO] Iscrizione Albo Psicologi della Lombardia n. 00000',
}

export type Percorso = {
  slug: string
  nome: string
  sottotitolo: string
  breve: string
  href: string
}

// [SEGNAPOSTO] formati ipotizzati da Altalogik, da confermare con la cliente
export const percorsi: Percorso[] = [
  {
    slug: 'camminate-di-ascolto',
    nome: 'Camminate di ascolto',
    sottotitolo: 'In piccolo gruppo',
    breve:
      'Mezza giornata su un sentiero facile, a passo lento, con momenti di silenzio e di condivisione guidati da una psicologa.',
    href: '/percorsi/camminate-di-ascolto',
  },
  {
    slug: 'percorsi-individuali',
    nome: 'Percorsi individuali',
    sottotitolo: 'Una persona, un sentiero',
    breve:
      'Incontri a due, camminando. Uno spazio riservato per fermarsi su una domanda, con il bosco come stanza.',
    href: '/percorsi/percorsi-individuali',
  },
  {
    slug: 'giornate-e-ritiri',
    nome: 'Giornate e ritiri',
    sottotitolo: 'Un giorno intero, o due',
    breve:
      'Una giornata o un fine settimana per staccare davvero: cammino, pause, scrittura, un pasto condiviso.',
    href: '/percorsi/giornate-e-ritiri',
  },
]

export const nav = [
  { label: 'Luoghi', href: '/luoghi' },
  { label: 'Chi sono', href: '/chi-sono' },
  { label: 'Date', href: '/date' },
]
