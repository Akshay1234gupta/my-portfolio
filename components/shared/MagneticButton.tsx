"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/prefs";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  external?: boolean;
  download?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

/** Button that leans toward the pointer. Falls back to a plain button for reduced motion / touch. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "ghost",
  external,
  download,
  className,
  type = "button",
  disabled,
  ...rest
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.36);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn("btn", variant === "primary" && "btn-primary", className);
  let el: ReactNode;
  if (href && external) {
    el = (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" onClick={onClick} data-cursor="link" {...rest}>
        {children}
      </a>
    );
  } else if (href && download) {
    el = (
      <a href={href} className={cls} download onClick={onClick} data-cursor="link" {...rest}>
        {children}
      </a>
    );
  } else if (href) {
    el = (
      <Link href={href} className={cls} onClick={onClick} data-cursor="link" {...rest}>
        {children}
      </Link>
    );
  } else {
    el = (
      <button type={type} className={cls} onClick={onClick} disabled={disabled} data-cursor="link" {...rest}>
        {children}
      </button>
    );
  }

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      {el}
    </motion.div>
  );
}
