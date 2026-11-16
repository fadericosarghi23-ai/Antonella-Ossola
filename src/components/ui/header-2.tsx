// Da 21st.dev: @efferd/header-2
// Adattato: link di react-router, tendina Percorsi (navigation-menu-06), logo del cliente,
// menu mobile con dissolvenza e scorrimento breve al posto dello zoom.
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import RichNavigationMenu from '@/components/ui/navigation-menu-06';
import { Logo } from '@/components/brand/Logo';
import { nav, percorsi } from '@/lib/site';

export function Header() {
	const [open, setOpen] = React.useState(false);
	// resta montato 200ms dopo la chiusura, per l'animazione di uscita
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		if (open) {
			setMounted(true);
			return;
		}
		const t = window.setTimeout(() => setMounted(false), 200);
		return () => window.clearTimeout(t);
	}, [open]);
	const scrolled = useScroll(10);
	const { pathname } = useLocation();

	React.useEffect(() => {
		setOpen(false);
	}, [pathname]);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		buttonVariants({
			variant: 'ghost',
			className: cn('text-[0.95rem] font-normal', isActive && 'text-castagno'),
		});

	return (
		<header
			className={cn(
				'sticky top-0 z-50 mx-auto w-full max-w-6xl border-b border-border/60 bg-background/90 backdrop-blur-md md:top-3 md:mt-3 md:rounded-full md:border md:border-border/60 md:shadow-sm md:transition-[top,max-width,background-color,border-color,box-shadow] md:duration-300 md:ease-out',
				{
					'bg-background/95 supports-[backdrop-filter]:bg-background/80 border-border backdrop-blur-md md:top-3 md:max-w-4xl md:border-border md:shadow-sm':
						scrolled && !open,
					'bg-background': open,
				},
			)}
		>
			<nav
				aria-label="Principale"
				className={cn(
					'flex h-16 w-full items-center justify-between px-4 md:transition-all md:ease-out',
					{
						'md:px-3': scrolled,
					},
				)}
			>
				<Link to="/" aria-label="Antonella Ossola, home" className="group/logo rounded-md">
					<Logo compact={scrolled} />
				</Link>
				<div className="hidden items-center gap-1 md:flex">
					<RichNavigationMenu active={pathname.startsWith('/percorsi')} />
					{nav.map((link) => (
						<NavLink key={link.href} className={linkClass} to={link.href}>
							{link.label}
						</NavLink>
					))}
					<Button asChild className="ml-2">
						<Link to="/contatti">Scrivimi</Link>
					</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden"
					aria-expanded={open}
					aria-controls="menu-mobile"
					aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
				>
					<MenuToggleIcon open={open} className="size-5" />
				</Button>
			</nav>

			<div
				id="menu-mobile"
				className={cn(
					'fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-y-auto md:hidden',
					open || mounted ? 'block' : 'hidden',
					!open && 'pointer-events-none',
				)}
			>
				<div
					data-slot={open ? 'open' : 'closed'}
					className={cn(
						'data-[slot=open]:animate-in data-[slot=open]:fade-in-0 data-[slot=open]:slide-in-from-top-2 data-[slot=closed]:animate-out data-[slot=closed]:fade-out-0 data-[slot=closed]:slide-out-to-top-2 data-[slot=closed]:fill-mode-forwards ease-out duration-200',
						'flex min-h-full w-full flex-col justify-between gap-y-8 border-y bg-background p-4 pb-8',
					)}
				>
					<div className="grid gap-y-1">
						<p className="kicker px-4 pt-2 pb-1">Percorsi</p>
						{percorsi.map((p) => (
							<NavLink
								key={p.href}
								to={p.href}
								className={({ isActive }) =>
									cn(
										'rounded-lg px-4 py-3 font-display text-2xl text-bosco transition-colors hover:bg-accent',
										isActive && 'text-castagno',
									)
								}
							>
								{p.nome}
							</NavLink>
						))}
						<div className="my-3 h-px bg-border" />
						{nav.map((link) => (
							<NavLink
								key={link.href}
								to={link.href}
								className={({ isActive }) =>
									cn(
										'rounded-lg px-4 py-3 font-display text-2xl text-bosco transition-colors hover:bg-accent',
										isActive && 'text-castagno',
									)
								}
							>
								{link.label}
							</NavLink>
						))}
					</div>
					<Button asChild size="lg" className="w-full">
						<Link to="/contatti">Scrivimi</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
