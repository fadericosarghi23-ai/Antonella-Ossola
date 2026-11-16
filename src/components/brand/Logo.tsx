import { cn } from '@/lib/utils'

/** Marchio: tre curve di livello chiuse, un rilievo visto dall'alto, con il centro color castagno. */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M10 46C8 30 20 14 38 12C56 10 70 22 70 38C70 54 56 66 40 66C24 66 12 60 10 46Z" />
        <path d="M20 44C19 32 28 22 40 21C52 20 60 29 60 39C60 50 51 57 41 57C30 57 21 53 20 44Z" />
        <path d="M31 40C31 33 36 28 42 28C48 28 52 33 51 39C51 45 46 48 41 48C35 48 31 45 31 40Z" />
      </g>
      <circle cx="43" cy="37" r="3" fill="var(--castagno)" />
    </svg>
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-bosco', className)}>
      <LogoMark className={compact ? 'size-8' : 'size-9'} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.2rem] tracking-[-0.01em]">Antonella Ossola</span>
        {!compact && (
          <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-muschio-scuro">
            Percorsi in natura · Varese
          </span>
        )}
      </span>
    </span>
  )
}
