"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { initPrefs, useReducedMotion } from "@/lib/prefs";
import { registerLenis } from "@/lib/scroll";

/** Global client providers: preferences, smooth scrolling (Lenis) and motion config. */
export function Providers({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    initPrefs();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 1.35,
      infinite: false,
      autoRaf: true,
    });
    registerLenis(lenis);
    return () => {
      registerLenis(null);
      lenis.destroy();
    };
  }, [reduced]);

  return <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>;
}
