/*
  Scena 3D del rilievo (pagina Luoghi). Caricata a parte con import() solo su desktop, con WebGL
  e senza preferenza di movimento ridotto: three.js non entra nel bundle principale.
  - Rilievo reale (Terrain Tiles, SRTM) del riquadro della carta 2D, esagerazione verticale 1,6.
  - Curve di livello ogni 100 m disegnate nello shader, come nel marchio.
  - Sentiero Italia (linea retta tra le località citate) e i quattro luoghi con etichette HTML.
  - Interazione: trascinamento orizzontale per ruotare. Nessun ascolto della rotella: lo scroll resta nativo.
  - Lo scroll della pagina fa girare lentamente il punto di vista (unico effetto di scroll della pagina).
  - Rendering solo quando serve (niente loop continuo).
*/
import * as THREE from 'three'
import heightUrl from '@/assets/terrain/rilievo.png'
import meta from '@/assets/terrain/rilievo.json'

export type Marker = { id: string; nome: string; lon: number; lat: number }
export type SceneApi = { setScroll: (p: number) => void; dispose: () => void }

const KM_PER_DEG_LAT = 111.2
const K = Math.cos((45.9 * Math.PI) / 180)
const EXAG = 1.6
const { lon0, lon1, lat0, lat1 } = meta.bbox
const WIDTH_KM = (lon1 - lon0) * KM_PER_DEG_LAT * K
const DEPTH_KM = (lat1 - lat0) * KM_PER_DEG_LAT

function loadHeights(): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = meta.larghezza
      c.height = meta.altezza
      const ctx = c.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' })!
      ctx.drawImage(img, 0, 0)
      const d = ctx.getImageData(0, 0, c.width, c.height).data
      const out = new Float32Array(c.width * c.height)
      const span = meta.quotaMax - meta.quotaMin
      for (let i = 0; i < out.length; i++) out[i] = meta.quotaMin + ((d[i * 4] * 256 + d[i * 4 + 1]) / 65535) * span
      resolve(out)
    }
    img.onerror = reject
    img.src = heightUrl
  })
}

export async function createScene(
  host: HTMLElement,
  markers: Marker[],
  labels: HTMLElement[],
  onReady: () => void,
): Promise<SceneApi> {
  const heights = await loadHeights()
  const W = meta.larghezza
  const H = meta.altezza

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xf3efe6, 40, 75)
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 200)

  // --- terreno ---
  const geo = new THREE.PlaneGeometry(WIDTH_KM, DEPTH_KM, W - 1, H - 1)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const at = (i: number, j: number) => heights[Math.min(H - 1, Math.max(0, j)) * W + Math.min(W - 1, Math.max(0, i))]
  const cellKm = WIDTH_KM / (W - 1)
  const c = new THREE.Color()
  const ramp: [number, THREE.Color][] = [
    [190, new THREE.Color('#8f9a6c')],
    [400, new THREE.Color('#5f6f45')],
    [700, new THREE.Color('#4f5841')],
    [1000, new THREE.Color('#6b7558')],
    [1250, new THREE.Color('#a39e8c')],
  ]
  const water = new THREE.Color('#7d959c')
  const lakes = [230.7, 238.5, 269.5] // quota dei laghi nei dati SRTM: Varese, Comabbio, Lugano
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const k = j * W + i
      const h = heights[k]
      pos.setY(k, (h / 1000) * EXAG)
      const slope = Math.hypot(at(i + 1, j) - at(i - 1, j), at(i, j + 1) - at(i, j - 1)) / (2 * cellKm * 1000)
      const flat = slope < 0.006
      if (h < 197 || (flat && lakes.some((l) => Math.abs(h - l) < 1.2))) {
        c.copy(water)
      } else {
        let a = ramp[0], b = ramp[ramp.length - 1]
        for (let r = 0; r < ramp.length - 1; r++) {
          if (h >= ramp[r][0] && h <= ramp[r + 1][0]) {
            a = ramp[r]
            b = ramp[r + 1]
            break
          }
        }
        const t = Math.min(1, Math.max(0, (h - a[0]) / (b[0] - a[0] || 1)))
        c.copy(a[1]).lerp(b[1], t)
        // pendii ripidi un po' più scuri, come nell'ombra del bosco
        c.multiplyScalar(1 - Math.min(0.25, slope * 0.35))
      }
      colors[k * 3] = c.r
      colors[k * 3 + 1] = c.g
      colors[k * 3 + 2] = c.b
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, flatShading: false })
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vQuota;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvQuota = position.y;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vQuota;')
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        float passo = ${((100 / 1000) * EXAG).toFixed(4)};
        float q = vQuota / passo;
        float fw = fwidth(q);
        // sulle superfici piatte (laghi) niente curve: evita la divisione per zero
        float linea = fw < 0.0005 ? 1.0 : abs(fract(q - 0.5) - 0.5) / fw;
        float maestra = step(0.5, 1.0 - abs(fract(q / 5.0 - 0.5) - 0.5) * 10.0);
        float forza = (1.0 - min(linea, 1.0)) * mix(0.22, 0.4, maestra);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.118, 0.149, 0.125), forza);`,
      )
  }
  const terrain = new THREE.Mesh(geo, mat)
  scene.add(terrain)

  // --- conversioni geografiche ---
  const toXZ = (lon: number, lat: number) => {
    const x = ((lon - lon0) / (lon1 - lon0) - 0.5) * WIDTH_KM
    const z = ((lat1 - lat) / (lat1 - lat0) - 0.5) * DEPTH_KM
    return { x, z }
  }
  const heightAt = (lon: number, lat: number) => {
    const fi = ((lon - lon0) / (lon1 - lon0)) * (W - 1)
    const fj = ((lat1 - lat) / (lat1 - lat0)) * (H - 1)
    return (at(Math.round(fi), Math.round(fj)) / 1000) * EXAG
  }

  // --- Sentiero Italia ---
  const routePts: THREE.Vector3[] = []
  const tappe = meta.punti
  for (let t = 0; t < tappe.length - 1; t++) {
    const a = tappe[t], b = tappe[t + 1]
    for (let s = 0; s < 24; s++) {
      const f = s / 24
      const lon = a.lon + (b.lon - a.lon) * f
      const lat = a.lat + (b.lat - a.lat) * f
      const { x, z } = toXZ(lon, lat)
      routePts.push(new THREE.Vector3(x, heightAt(lon, lat) + 0.12, z))
    }
  }
  const last = tappe[tappe.length - 1]
  const lp = toXZ(last.lon, last.lat)
  routePts.push(new THREE.Vector3(lp.x, heightAt(last.lon, last.lat) + 0.06, lp.z))
  const route = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(routePts), 400, 0.13, 8, false),
    new THREE.MeshBasicMaterial({ color: 0x8c4a2f }),
  )
  scene.add(route)

  // --- luoghi ---
  const markerPos: THREE.Vector3[] = []
  const pinMat = new THREE.MeshBasicMaterial({ color: 0x8c4a2f })
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xf3efe6 })
  for (const m of markers) {
    const { x, z } = toXZ(m.lon, m.lat)
    const y = heightAt(m.lon, m.lat)
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 6), pinMat)
    stem.position.set(x, y + 0.45, z)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), pinMat)
    head.position.set(x, y + 0.95, z)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 6, 24), ringMat)
    ring.position.copy(head.position)
    scene.add(stem, head, ring)
    markerPos.push(new THREE.Vector3(x, y + 1.35, z))
  }

  // --- luci ---
  scene.add(new THREE.HemisphereLight(0xf6f1e6, 0x2a3326, 1.1))
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4)
  sun.position.set(-20, 18, -12) // da nord ovest, come nelle carte in rilievo
  scene.add(sun)

  // --- camera e interazione ---
  const target = new THREE.Vector3(0, 0.2, -0.5)
  let scrollAz = 0
  let dragAz = 0
  let polar = 0.92 // entrata: dall'alto verso la vista finale
  const polarEnd = 0.86
  const radius = 41
  let intro = 0
  let raf = 0
  let disposed = false

  const place = () => {
    const az = -0.35 + scrollAz + dragAz
    camera.position.set(
      target.x + radius * Math.sin(polar) * Math.sin(az),
      target.y + radius * Math.cos(polar),
      target.z + radius * Math.sin(polar) * Math.cos(az),
    )
    camera.lookAt(target)
  }

  const v = new THREE.Vector3()
  const render = () => {
    place()
    renderer.render(scene, camera)
    const w = host.clientWidth
    const h = host.clientHeight
    markerPos.forEach((p, i) => {
      const el = labels[i]
      if (!el) return
      v.copy(p).project(camera)
      el.style.transform = `translate(-50%, -100%) translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`
      el.style.opacity = v.z < 1 ? '1' : '0'
    })
  }
  const request = () => {
    if (!raf && !disposed) {
      raf = requestAnimationFrame(() => {
        raf = 0
        render()
      })
    }
  }

  const resize = () => {
    const w = host.clientWidth
    const h = host.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    request()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(host)
  resize()

  // entrata d'autore: la camera scende in 800ms
  const t0 = performance.now()
  const tick = (t: number) => {
    if (disposed) return
    intro = Math.min(1, (t - t0) / 800)
    const e = 1 - Math.pow(1 - intro, 3)
    polar = 0.6 + (polarEnd - 0.6) * e
    render()
    if (intro < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  // trascinamento orizzontale (mouse e penna): ruota, senza toccare lo scroll verticale
  let dragging = false
  let lastX = 0
  const el = renderer.domElement
  el.style.cursor = 'grab'
  el.style.touchAction = 'pan-y'
  const down = (e: PointerEvent) => {
    dragging = true
    lastX = e.clientX
    el.setPointerCapture(e.pointerId)
    el.style.cursor = 'grabbing'
  }
  const move = (e: PointerEvent) => {
    if (!dragging) return
    dragAz -= (e.clientX - lastX) * 0.006
    lastX = e.clientX
    request()
  }
  const up = (e: PointerEvent) => {
    dragging = false
    el.releasePointerCapture?.(e.pointerId)
    el.style.cursor = 'grab'
  }
  el.addEventListener('pointerdown', down)
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
  el.addEventListener('pointercancel', up)

  // tastiera: frecce sinistra e destra quando la scena ha il focus
  host.tabIndex = 0
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      dragAz += e.key === 'ArrowLeft' ? 0.12 : -0.12
      request()
    }
  }
  host.addEventListener('keydown', key)

  onReady()

  return {
    setScroll(p: number) {
      scrollAz = (p - 0.5) * 0.7
      request()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      host.removeEventListener('keydown', key)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          const m = o.material as THREE.Material
          m.dispose()
        }
      })
      renderer.dispose()
      el.remove()
    },
  }
}
