"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.2, 0.7, 0.2, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** re-run the animation every time it scrolls into view */
  repeat?: boolean;
}

/** Fade + rise on scroll into view. Transform/opacity only. */
export function Reveal({ children, className, delay = 0, y = 26, repeat = false }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

interface RevealLinesProps {
  /** each entry is one visual line, revealed through a mask */
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  /** animate on mount instead of on scroll (hero) */
  immediate?: boolean;
}

/** Headline reveal: each line slides up out of a clipping mask. */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "h2",
  immediate = false,
}: RevealLinesProps) {
  const trigger = immediate
    ? { animate: { y: "0%" } }
    : { whileInView: { y: "0%" }, viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn("block overflow-hidden pb-[0.14em] -mb-[0.14em]", lineClassName)}>
          <motion.span
            className="block will-change-transform"
            initial={{ y: "112%" }}
            {...trigger}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
