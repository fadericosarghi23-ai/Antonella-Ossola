# Antonella Ossola · Percorsi in natura a Varese

Sito di Antonella Ossola, psicologa: camminate di ascolto, percorsi individuali, giornate e ritiri nei boschi e lungo i laghi della provincia di Varese. Realizzato da Altalogik.

**Stato: bozza.** Testi, foto e dati legali sono in gran parte segnaposto (vedi sotto). Il sito è in `noindex` finché non va online davvero.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, struttura shadcn (`components.json`, `src/components/ui`, alias `@/`), framer-motion, React Router. Font ospitati nel sito (Fraunces, Instrument Sans). Moduli con Netlify Forms. Nessun cookie, nessuna statistica, nessun servizio esterno caricato in automatico.

```bash
npm ci
npm run dev       # sviluppo
npm run build     # tsc + build + meta per pagina e sitemap.xml (scripts/prerender-meta.mjs)
npm run preview   # anteprima della build
node scripts/check-imports.mjs   # controlla maiuscole e minuscole degli import (Netlify gira su Linux)
```

Foto: mettere i JPG originali in una cartella e lanciare `npm run photos -- <cartella>`: escono WebP in `src/assets/photos` (versione grande e `-sm`, sotto i 300 KB). Immagine social: `npm run og`.

## Pagine

| Rotta | Pagina |
| --- | --- |
| `/` | Home |
| `/percorsi` | Percorsi, confronto, domande frequenti |
| `/percorsi/camminate-di-ascolto` | Servizio principale, con timeline della mattina |
| `/percorsi/percorsi-individuali` | Pagina raccolta, tono da studio |
| `/percorsi/giornate-e-ritiri` | Programma ora per ora, cosa portare |
| `/luoghi` | Carta dei luoghi (SVG in scala) e galleria |
| `/chi-sono` | Chi sono |
| `/date` | Lista d'attesa |
| `/contatti` | Richiesta guidata in tre passi |
| `/privacy`, `/cookie` | Note legali |

## Componenti 21st.dev usati

Ogni file adattato porta in testa l'autore originale e cosa è cambiato.

- `header-2.tsx` da @efferd/header-2, con `menu-toggle-icon` e `use-scroll` di @sshahaider
- `navigation-menu-06.tsx` da @shadcnui-blocks (tendina Percorsi)
- `editorial-service-list.tsx` da @ibrandify
- `timeline.tsx` da @manuarora700
- `reveal-image-mask.tsx` da @daiwiikharihar
- `shared-element-gallery.tsx` da @jahed
- `contact-card.tsx` da @efferd
- `stepper.tsx` da @corr
- `footer-2.tsx` da @efferd
- shadcn: button, input, label, textarea, checkbox, accordion, navigation-menu

Costruiti a mano perché nel catalogo non c'era niente di adatto: hero con curve di livello (`ContourLines.tsx`), carta dei luoghi (`LuoghiMap.tsx`), lista d'attesa (`pages/Date.tsx`, il Waitlist Form del catalogo è stato scartato per blur sul testo e coriandoli).

## Identità

Logo: la sagoma reale del Campo dei Fiori vista da Varese, ricavata dai dati altimetrici (`src/components/brand/Logo.tsx`, costante `CRINALE`), con il sole color castagno. Lo stesso crinale torna come motivo nella Home, nella fascia finale, nei segnaposto foto e nell'intestazione di Contatti.

## Movimento

Tutto rispetta: testo fermo e leggibile dal primo frame, risposte entro 200ms, entrate e transizioni entro 600ms, 800ms solo per i momenti d'autore, un solo effetto legato allo scroll per pagina, scroll nativo. Con `prefers-reduced-motion` tutto è fermo e completo; sotto i 768px restano solo il momento dell'hero e le risposte.

- **Entrate** (`src/components/site/Reveal.tsx` + `index.css`): in CSS, opacità e 16px, 600ms, una volta, cascata di 80ms su massimo sei elementi; rete di sicurezza dopo 2,5s, così il contenuto non resta mai nascosto.
- **Apertura** (`src/components/site/Apertura.tsx`): alla prima visita della sessione sulla Home, su un sipario verde bosco si traccia il crinale del marchio con il sole (450ms), poi il sipario si alza e scopre le chiome (350ms). Non è un preloader: nessun contatore, non aspetta il caricamento. Mai con il movimento ridotto.
- **Home**: hero "sotto le chiome" (`src/components/site/CanopyHero.tsx`): si guarda in su tra gli alberi, la foto entra al caricamento (800ms) e scorrendo si sale sopra le chiome (la foto si ingrandisce e sfuma nel cielo, unico effetto di scroll della Home). Concetto ispirato a "Overstory Studio Landing" di kedhar-components (codice non pubblicato, quindi riscritto da zero). Poi la frase d'apertura con piccole foto nel testo, i quattro tratti, l'anteprima dei percorsi che cambia foto con la voce aperta.
- **Luoghi**: rilievo 3D reale (three.js caricato a parte, solo desktop con WebGL), trascinamento o frecce per ruotare, lo scroll fa girare il punto di vista; altrove immagine statica `src/assets/terrain/rilievo-statico.webp`.
- **Chi sono**: profilo altimetrico del Sentiero Italia che si disegna con lo scroll.
- **Camminate di ascolto**: sentiero della timeline sempre visibile, il "camminatore" che avanza con lo scroll e le tappe che si accendono al suo passaggio.
- **Giornate e ritiri**: il sole attraversa l'arco mentre si scorre il programma.
- **Percorsi, Percorsi individuali, Date**: parallasse leggera sulle foto. **Contatti**: crinale che scorre nell'intestazione.
- **Gallerie**: apertura a schermo intero con scorrimento (frecce, tastiera, trascinamento).
- **Risposte e orientamento**: focus da tastiera castagno su link e card, menu mobile animato in apertura e chiusura, header che si compatta senza spostare il contenuto, dissolvenza con lieve salita tra le pagine, foto che compaiono quando sono caricate.

Dati del rilievo e del profilo: `node scripts/make-terrain.mjs` (Terrain Tiles, Mapzen e AWS Open Data, SRTM). Il profilo è indicativo: linea retta tra le località, non il tracciato GPS.

## Segnaposto da sostituire

Nel codice: commenti `[SEGNAPOSTO]`, componente `<Ph>` e attributo `data-placeholder`. Aggiungendo `?segnaposto=1` a qualsiasi indirizzo, i testi provvisori vengono evidenziati.

- **Dati di contatto** (`src/lib/site.ts`): email, telefono, numero WhatsApp, eventuale Instagram, dominio.
- **Dati legali** (`src/lib/site.ts`, `pages/Legal.tsx`): denominazione, sede, P.IVA, PEC, iscrizione all'Albo, titolare del trattamento, tempi di conservazione.
- **Offerta**: nomi, formati, durate, dimensione dei gruppi, difficoltà, stagioni, quote dei tre percorsi; programma della giornata; contenuto dello zaino; domande frequenti; tabella di confronto.
- **Testi**: hero, "L'idea", "Come si comincia", tutte le descrizioni dei percorsi, testi di Chi sono (formazione, ruolo nel CAI), testi dei luoghi, footer.
- **Date**: "Le prime uscite partono nel 2027" da confermare.
- **Foto**: tutte provvisorie da Unsplash (crediti in `public/crediti-foto.txt`). Il ritratto di Antonella (Chi sono) è un segnaposto dichiarato, 4:5. Le gallerie delle pagine percorso andranno riempite con foto delle uscite.
- **Luoghi**: quelli citati da Antonella nell'intervista a Il Giorno (17 maggio 2020); vanno confermati come mete reali.
- **Citazioni**: due frasi di Antonella dalla stessa intervista; chiederle se vanno bene.
- **Dati strutturati** (`pages/Home.tsx` e pagine percorso): qualifica professionale.

## Messa online definitiva

1. Togliere `noindex` da `index.html` e il blocco `X-Robots-Tag` da `netlify.toml`.
2. Aggiornare il dominio in `src/lib/site.ts`, `scripts/prerender-meta.mjs`, `index.html`, `public/robots.txt`.
3. In Netlify, attivare le notifiche email dei moduli `richiesta` e `lista-attesa`.
