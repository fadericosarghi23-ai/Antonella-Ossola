import { cn } from '@/lib/utils'

/*
  Marchio: la sagoma reale del Campo dei Fiori vista da Varese (ricavata dai dati altimetrici SRTM,
  vedi scripts/make-terrain.mjs) con il sole color castagno. Proporzione 2:1.
*/
export const CRINALE =
  'M2.0,37.6 C2.2,37.6 2.9,37.4 3.4,37.2 C3.9,36.9 4.3,36.5 4.8,36.1 C5.3,35.8 5.7,35.3 6.2,34.9 C6.7,34.4 7.1,34.0 7.6,33.4 C8.1,32.8 8.5,32.1 9.0,31.3 C9.5,30.6 9.9,29.7 10.4,29.0 C10.9,28.3 11.3,27.5 11.8,26.9 C12.3,26.3 12.7,25.7 13.2,25.2 C13.7,24.7 14.1,24.4 14.6,24.0 C15.1,23.6 15.5,23.3 16.0,22.9 C16.5,22.6 16.9,22.4 17.4,22.2 C17.9,22.0 18.3,21.9 18.8,21.7 C19.3,21.5 19.7,21.2 20.2,20.8 C20.7,20.3 21.1,19.6 21.6,18.9 C22.1,18.2 22.5,17.3 23.0,16.6 C23.5,15.8 23.9,15.0 24.4,14.2 C24.9,13.5 25.3,12.7 25.8,11.9 C26.3,11.1 26.7,10.1 27.2,9.5 C27.7,8.9 28.1,8.5 28.6,8.2 C29.1,7.9 29.5,7.9 30.0,7.9 C30.5,7.9 30.9,8.0 31.4,8.0 C31.9,8.0 32.3,8.0 32.8,7.9 C33.3,7.7 33.7,7.4 34.2,7.3 C34.7,7.2 35.1,7.1 35.6,7.1 C36.1,7.2 36.5,7.5 37.0,7.6 C37.5,7.7 37.9,7.9 38.4,7.7 C38.9,7.5 39.3,7.0 39.8,6.5 C40.3,6.1 40.7,5.3 41.2,5.0 C41.7,4.7 42.1,4.7 42.6,4.7 C43.1,4.8 43.5,5.4 44.0,5.5 C44.5,5.6 44.9,5.5 45.4,5.3 C45.9,5.1 46.3,4.5 46.8,4.4 C47.3,4.4 47.7,4.6 48.2,5.0 C48.7,5.4 49.1,6.4 49.6,7.0 C50.1,7.6 50.5,8.0 51.0,8.4 C51.5,8.9 51.9,9.0 52.4,9.6 C52.9,10.2 53.3,11.2 53.8,12.0 C54.3,12.9 54.7,13.9 55.2,14.6 C55.7,15.3 56.1,15.7 56.6,16.1 C57.1,16.6 57.5,17.1 58.0,17.5 C58.5,17.9 58.9,18.2 59.4,18.6 C59.9,18.9 60.3,19.0 60.8,19.4 C61.3,19.8 61.7,20.3 62.2,20.8 C62.7,21.3 63.1,22.0 63.6,22.2 C64.1,22.4 64.5,22.2 65.0,21.7 C65.5,21.3 65.9,20.3 66.4,19.3 C66.9,18.4 67.3,17.1 67.8,16.2 C68.3,15.3 68.7,14.4 69.2,13.7 C69.7,13.1 70.1,12.6 70.6,12.3 C71.1,12.0 71.5,11.9 72.0,12.0 C72.5,12.1 72.9,12.5 73.4,13.1 C73.9,13.6 74.3,14.6 74.8,15.3 C75.3,16.0 75.7,16.6 76.2,17.1 C76.7,17.7 77.1,18.0 77.6,18.6 C78.1,19.3 78.5,20.1 79.0,21.1 C79.5,22.1 79.9,23.8 80.4,24.5 C80.9,25.3 81.3,26.0 81.8,25.6 C82.3,25.2 82.7,23.3 83.2,22.0 C83.7,20.7 84.1,18.8 84.6,17.9 C85.1,17.0 85.8,16.9 86.0,16.7 L90,18'

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 92 44"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle
        cx="70"
        cy="9"
        r="4.6"
        fill="var(--castagno)"
        className="transition-transform duration-200 ease-out group-hover/logo:-translate-y-[2px] group-focus-visible/logo:-translate-y-[2px]"
      />
      <path d={CRINALE} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-bosco', className)}>
      <LogoMark className={compact ? 'h-6 w-12' : 'h-7 w-14'} />
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
