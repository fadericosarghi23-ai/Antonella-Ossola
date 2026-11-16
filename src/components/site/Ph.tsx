import type { ElementType, ReactNode } from 'react'

/**
 * [SEGNAPOSTO] Avvolge un testo scritto da Altalogik e non ancora confermato dalla cliente.
 * Aggiungendo ?segnaposto=1 all'indirizzo, tutti i segnaposto vengono evidenziati.
 */
export function Ph({ children, as: Tag = 'span', className }: { children: ReactNode; as?: ElementType; className?: string }) {
  return (
    <Tag data-placeholder="" className={className}>
      {children}
    </Tag>
  )
}
