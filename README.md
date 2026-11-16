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

## Movimento

- Hero: sei curve di livello si tracciano una volta (800ms, 80ms tra una e l'altra). Unico effetto attivo anche su mobile.
- Camminate di ascolto: la linea della timeline segue lo scroll (unico effetto di scroll della pagina).
- Chi sono: la foto si apre con una maschera legata allo scroll (solo l'immagine).
- Luoghi: al clic su un luogo la foto si apre con una maschera (600ms); galleria con ingrandimento condiviso al clic.
- Tutto il resto è risposta (hover, focus, apertura menu e accordion) o orientamento (dissolvenza di 200ms tra pagine, header che si compatta).
- Con `prefers-reduced-motion` tutto si ferma e il contenuto resta completo. Sotto i 768px restano solo le curve dell'hero.

## Segnaposto da sostituire

Nel codice: commenti `[SEGNAPOSTO]`, componente `<Ph>` e attributo `data-placeholder`. Aggiungendo `?segnaposto=1` a qualsiasi indirizzo, i testi provvisori vengono evidenziati.

- **Dati di contatto** (`src/lib/site.ts`): email, telefono, numero WhatsApp, eventuale Instagram, dominio.
- **Dati legali** (`src/lib/site.ts`, `pages/Legal.tsx`): denominazione, sede, P.IVA, PEC, iscrizione all'Albo, titolare del trattamento, tempi di conservazione.
- **Offerta**: nomi, formati, durate, dimensione dei gruppi, difficoltà, stagioni, quote dei tre percorsi; programma della giornata; contenuto dello zaino; domande frequenti; tabella di confronto.
- **Testi**: hero, "L'idea", "Come si comincia", tutte le descrizioni dei percorsi, testi di Chi sono (formazione, ruolo nel CAI), testi dei luoghi, footer.
- **Date**: "Le prime uscite partono nel 2027" da confermare.
- **Foto**: tutte provvisorie da Unsplash (crediti in `public/crediti-foto.txt`). Manca il ritratto di Antonella.
- **Luoghi**: quelli citati da Antonella nell'intervista a Il Giorno (17 maggio 2020); vanno confermati come mete reali.
- **Citazioni**: due frasi di Antonella dalla stessa intervista; chiederle se vanno bene.
- **Dati strutturati** (`pages/Home.tsx` e pagine percorso): qualifica professionale.

## Messa online definitiva

1. Togliere `noindex` da `index.html` e il blocco `X-Robots-Tag` da `netlify.toml`.
2. Aggiornare il dominio in `src/lib/site.ts`, `scripts/prerender-meta.mjs`, `index.html`, `public/robots.txt`.
3. In Netlify, attivare le notifiche email dei moduli `richiesta` e `lista-attesa`.
