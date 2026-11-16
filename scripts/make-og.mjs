// Genera l'immagine Open Graph (1200x630) e l'icona apple-touch a partire dalla foto dell'hero e dal marchio.
import sharp from 'sharp'
import fs from 'node:fs'

const mark = fs.readFileSync('public/favicon.svg')
const hero = 'src/assets/photos/hero-nebbia-calda.webp'

const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EFE6" stop-opacity="0.85"/><stop offset="0.6" stop-color="#F3EFE6" stop-opacity="0.2"/><stop offset="1" stop-color="#1E2620" stop-opacity="0.25"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="80" y="250" font-family="Georgia, serif" font-size="84" fill="#1E2620">Camminare per</text>
  <text x="80" y="345" font-family="Georgia, serif" font-size="84" fill="#1E2620">tornare a sentirsi.</text>
  <text x="80" y="420" font-family="Arial, sans-serif" font-size="26" letter-spacing="4" fill="#4F5841">PERCORSI IN NATURA · VARESE</text>
  <text x="170" y="122" font-family="Georgia, serif" font-size="40" fill="#1E2620">Antonella Ossola</text>
</svg>`)

await sharp(hero)
  .resize(1200, 630, { fit: 'cover', position: 'top' })
  .composite([
    { input: overlay },
    { input: await sharp(mark).resize(72, 72).png().toBuffer(), left: 80, top: 70 },
  ])
  .jpeg({ quality: 82 })
  .toFile('public/og-image.jpg')

await sharp(mark).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('ok')
