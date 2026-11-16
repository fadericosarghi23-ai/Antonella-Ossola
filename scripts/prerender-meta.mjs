// Dopo la build: crea dist/<pagina>/index.html con title, description, canonical e Open Graph propri,
// così ogni pagina ha i meta giusti anche per chi non esegue JavaScript. Genera anche sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'

const SITE = 'https://antonellaossola.it' // [SEGNAPOSTO] dominio definitivo
const meta = JSON.parse(fs.readFileSync('src/lib/routes-meta.json', 'utf8'))
const base = fs.readFileSync('dist/index.html', 'utf8')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

for (const [route, m] of Object.entries(meta)) {
  const url = SITE + route
  const html = base
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(m.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
  if (route === '/') {
    fs.writeFileSync('dist/index.html', html)
  } else {
    const dir = path.join('dist', route)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html)
  }
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(meta)
  .map((r) => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')}
</urlset>
`
fs.writeFileSync('dist/sitemap.xml', sitemap)
console.log(`prerender-meta: ${Object.keys(meta).length} pagine, sitemap.xml scritta`)
