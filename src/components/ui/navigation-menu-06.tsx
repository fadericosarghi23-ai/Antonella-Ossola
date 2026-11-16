// Da 21st.dev: @shadcnui-blocks/navigation-menu-06 (Rich Navigation Menu)
// Adattato: link di react-router al posto di next/link, contenuti dei percorsi, una colonna di dettaglio.
import { Footprints, type LucideIcon, Sunrise, UserRound } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { percorsi } from '@/lib/site';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const icons: Record<string, LucideIcon> = {
  'camminate-di-ascolto': Footprints,
  'percorsi-individuali': UserRound,
  'giornate-e-ritiri': Sunrise,
};

export default function RichNavigationMenu({ active }: { active?: boolean }) {
  return (
    <NavigationMenu className="z-20">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn('bg-transparent text-[0.95rem] font-normal', active && 'text-castagno')}
          >
            Percorsi
          </NavigationMenuTrigger>
          <NavigationMenuContent className="px-0 py-1">
            <div className="grid w-[580px] grid-cols-3 gap-3 divide-x p-4">
              <div className="col-span-2 pe-2">
                <h6 className="kicker pl-2.5">I percorsi</h6>
                <ul className="mt-2.5 grid gap-1">
                  {percorsi.map((p) => (
                    <ListItem key={p.slug} to={p.href} icon={icons[p.slug]} title={p.nome}>
                      {p.sottotitolo}
                    </ListItem>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col justify-between pl-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tre modi di camminare, un solo passo: lento.
                </p>
                <NavigationMenuLink asChild>
                  <Link to="/percorsi" className="link-underline text-sm text-bosco">
                    Tutti i percorsi
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { icon: LucideIcon; title: string }
>(({ className, title, children, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            'block select-none flex-col items-start rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          ref={ref}
          {...props}
        >
          <div className="flex items-center gap-2 font-display text-lg leading-none text-bosco">
            <Icon className="h-5 w-5 text-muschio" />
            {title}
          </div>
          <p className="mt-1.5 pl-7 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
