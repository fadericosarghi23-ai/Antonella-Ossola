// Da 21st.dev: @efferd/contact-card
// Adattato: tipografia e colori del sito, angoli arrotondati, titolo come h2 (l'h1 è nell'intestazione di pagina),
// contatti che possono essere link.
import React from 'react';
import { cn } from '@/lib/utils';
import {
	type LucideIcon,
	PlusIcon,
} from 'lucide-react';

type ContactInfoProps = React.ComponentProps<'div'> & {
	icon: LucideIcon;
	label: string;
	value: string;
	href?: string;
};

type ContactCardProps = React.ComponentProps<'div'> & {
	title?: string;
	description?: React.ReactNode;
	contactInfo?: ContactInfoProps[];
	formSectionClassName?: string;
};

export function ContactCard({
	title = 'Scrivimi',
	description,
	contactInfo,
	className,
	formSectionClassName,
	children,
	...props
}: ContactCardProps) {
	return (
		<div
			className={cn(
				'bg-card border relative grid h-full w-full rounded-3xl shadow-sm lg:grid-cols-5',
				className,
			)}
			{...props}
		>
			<PlusIcon className="absolute -top-3 -left-3 h-6 w-6 text-muschio" />
			<PlusIcon className="absolute -top-3 -right-3 h-6 w-6 text-muschio" />
			<PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-muschio" />
			<PlusIcon className="absolute -right-3 -bottom-3 h-6 w-6 text-muschio" />
			<div className="flex flex-col justify-between lg:col-span-2">
				<div className="relative h-full space-y-4 px-5 py-8 md:p-10">
					<h2 className="text-3xl md:text-4xl">{title}</h2>
					{description && (
						<div className="text-muted-foreground max-w-xl text-base md:text-lg">{description}</div>
					)}
					<div className="grid gap-2 pt-4">
						{contactInfo?.map((info, index) => (
							<ContactInfo key={index} {...info} />
						))}
					</div>
				</div>
			</div>
			<div
				className={cn(
					'bg-pietra/40 flex h-full w-full items-start rounded-b-3xl border-t p-5 md:p-10 lg:col-span-3 lg:rounded-r-3xl lg:rounded-bl-none lg:border-t-0 lg:border-l',
					formSectionClassName,
				)}
			>
				{children}
			</div>
		</div>
	);
}

function ContactInfo({
	icon: Icon,
	label,
	value,
	href,
	className,
	...props
}: ContactInfoProps) {
	const body = (
		<>
			<div className="bg-pietra/70 rounded-lg p-3">
				<Icon className="h-5 w-5 text-castagno" />
			</div>
			<div>
				<p className="font-medium">{label}</p>
				<p className="text-muted-foreground text-sm">{value}</p>
			</div>
		</>
	);
	return (
		<div className={cn('flex items-center gap-3 py-2', className)} {...props}>
			{href ? (
				<a href={href} className="flex items-center gap-3 rounded-lg transition-colors hover:text-castagno" target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
					{body}
				</a>
			) : (
				body
			)}
		</div>
	);
}
