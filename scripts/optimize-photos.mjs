// Converte le foto sorgente (cartella passata come argomento) in WebP ottimizzati sotto i 300 KB.
// Uso: node scripts/optimize-photos.mjs <cartella-jpg>
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const src = process.argv[2]
const out = path.resolve('src/assets/photos')
fs.mkdirSync(out, { recursive: true })
const LIMIT = 300 * 1024

for (const f of fs.readdirSync(src).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const name = f.replace(/\.(jpe?g|png)$/i, '')
  const isHero = name.startsWith('hero')
  for (const [suffix, width] of [['', isHero ? 2200 : 1600], ['-sm', 800]]) {
    let q = 78
    let w = width
    let buf
    for (;;) {
      buf = await sharp(path.join(src, f))
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: q })
        .toBuffer()
      if (buf.length <= LIMIT) break
      if (q > 60) q -= 6
      else w = Math.round(w * 0.85)
    }
    fs.writeFileSync(path.join(out, `${name}${suffix}.webp`), buf)
    console.log(`${name}${suffix}.webp ${(buf.length / 1024).toFixed(0)} KB q${q} ${w}px`)
  }
}
