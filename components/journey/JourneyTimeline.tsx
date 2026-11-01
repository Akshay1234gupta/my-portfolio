"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import type { JourneyYear } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Vertical timeline. The line is drawn by scroll progress; the feather (fixed layer) rides the
 * same line as a quill, tip down — its path for this section is authored in data/featherPath.ts.
 */
export function JourneyTimeline({ years }: { years: JourneyYear[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 45%"] });
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative mt-20 md:mt-28">
      {/* track + drawn line */}
      <div aria-hidden className="absolute bottom-0 left-[15px] top-0 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        aria-hidden
        style={{ scaleY: draw }}
        className="absolute bottom-0 left-[15px] top-0 w-px origin-top bg-gradient-to-b from-cyan via-emerald to-purple md:left-1/2 md:-translate-x-1/2"
      />

      {years.map((y, i) => {
        const left = i % 2 === 0;
        return (
          <li key={y.year} className="relative grid pb-24 last:pb-0 md:grid-cols-2 md:gap-x-24 md:pb-36">
            <motion.span
              aria-hidden
              className="absolute left-[15px] top-3 z-10 h-3 w-3 -translate-x-1/2 rounded-full border border-cyan bg-bg md:left-1/2"
              initial={{ scale: 0.4, boxShadow: "0 0 0 0 rgba(34,211,238,0)" }}
              whileInView={{ scale: 1, boxShadow: "0 0 0 8px rgba(34,211,238,0.14)" }}
              viewport={{ margin: "-40% 0px -40% 0px" }}
              transition={{ duration: 0.5 }}
            />
            <motion.article
              className={cn("pl-12 md:pl-0", left ? "md:col-start-1 md:pr-4 md:text-right" : "md:col-start-2 md:pl-4")}
              initial={{ opacity: 0, x: left ? -28 : 28, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -18% 0px" }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <p
                aria-hidden
                className="font-mono text-[clamp(3.6rem,9vw,7.5rem)] font-semibold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_var(--line-strong)]"
              >
                {y.year}
              </p>
              <h3 className="h-title mt-3 flex flex-wrap items-center gap-3 md:justify-end">
                <span className="sr-only">{y.year}: </span>
                {y.title}
                <PlaceholderBadge show={y.placeholder} />
              </h3>
              <p className="mt-3 max-w-md text-muted md:inline-block">{y.summary}</p>
              <ul className={cn("mt-6 space-y-3", left && "md:flex md:flex-col md:items-end")}>
                {y.items.map((it) => (
                  <li key={it.label + it.text} className="flex items-baseline gap-3 text-[0.95rem] text-fg-soft">
                    <span className={cn("chip shrink-0", left && "md:order-2")}>{it.label}</span>
                    <span className="max-w-xs text-left md:max-w-sm">{it.text}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          </li>
        );
      })}
    </ol>
  );
}
