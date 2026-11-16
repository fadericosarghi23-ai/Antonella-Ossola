// Da 21st.dev: @manuarora700/timeline
// Adattato: colori e tipografia del sito, intestazione passata come props, altezza ricalcolata
// quando il contenuto cambia (ResizeObserver). La linea segue lo scroll: è l'unico effetto
// legato allo scroll di questa pagina. Il testo non si muove.
import {
  useScroll,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDesktop } from "@/hooks/use-desktop";

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
  const [height, setHeight] = useState(0);
  const desktop = useDesktop();
  const reduce = useReducedMotion() || !desktop;

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      {(heading || intro) && (
        <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          {heading && <h2 className="max-w-3xl text-4xl leading-[1.06] md:text-5xl">{heading}</h2>}
          {intro && <div className="mt-4 max-w-xl text-lg text-muted-foreground">{intro}</div>}
        </div>
      )}

      <div ref={ref} className="relative mx-auto max-w-6xl pb-4">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-6 md:gap-10 md:pt-10">
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <div className="h-4 w-4 rounded-full border border-muschio/50 bg-pietra p-2" />
              </div>
              <h3 className="hidden text-3xl text-muschio-scuro md:block md:pl-20 lg:text-4xl">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <h3 className="mb-3 block text-left text-2xl text-muschio-scuro md:hidden">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={
              reduce
                ? { height: "100%", opacity: 1 }
                : { height: heightTransform, opacity: opacityTransform }
            }
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-castagno from-[0%] via-muschio via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
