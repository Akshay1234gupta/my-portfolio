"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PeacockFeather } from "@/components/hero/PeacockFeather";
import { useReducedMotion } from "@/lib/prefs";
import { setActiveSection, setPeacock, useFeatherState } from "./featherStore";
import { useFeatherController } from "./useFeatherController";

const FANS = [
  { rot: -68, scale: 0.86, opacity: 0.5 },
  { rot: -46, scale: 0.92, opacity: 0.62 },
  { rot: -23, scale: 0.97, opacity: 0.72 },
  { rot: 23, scale: 0.97, opacity: 0.72 },
  { rot: 46, scale: 0.92, opacity: 0.62 },
  { rot: 68, scale: 0.86, opacity: 0.5 },
] as const;

const SECRET = "peacock";

/**
 * The one persistent feather. Lives in the root layout, so it also survives route changes.
 * All motion is computed in useFeatherController; this component only renders + wires up
 * section detection and the Easter eggs.
 */
export function FeatherStage() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const { activeSection, peacock } = useFeatherState();

  const moverRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const featherRef = useRef<HTMLDivElement>(null);

  useFeatherController({ mover: moverRef, tilt: tiltRef, feather: featherRef }, { pathname, reducedMotion: reduced });

  // Which story section is under the middle of the viewport?
  useEffect(() => {
    if (pathname !== "/") return;
    const els = document.querySelectorAll<HTMLElement>("[data-section]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection((entry.target as HTMLElement).dataset.section ?? "hero");
        }
      },
      { rootMargin: "-50% 0px -49% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Easter egg (keyboard): type "peacock" anywhere outside a text field.
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "Escape") return setPeacock(false);
      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      if (buffer === SECRET) {
        buffer = "";
        setPeacock(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mount the fan only while needed; keep it mounted briefly so it can fold away.
  const [fanPhase, setFanPhase] = useState<"off" | "mounted" | "open">("off");
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (peacock) {
      timers.push(setTimeout(() => setFanPhase("mounted"), 0), setTimeout(() => setFanPhase("open"), 60));
    } else {
      timers.push(
        setTimeout(() => setFanPhase((p) => (p === "off" ? p : "mounted")), 0),
        setTimeout(() => setFanPhase("off"), 1200),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [peacock]);
  const fanMounted = fanPhase !== "off";
  const fanOpen = fanPhase === "open";

  return (
    <>
      <div className="feather-stage" aria-hidden="true">
        <div ref={moverRef} className="feather-mover">
          <div ref={tiltRef} className="feather-tilt">
            {fanMounted &&
              FANS.map((f) => (
                <div
                  key={f.rot}
                  className="feather-fan"
                  data-open={fanOpen}
                  style={{ "--fan-rot": `${f.rot}deg`, "--fan-scale": f.scale, "--fan-opacity": f.opacity } as CSSProperties}
                >
                  <PeacockFeather intensity={1.3} />
                </div>
              ))}
            <div className="feather-float">
              <PeacockFeather ref={featherRef} activeSection={activeSection} />
            </div>
          </div>
        </div>
      </div>
      <p role="status" className="sr-only">
        {peacock ? "Peacock mode on. Press Escape to turn it off." : ""}
      </p>
    </>
  );
}
