// Da 21st.dev: @daiwiikharihar/reveal-image-mask
// Adattato: testi passati da fuori (titolo e didascalia restano fermi, si muove solo l'immagine),
// colori del sito, hook chiamati sempre nello stesso ordine. È l'unico effetto legato allo scroll
// della pagina Chi sono. Con prefers-reduced-motion l'immagine è subito a pieno formato.
import * as React from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useWillChange,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { useDesktop } from "@/hooks/use-desktop";

export interface RevealImageMaskProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  src: string;
  srcSet?: string;
  alt: string;
  title?: React.ReactNode;
  caption?: React.ReactNode;
  shape?: "circle" | "rounded";
}

export const RevealImageMask = React.forwardRef<HTMLDivElement, RevealImageMaskProps>(
  function RevealImageMask(
    {
      className,
      src,
      srcSet,
      alt,
      title,
      caption,
      shape = "rounded",
      ...props
    },
    ref,
  ) {
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const desktop = useDesktop();
    const shouldReduceMotion = useReducedMotion() || !desktop;
    const willChange = useWillChange();
    const { scrollYProgress } = useScroll({
      target: localRef,
      offset: ["start 85%", "end 15%"],
    });
    const progress = useSpring(scrollYProgress, {
      stiffness: 170,
      damping: 24,
      mass: 0.95,
    });
    const radius = useTransform(progress, [0, 0.5], shape === "circle" ? ["16%", "75%"] : ["10%", "0%"]);
    const inset = useTransform(progress, [0, 0.5], ["22%", "0%"]);
    const circleClip = useTransform(radius, (latest) => `circle(${latest} at 50% 50%)`);
    const insetClip = useTransform(
      [radius, inset],
      ([latestRadius, latestInset]) => `inset(${latestInset} round ${latestRadius})`,
    );

    return (
      <div
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("rounded-[2rem]", className)}
        {...props}
      >
        {(title || caption) && (
          <div className="mb-6 space-y-3 px-2">
            {title && <h2 className="max-w-3xl text-4xl leading-[1.06] text-foreground md:text-5xl">{title}</h2>}
            {caption && <div className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{caption}</div>}
          </div>
        )}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : {
                  clipPath: shape === "circle" ? circleClip : insetClip,
                  willChange,
                }
          }
          className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-pietra md:aspect-[16/10]"
        >
          <img src={src} srcSet={srcSet} sizes="(min-width: 1152px) 1152px, 100vw" alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </motion.div>
      </div>
    );
  },
);
