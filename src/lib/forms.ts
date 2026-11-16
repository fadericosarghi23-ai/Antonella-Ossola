/*
  Invio dei moduli tramite Netlify Forms: nessun servizio esterno, nessun cookie.
  I moduli sono dichiarati anche in index.html (versione statica nascosta) perché Netlify li rilevi in build.
*/
export async function sendForm(formName: string, data: Record<string, string>) {
  const body = new URLSearchParams({ 'form-name': formName, ...data }).toString()
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error(`Invio non riuscito (${res.status})`)
}
