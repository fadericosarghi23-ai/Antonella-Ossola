import { useSyncExternalStore } from 'react'

const QUERY = '(min-width: 768px)'

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

/** true da 768px in su. Su mobile sopravvive solo il momento dell'hero: gli altri effetti si spengono. */
export function useDesktop() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => true)
}
