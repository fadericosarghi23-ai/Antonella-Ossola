// Genera la mappa delle altezze del rilievo 3D (pagina Luoghi) e il profilo altimetrico del Sentiero Italia.
// Fonte: Terrain Tiles (Mapzen / AWS Open Data, formato "terrarium"), dati SRTM e altri, uso libero con attribuzione.
// Si lancia una volta sola: node scripts/make-terrain.mjs
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

// Stesso riquadro della carta 2D (src/components/site/LuoghiMap.tsx)
const LON0 = 8.66, LON1 = 8.99, LAT0 = 45.76, LAT1 = 46.03
const Z = 12
const OUT_W = 256 // colonne della mappa delle altezze
const OUT_DIR = 'src/assets/terrain'

const lon2x = (lon) => ((lon + 180) / 360) * 2 ** Z
const lat2y = (lat) => {
  const r = (lat * Math.PI) / 180
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** Z
}

const x0 = Math.floor(lon2x(LON0)), x1 = Math.floor(lon2x(LON1))
const y0 = Math.floor(lat2y(LAT1)), y1 = Math.floor(lat2y(LAT0))
const TW = (x1 - x0 + 1) * 256, TH = (y1 - y0 + 1) * 256
const elev = new Float32Array(TW * TH)

for (let tx = x0; tx <= x1; tx++) {
  for (let ty = y0; ty <= y1; ty++) {
    const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${url} ${res.status}`)
    const { data } = await sharp(Buffer.from(await res.arrayBuffer())).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    for (let py = 0; py < 256; py++) {
      for (let px = 0; px < 256; px++) {
        const i = (py * 256 + px) * 3
        const h = data[i] * 256 + data[i + 1] + data[i + 2] / 256 - 32768
        elev[((ty - y0) * 256 + py) * TW + (tx - x0) * 256 + px] = h
      }
    }
    process.stdout.write('.')
  }
}
console.log(`\n${(x1 - x0 + 1) * (y1 - y0 + 1)} tasselle`)

// campionamento bilineare in coordinate geografiche
const sample = (lon, lat) => {
  const fx = (lon2x(lon) - x0) * 256, fy = (lat2y(lat) - y0) * 256
  const ix = Math.max(0, Math.min(TW - 2, Math.floor(fx))), iy = Math.max(0, Math.min(TH - 2, Math.floor(fy)))
  const dx = fx - ix, dy = fy - iy
  const a = elev[iy * TW + ix], b = elev[iy * TW + ix + 1], c = elev[(iy + 1) * TW + ix], d = elev[(iy + 1) * TW + ix + 1]
  return a * (1 - dx) * (1 - dy) + b * dx * (1 - dy) + c * (1 - dx) * dy + d * dx * dy
}

const K = Math.cos((45.9 * Math.PI) / 180)
const OUT_H = Math.round((OUT_W * (LAT1 - LAT0)) / ((LON1 - LON0) * K))
const grid = new Float32Array(OUT_W * OUT_H)
let min = Infinity, max = -Infinity
for (let j = 0; j < OUT_H; j++) {
  for (let i = 0; i < OUT_W; i++) {
    const lon = LON0 + ((LON1 - LON0) * i) / (OUT_W - 1)
    const lat = LAT1 - ((LAT1 - LAT0) * j) / (OUT_H - 1)
    const h = sample(lon, lat)
    grid[j * OUT_W + i] = h
    if (h < min) min = h
    if (h > max) max = h
  }
}

// PNG RGB a 8 bit leggibile da canvas: quota a 16 bit divisa in R (byte alto) e G (byte basso)
const buf = Buffer.alloc(OUT_W * OUT_H * 3)
for (let k = 0; k < grid.length; k++) {
  const v = Math.round(((grid[k] - min) / (max - min)) * 65535)
  buf[k * 3] = v >> 8
  buf[k * 3 + 1] = v & 255
}
fs.mkdirSync(OUT_DIR, { recursive: true })
await sharp(buf, { raw: { width: OUT_W, height: OUT_H, channels: 3 } })
  .png({ compressionLevel: 9, palette: false })
  .toFile(path.join(OUT_DIR, 'rilievo.png'))

// Profilo del Sentiero Italia citato nell'intervista: Porto Ceresio, Cuasso al Monte, Marzio, Marchirolo, Monte Sette Termini, Luino
const tappe = [
  ['Porto Ceresio', 8.898, 45.906],
  ['Cuasso al Monte', 8.878, 45.912],
  ['Marzio', 8.857, 45.938],
  ['Marchirolo', 8.836, 45.951],
  ['Monte Sette Termini', 8.795, 45.975],
  ['Luino', 8.744, 46.001],
]
const R = 6371
const dist = (a, b) => {
  const dLat = ((b[2] - a[2]) * Math.PI) / 180, dLon = ((b[1] - a[1]) * Math.PI) / 180
  const m = Math.sin(dLat / 2) ** 2 + Math.cos((a[2] * Math.PI) / 180) * Math.cos((b[2] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(m))
}
const profilo = []
let km = 0
for (let t = 0; t < tappe.length - 1; t++) {
  const a = tappe[t], b = tappe[t + 1], seg = dist(a, b), n = Math.max(2, Math.round(seg * 10))
  for (let s = 0; s < n; s++) {
    const f = s / n
    profilo.push([+(km + seg * f).toFixed(2), Math.round(sample(a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f))])
  }
  km += seg
}
profilo.push([+km.toFixed(2), Math.round(sample(tappe.at(-1)[1], tappe.at(-1)[2]))])
const punti = tappe.map((t, i) => ({
  nome: t[0],
  lon: t[1],
  lat: t[2],
  km: +tappe.slice(0, i + 1).reduce((acc, cur, k, arr) => (k ? acc + dist(arr[k - 1], cur) : 0), 0).toFixed(2),
  quota: Math.round(sample(t[1], t[2])),
}))

fs.writeFileSync(
  path.join(OUT_DIR, 'rilievo.json'),
  JSON.stringify(
    {
      fonte: 'Terrain Tiles, Mapzen e AWS Open Data (SRTM e altri). Linea retta tra le località, non il tracciato GPS.',
      bbox: { lon0: LON0, lon1: LON1, lat0: LAT0, lat1: LAT1 },
      larghezza: OUT_W,
      altezza: OUT_H,
      quotaMin: Math.round(min),
      quotaMax: Math.round(max),
      profilo,
      punti,
    },
    null,
    1,
  ),
)
console.log(`rilievo ${OUT_W}x${OUT_H}, quote ${Math.round(min)}..${Math.round(max)} m, profilo ${profilo.length} punti, ${km.toFixed(1)} km`)
