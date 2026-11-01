"use client";

import { useEffect, type RefObject } from "react";
import { HERO_POSE, homeKeyframes, routePoses, type FeatherPose } from "@/data/featherPath";
import { subscribeLenisScroll } from "@/lib/scroll";
import { clamp, lerp, smoothstep } from "@/lib/utils";
import { getFeatherState, pointer, setActiveSection, subscribeFeather } from "./featherStore";

interface Refs {
  mover: RefObject<HTMLDivElement | null>;
  tilt: RefObject<HTMLDivElement | null>;
  feather: RefObject<HTMLDivElement | null>;
}

interface Options {
  pathname: string;
  reducedMotion: boolean;
}

interface Anchor {
  pos: number;
  section: string;
  desktop: FeatherPose;
  mobile: FeatherPose;
}

const NUMERIC_KEYS = ["x", "y", "rotate", "scale", "opacity", "intensity", "progress"] as const;

/**
 * The single place where the feather's transform is computed and written.
 *
 * - One rAF loop that sleeps whenever nothing is changing (no idle CPU).
 * - Reads scroll + pointer, writes styles straight to the DOM (zero React re-renders).
 * - Scroll → position along the authored path in data/featherPath.ts (eased, with mid-flight arc).
 * - Pointer → 3D tilt + layer parallax. Scroll velocity → gentle sway.
 * - Reduced motion → no pointer/velocity effects, no smoothing lag, no mid-flight flourishes.
 */
export function useFeatherController({ mover, tilt, feather }: Refs, { pathname, reducedMotion }: Options) {
  useEffect(() => {
    const moverEl = mover.current;
    const tiltEl = tilt.current;
    const featherEl = feather.current;
    if (!moverEl || !tiltEl || !featherEl) return;

    const isHome = pathname === "/";
    const routeKey = pathname.split("/")[1] ?? "";
    const mobileMQ = window.matchMedia("(max-width: 767px)");

    let anchors: Anchor[] = [];
    let width = moverEl.offsetWidth;
    let height = moverEl.offsetHeight;
    let raf = 0;
    let last = 0;
    let first = true;
    let boost = 0;
    let prevScroll = window.scrollY;
    let vel = 0;
    let airFlow = 0;
    let curDisp = 0.5;
    let px = 0;
    let py = 0;
    let lastProgress = -1;

    const cur: FeatherPose = { ...HERO_POSE.desktop };

    if (!isHome) setActiveSection(routeKey ? `page-${routeKey}` : "page");

    const measure = () => {
      width = moverEl.offsetWidth;
      height = moverEl.offsetHeight;
      if (!isHome) return;
      const next: Anchor[] = [];
      document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => {
        const id = el.dataset.section;
        if (!id) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        for (const k of homeKeyframes) {
          if (k.section === id) next.push({ pos: top + k.at * el.offsetHeight, section: id, desktop: k.desktop, mobile: k.mobile });
        }
      });
      next.sort((a, b) => a.pos - b.pos);
      anchors = next;
    };

    const target = (): FeatherPose => {
      const mobile = mobileMQ.matches;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      if (!isHome) {
        const base = (routePoses[routeKey] ?? routePoses[""])[mobile ? "mobile" : "desktop"];
        const max = Math.max(1, document.documentElement.scrollHeight - vh);
        const frac = clamp(scrollY / max, 0, 1);
        return { ...base, rotate: base.rotate + (reducedMotion ? 0 : frac * 24), y: base.y + (reducedMotion ? 0 : frac * 0.18) };
      }

      const pick = (a: Anchor) => (mobile ? a.mobile : a.desktop);
      if (anchors.length === 0) return pick({ pos: 0, section: "hero", desktop: HERO_POSE.desktop, mobile: HERO_POSE.mobile });

      const c = scrollY + vh * 0.5;
      if (c <= anchors[0].pos) return { ...pick(anchors[0]) };
      const lastAnchor = anchors[anchors.length - 1];
      if (c >= lastAnchor.pos) return { ...pick(lastAnchor) };

      let i = 0;
      while (i < anchors.length - 2 && c >= anchors[i + 1].pos) i++;
      const a = anchors[i];
      const b = anchors[i + 1];
      const t = (c - a.pos) / Math.max(1, b.pos - a.pos);
      // reduced motion: hold the nearest pose instead of drifting between them
      const e = reducedMotion ? (t < 0.5 ? 0 : 1) : smoothstep(t);
      const pa = pick(a);
      const pb = pick(b);
      const out = { ...pa };
      for (const k of NUMERIC_KEYS) out[k] = lerp(pa[k], pb[k], e);

      if (!reducedMotion) {
        // mid-flight flourish: swing toward the middle of the viewport, lift, grow and twist a little
        const flight = Math.sin(Math.PI * e) * (a.section === b.section ? 0.3 : 1);
        out.x += (0.5 - out.x) * 0.16 * flight;
        out.y -= 0.035 * flight;
        out.scale *= 1 + 0.1 * flight;
        out.rotate += (pb.x >= pa.x ? 1 : -1) * 9 * flight;
        out.intensity += 0.15 * flight;
      }
      return out;
    };

    const write = (now: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sway = reducedMotion ? 0 : clamp(vel * 0.0035, -9, 9);
      const tx = cur.x * vw - width / 2;
      const ty = cur.y * vh - height / 2;
      moverEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${(cur.rotate + sway).toFixed(2)}deg) scale(${cur.scale.toFixed(3)})`;
      moverEl.style.opacity = cur.opacity.toFixed(3);
      if (reducedMotion) {
        tiltEl.style.transform = "";
        moverEl.style.removeProperty("--mx");
        moverEl.style.removeProperty("--my");
        featherEl.style.removeProperty("--air-flow");
        featherEl.style.removeProperty("--air-flow-abs");
        featherEl.style.removeProperty("--air-flutter");
      } else {
        tiltEl.style.transform = `rotateY(${(px * 14).toFixed(2)}deg) rotateX(${(-py * 9).toFixed(2)}deg)`;
        moverEl.style.setProperty("--mx", px.toFixed(3));
        moverEl.style.setProperty("--my", py.toFixed(3));

        featherEl.style.setProperty("--air-flow", airFlow.toFixed(3));
        featherEl.style.setProperty("--air-flow-abs", Math.abs(airFlow).toFixed(3));
        const flutter = Math.sin(now * 0.012) * Math.min(1, Math.abs(vel) * 0.0025 + 0.12);
        featherEl.style.setProperty("--air-flutter", flutter.toFixed(3));

        // Update displacement scale on SVG filters
        const dispEls = featherEl.querySelectorAll<SVGFEDisplacementMapElement>("feDisplacementMap");
        for (const el of dispEls) {
          el.scale.baseVal = curDisp;
        }
      }
      featherEl.style.setProperty("--intensity", (cur.intensity + boost).toFixed(3));
      const q = Math.round(cur.progress * 20) / 20;
      if (q !== lastProgress) {
        lastProgress = q;
        featherEl.style.setProperty("--progress", String(q));
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      const tgt = target();

      if (first || reducedMotion) {
        Object.assign(cur, tgt);
        first = false;
        moverEl.dataset.ready = "true";
      }
      const follow = 1 - Math.exp(-dt * 5.5);
      let moving = false;
      if (!reducedMotion) {
        for (const k of NUMERIC_KEYS) {
          const d = tgt[k] - cur[k];
          if (Math.abs(d) > (k === "rotate" ? 0.05 : 0.0006)) {
            cur[k] += d * follow;
            moving = true;
          } else cur[k] = tgt[k];
        }
        const scrollY = window.scrollY;
        vel += ((scrollY - prevScroll) / Math.max(dt, 0.001) - vel) * (1 - Math.exp(-dt * 10));
        prevScroll = scrollY;
        if (Math.abs(vel) < 4) vel = 0;
        else moving = true;

        // Dynamic airflow physics based on scroll velocity
        const targetAir = clamp(vel * 0.0035, -7.5, 7.5);
        airFlow += (targetAir - airFlow) * (1 - Math.exp(-dt * 12));
        if (Math.abs(airFlow) > 0.015) moving = true;

        // Turbulence displacement for barb fluttering
        const targetDisp = Math.min(8.5, Math.abs(vel) * 0.005 + 0.45 + Math.sin(now * 0.004) * 0.35);
        curDisp += (targetDisp - curDisp) * (1 - Math.exp(-dt * 10));
        if (Math.abs(curDisp - 0.45) > 0.05) moving = true;

        const pf = 1 - Math.exp(-dt * 6);
        px += (pointer.x - px) * pf;
        py += (pointer.y - py) * pf;
        if (Math.abs(pointer.x - px) > 0.002 || Math.abs(pointer.y - py) > 0.002) moving = true;

        if (boost > 0.005) {
          boost *= Math.exp(-dt * 2.2);
          moving = true;
        } else boost = 0;
      }

      write(now);
      if (moving) raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      wake();
    };
    const onResize = () => {
      measure();
      wake();
    };

    // pulse the glow whenever the visitor enters a new section
    let lastSection = "";
    const unsub = subscribeFeather(() => {
      const s = getFeatherState().activeSection;
      if (s !== lastSection) {
        lastSection = s;
        boost = 0.5;
        wake();
      }
    });

    const unsubLenis = subscribeLenisScroll((e) => {
      if (!reducedMotion) {
        vel = e.velocity * 50;
        wake();
      }
    });

    measure();
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", onResize);
    if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    void document.fonts?.ready.then(onResize);
    mobileMQ.addEventListener("change", onResize);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      unsubLenis();
      ro.disconnect();
      mobileMQ.removeEventListener("change", onResize);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [mover, tilt, feather, pathname, reducedMotion]);
}
