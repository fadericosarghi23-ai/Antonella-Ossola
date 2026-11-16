// Da 21st.dev: @ibrandify/editorial-service-list
// Adattato: tipografia e colori del sito, link alla pagina di ogni percorso nel pannello aperto,
// niente riquadro esterno, testi in italiano. Logica dell'accordion invariata.
import * as React from "react";
import { Link } from "react-router-dom";

export type State = {
  open?: boolean;
  active?: number;
  query?: string;
  notice?: string;
  selected?: string;
  reveal?: number;
  previous?: number;
  blend?: number;
  expanded?: number;
  highlighted?: boolean;
};

export type ServiceItem = {
  name: string;
  discipline: string;
  description: string;
  href?: string;
};

export type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  kicker?: string;
  services: ServiceItem[];
  state?: State;
  onStateChange?: (state: State) => void;
  onAction?: (action: string) => void;
  seeking?: boolean;
  className?: string;
  footer?: React.ReactNode;
};

function useValue(
  initial: State,
  controlled: State | undefined,
  notify: Props["onStateChange"],
) {
  const [local, setLocal] = React.useState(initial);
  const value = controlled ?? local;
  const set = (patch: Partial<State>) => {
    const next = { ...value, ...patch };
    setLocal(next);
    notify?.(next);
  };
  return [value, set] as const;
}

export default function EditorialServiceList({
  title,
  subtitle,
  kicker,
  services,
  state,
  onStateChange,
  onAction,
  seeking = false,
  className = "",
  footer,
}: Props) {
  const [v, set] = useValue({ expanded: 0 }, state, onStateChange);
  const id = React.useId();

  return (
    <section
      className={`w-full text-foreground transition-colors ${className}`}
      data-seeking={seeking}
    >
      {/* Header */}
      {(title || subtitle) && (
        <header className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            {kicker && <span className="kicker mb-3 block">{kicker}</span>}
            <h2 className="text-4xl leading-[1.06] whitespace-pre-line text-foreground md:text-5xl">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </header>
      )}

      {/* Accordion Rows */}
      <div className="flex flex-col border-b border-border">
        {services.map((service, i) => {
          const open = v.expanded === i;
          return (
            <div key={service.name} className="border-t border-border">
              <button
                type="button"
                id={`${id}-button-${i}`}
                aria-expanded={open}
                aria-controls={`${id}-panel-${i}`}
                onClick={() => {
                  set({ expanded: open ? -1 : i });
                  onAction?.(service.name);
                }}
                className="group flex w-full cursor-pointer items-center rounded-sm py-5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:py-6"
              >
                {/* Step Number */}
                <span className="w-10 shrink-0 font-sans text-xs text-muted-foreground tabular-nums md:w-14">
                  0{i + 1}
                </span>

                {/* Service Name */}
                <span
                  className={`font-display text-[1.7rem] leading-tight text-foreground transition-[transform,color] duration-200 sm:text-4xl md:text-5xl ${
                    open ? "translate-x-2 text-castagno" : "group-hover:translate-x-2"
                  }`}
                >
                  {service.name}
                </span>

                {/* Subdiscipline Tag */}
                <span className="mr-6 ml-auto hidden text-sm text-muted-foreground sm:inline-block">
                  {service.discipline}
                </span>

                {/* Directional Arrow */}
                <span
                  className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-200 group-hover:text-foreground sm:ml-0 ${
                    open ? "rotate-90 text-castagno" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </button>

              {/* Expansion Detail */}
              <div
                id={`${id}-panel-${i}`}
                role="region"
                aria-labelledby={`${id}-button-${i}`}
                aria-hidden={!open}
                style={
                  seeking && open && v.reveal !== undefined
                    ? {
                        gridTemplateRows: `${v.reveal}fr`,
                        opacity: v.reveal,
                      }
                    : undefined
                }
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="max-w-2xl pt-1 pb-8 pl-10 md:pl-14">
                    <p className="text-base leading-relaxed text-muted-foreground md:text-lg" data-placeholder="">
                      {service.description}
                    </p>
                    {service.href && (
                      <Link
                        to={service.href}
                        tabIndex={open ? 0 : -1}
                        className="link-underline mt-4 inline-block text-bosco"
                      >
                        Scopri il percorso
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {footer && (
        <footer className="mt-6 flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
          {footer}
        </footer>
      )}
    </section>
  );
}
