// Da 21st.dev: @manuarora700/timeline
// Adattato: colori e tipografia del sito, intestazione passata come props, altezza ricalcolata
// quando il contenuto cambia (ResizeObserver).
// Migliorato da Altalogik: il sentiero (binario) è sempre visibile; la linea castagno lo percorre seguendo
// lo scroll con un punto, "il camminatore", sulla punta; ogni tappa si accende quando il punto la raggiunge
// (punto pieno e titolo che passa dal tono spento al pieno). È l'unico effetto legato allo scroll della pagina.
// Il testo non si muove mai. Su mobile e con prefers-reduced-motion tutte le tappe sono già accese.
import {
  useScroll,
  useReducedMotion,
  useTransform,
  useMotionValueEvent,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/hooks/use-desktop";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  heading,
  intro,
}: {
  data: TimelineEntry[];
  heading?: React.ReactNode;
  intro?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [height, setHeight] = useState(0);
  const [tops, setTops] = useState<number[]>([]);
  const [reached, setReached] = useState(-1);
  const desktop = useDesktop();
  const reduce = useReducedMotion() || !desktop;

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const measure = () => {
      setHeight(el.getBoundingClientRect().height);
      setTops(rows.current.map((r) => (r ? r.offsetTop + 40 : 0)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  // la punta della linea resta all'altezza del 60% dello schermo: la tappa che si legge è quella accesa
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 60%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);

  useMotionValueEvent(heightTransform, "change", (h) => {
    let n = -1;
    tops.forEach((t, i) => {
      if (h >= t - 8) n = i;
    });
    if (n !== reached) setReached(n);
  });

  const isOn = (i: number) => reduce || i <= reached;

  return (
    <div className="w-full font-sans" ref={containerRef}>
      {(heading || intro) && (
        <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          {heading && <h2 className="max-w-3xl text-4xl leading-[1.06] md:text-5xl">{heading}</h2>}
          {intro && <div className="mt-4 max-w-xl text-lg text-muted-foreground">{intro}</div>}
        </div>
      )}

      <div ref={ref} className="relative mx-auto max-w-6xl pb-4">
        {/* il sentiero: sempre visibile */}
        <div aria-hidden="true" className="absolute top-0 left-8 w-[2px] -translate-x-1/2 rounded-full bg-input" style={{ height }} />
        {/* il tratto già percorso */}
        <motion.div
          aria-hidden="true"
          style={reduce ? { height } : { height: heightTransform }}
          className="absolute top-0 left-8 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-muschio to-castagno"
        />
        {/* il camminatore, sulla punta della linea */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ y: heightTransform }}
            className="absolute top-0 left-8 z-50 -mt-2 -ml-2 size-4 rounded-full bg-castagno ring-4 ring-background"
          />
        )}

        {data.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              rows.current[index] = el;
            }}
            className="flex justify-start pt-6 md:gap-10 md:pt-10"
          >
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <div
                  className={cn(
                    "size-4 rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-300 ease-out",
                    isOn(index)
                      ? "border-castagno bg-castagno shadow-[0_0_0_5px_rgb(140_74_47/0.15)]"
                      : "border-input bg-background",
                  )}
                />
              </div>
              <div className="hidden md:block md:pl-20">
                <p
                  className={cn(
                    "kicker transition-colors duration-300",
                    isOn(index) ? "text-castagno" : "text-muted-foreground/60",
                  )}
                >
                  Tappa {String(index + 1).padStart(2, "0")}
                </p>
                <h3
                  className={cn(
                    "mt-1 text-3xl transition-colors duration-300 lg:text-4xl",
                    isOn(index) ? "text-bosco" : "text-muschio-scuro/70",
                  )}
                >
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <p className="kicker mb-1 text-castagno md:hidden">Tappa {String(index + 1).padStart(2, "0")}</p>
              <h3 className="mb-3 block text-left text-2xl text-bosco md:hidden">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
