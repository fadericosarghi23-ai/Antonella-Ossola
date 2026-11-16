// Da 21st.dev: @efferd/footer-2
// Adattato: colonne e link del sito, rimossi i pulsanti degli store, contatti diretti al posto dei social,
// riga con i dati legali (segnaposto finché la cliente non li fornisce).
import { Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/brand/Logo';
import { contatti, legale, percorsi } from '@/lib/site';

const footerLinks = [
  {
    title: 'Percorsi',
    links: [
      ...percorsi.map((p) => ({ href: p.href, label: p.nome })),
      { href: '/percorsi', label: 'Tutti i percorsi' },
    ],
  },
  {
    title: 'Il progetto',
    links: [
      { href: '/luoghi', label: 'Luoghi' },
      { href: '/chi-sono', label: 'Chi sono' },
      { href: '/date', label: 'Date e lista d’attesa' },
      { href: '/contatti', label: 'Contatti' },
    ],
  },
  {
    title: 'Note legali',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/cookie', label: 'Cookie' },
    ],
  },
];

export function Footer2() {
  return (
    <footer className="mt-16 border-t bg-pietra/60 md:mt-20">
      <div className="container-site">
        <div className="grid grid-cols-2 gap-8 py-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground" data-placeholder="">
              Camminare insieme, con lentezza, nei boschi e lungo i laghi della provincia di Varese.
            </p>
          </div>
          {footerLinks.map((item) => (
            <div key={item.title}>
              <h3 className="kicker mb-4 font-sans">{item.title}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {item.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="transition-colors duration-150 hover:text-bosco">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px bg-border" />
        <div className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${contatti.email}`}
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              aria-label="Scrivi una email"
            >
              <Mail className="size-5 text-muted-foreground" />
            </a>
            <a
              href={`https://wa.me/${contatti.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'icon' })}
              aria-label="Scrivi su WhatsApp"
            >
              <MessageCircle className="size-5 text-muted-foreground" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">{contatti.zona}</p>
        </div>
        <div className="h-px bg-border" />
        <div className="py-5 text-xs leading-relaxed text-muted-foreground">
          <p data-placeholder="">
            © {new Date().getFullYear()} {legale.denominazione} · P.IVA {legale.piva} · {legale.albo}
          </p>
          <p className="mt-1">
            Sito realizzato da{' '}
            <a href="https://altalogik.it" className="link-underline" target="_blank" rel="noopener noreferrer">
              Altalogik
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
