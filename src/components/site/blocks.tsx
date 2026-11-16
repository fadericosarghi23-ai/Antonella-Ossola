import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Photo } from '@/components/site/Photo'
import { DrawCrinale, Reveal, RevealImage } from '@/components/site/Reveal'
import { photos } from '@/lib/photos'
import type { PhotoSrc } from '@/lib/photos'
import { cn } from '@/lib/utils'

/** Intestazione delle pagine interne: titolo deciso e, se c'è, una foto ampia. */
export function PageHeader({
  kicker,
  title,
  lead,
  photo,
  breadcrumb,
}: {
  kicker: string
  title: ReactNode
  lead?: ReactNode
  photo?: PhotoSrc
  breadcrumb?: { label: string; href: string }
}) {
  return (
    <section className="container-site pt-8 md:pt-12">
      {breadcrumb && (
        <nav aria-label="Percorso di navigazione" className="mb-6 text-sm text-muted-foreground">
          <Link to={breadcrumb.href} className="link-underline">
            {breadcrumb.label}
          </Link>
        </nav>
      )}
      <p className="kicker">{kicker}</p>
      <h1 className="mt-4 max-w-4xl text-[2.6rem] leading-[1.04] sm:text-6xl md:text-7xl">{title}</h1>
      {lead && <div className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">{lead}</div>}
      {photo && (
        <RevealImage className="mt-8 aspect-[4/3] rounded-2xl sm:aspect-[16/9] md:mt-10 md:aspect-[21/9]">
          <Photo photo={photo} priority sizes="(min-width: 1152px) 1152px, 100vw" className="h-full w-full" />
        </RevealImage>
      )}
    </section>
  )
}

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn('container-site py-12 md:py-16', className)}>
      {children}
    </section>
  )
}

/** Fascia finale: invito alla lista d'attesa o al contatto. */
export function CtaBand({
  title = 'Le prime uscite partono nel 2027.',
  text = 'Lascia il tuo nome: riceverai le date prima che vengano pubblicate.',
}: {
  title?: string
  text?: string
}) {
  return (
    <section className="container-site">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-bosco px-6 py-14 text-carta sm:px-12 md:py-20">
        <Photo photo={photos.nebbiaAbeti} sizes="(min-width: 1152px) 1152px, 100vw" className="absolute inset-0 -z-20 h-full w-full bg-bosco" imgClassName="object-[50%_65%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-bosco via-bosco/85 to-bosco/25" />
        <DrawCrinale className="absolute right-6 bottom-6 hidden w-56 text-carta/70 md:block" />
        <div className="relative max-w-2xl">
          <h2 className="text-4xl leading-[1.08] md:text-5xl" data-placeholder="">
            {title}
          </h2>
          <p className="mt-4 text-lg text-carta/80" data-placeholder="">
            {text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/date">
                Entra nella lista d’attesa <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-carta/40 bg-transparent text-carta hover:bg-carta/10 hover:text-carta"
            >
              <Link to="/contatti">Scrivimi</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/** Scheda di informazioni pratiche: etichetta e valore. */
export function FactList({ items }: { items: { k: string; v: ReactNode }[] }) {
  return (
    <dl className="divide-y border-y">
      {items.map((it) => (
        <div key={it.k} className="grid grid-cols-[minmax(0,9rem)_1fr] gap-4 py-4 sm:grid-cols-[12rem_1fr]">
          <dt className="kicker pt-1">{it.k}</dt>
          <dd className="text-bosco">{it.v}</dd>
        </div>
      ))}
    </dl>
  )
}
