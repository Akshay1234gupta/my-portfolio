"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/prefs";

type CursorState = "dot" | "link" | "label" | "hidden";

const LABELS: Record<string, string> = { view: "View", explore: "Explore", drag: "Drag", read: "Read" };

/**
 * Desktop-only custom cursor: a dot that morphs into an arrow ring over links and a labelled badge
 * over elements marked `data-cursor="view|explore|…"`. Disabled on touch devices and for reduced motion.
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const enabled = fine && !reduced;
  const rootRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return;
    document.documentElement.classList.add("has-cursor");

    let tx = -100;
    let ty = -100;
    let x = tx;
    let y = ty;
    let raf = 0;

    const setState = (s: CursorState, label?: string) => {
      root.dataset.state = s;
      if (label !== undefined && badgeRef.current) badgeRef.current.textContent = label;
    };

    const tick = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      root.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      wake();
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      if (t.closest("input, textarea, select, [contenteditable], [role='dialog'], [aria-modal='true']")) {
        return setState("hidden");
      }
      const custom = t.closest<HTMLElement>("[data-cursor]");
      const key = custom?.dataset.cursor;
      if (key && LABELS[key]) return setState("label", LABELS[key]);
      if (key === "link" || t.closest("a, button, [role='button'], summary, label")) return setState("link");
      setState("dot");
    };
    const onLeave = () => setState("hidden");
    const onEnter = () => setState("dot");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    setState("hidden");

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={rootRef} className="cursor" data-state="hidden" aria-hidden="true">
      <div className="cursor__dot" />
      <div className="cursor__arrow">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12 12 4M5.5 4H12v6.5" />
        </svg>
      </div>
      <div className="cursor__badge">
        <span ref={badgeRef} />
      </div>
    </div>
  );
}
