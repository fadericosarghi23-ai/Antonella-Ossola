// Verifica che ogni import locale corrisponda a un file con maiuscole e minuscole esatte
// (Netlify compila su Linux, dove "Photo" e "photo" sono file diversi).
import fs from 'node:fs'
import path from 'node:path'

const files = []
;(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name)
    if (f.isDirectory()) walk(p)
    else if (/\.(tsx?)$/.test(f.name)) files.push(p)
  }
})('src')

function exactExists(rel) {
  const parts = rel.split(path.sep)
  let cur = '.'
  for (const part of parts) {
    if (!fs.readdirSync(cur).includes(part)) return false
    cur = path.join(cur, part)
  }
  return true
}

let problems = 0
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8')
  for (const m of src.matchAll(/from\s+['"](@\/[^'"]+|\.{1,2}\/[^'"]+)['"]/g)) {
    const spec = m[1]
    const base = spec.startsWith('@/') ? path.join('src', spec.slice(2)) : path.join(path.dirname(f), spec)
    const cand = [base, `${base}.ts`, `${base}.tsx`].find((x) => fs.existsSync(x) && fs.statSync(x).isFile())
    if (!cand || !exactExists(path.normalize(cand))) {
      problems++
      console.log('PROBLEMA', f, spec)
    }
  }
}
console.log(`${files.length} file controllati, problemi: ${problems}`)
process.exit(problems ? 1 : 0)
