import { useEffect } from 'react'
import { SITE_URL } from '@/lib/site'

type Seo = { title: string; description: string; path: string; jsonLd?: object }

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Aggiorna title, description, canonical, Open Graph e JSON-LD di pagina. */
export function useSeo({ title, description, path, jsonLd }: Seo) {
  useEffect(() => {
    document.title = title
    const url = SITE_URL + path
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
    document.getElementById('page-jsonld')?.remove()
    if (jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.id = 'page-jsonld'
      s.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(s)
    }
  }, [title, description, path, jsonLd])
}
