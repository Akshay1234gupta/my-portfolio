import type Lenis from "lenis";
import { isMotionReduced } from "@/lib/prefs";

let lenis: Lenis | null = null;
type ScrollListener = (e: { scroll: number; velocity: number }) => void;
const listeners = new Set<ScrollListener>();

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis) {
    lenis.on("scroll", (e: { scroll: number; velocity: number }) => {
      listeners.forEach((fn) => fn(e));
    });
  }
}

export function subscribeLenisScroll(fn: ScrollListener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to a home-page section (or top of page). Falls back to native scrolling. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -24,
      duration: 1.25,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
  } else {
    el.scrollIntoView({ behavior: isMotionReduced() ? "auto" : "smooth", block: "start" });
  }
  history.replaceState(null, "", id === "hero" ? window.location.pathname : `#${id}`);
  return true;
}

export function scrollToTop(immediate = false) {
  if (lenis) {
    lenis.scrollTo(0, {
      immediate,
      duration: immediate ? 0 : 1.15,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({ top: 0, behavior: immediate || isMotionReduced() ? "auto" : "smooth" });
  }
}
