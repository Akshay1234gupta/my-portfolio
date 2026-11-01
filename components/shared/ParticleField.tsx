"use client";

import { useEffect, useRef } from "react";
import { pointer } from "@/components/animations/featherStore";
import { useReducedMotion } from "@/lib/prefs";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  color: string;
  phase: number;
}

const COLORS = ["34 211 238", "45 212 191", "16 185 129", "139 92 246", "96 165 250"];

/**
 * A single small canvas of slow drifting motes (not DOM nodes). Fewer on mobile, paused when the
 * tab is hidden, drawn once and left static for reduced motion.
 */
export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const count = mobile ? 20 : 56;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: rand(0.6, 1.9),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.22, -0.05),
      a: rand(0.25, 0.75),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      phase: rand(0, Math.PI * 2),
    }));

    let raf = 0;
    let t = 0;
    let light = document.documentElement.dataset.theme === "light";

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const px = ((pointer.x + 1) / 2) * w;
      const py = ((pointer.y + 1) / 2) * h;
      const alphaScale = light ? 0.55 : 1;
      for (const p of particles) {
        if (animate) {
          p.x += p.vx + Math.sin(t * 0.0006 + p.phase) * 0.05;
          p.y += p.vy;
          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const f = (1 - d2 / 14000) * 0.6;
            p.x += (dx / Math.sqrt(d2 + 1)) * f;
            p.y += (dy / Math.sqrt(d2 + 1)) * f;
          }
          if (p.y < -10) {
            p.y = h + 10;
            p.x = Math.random() * w;
          }
          if (p.x < -10) p.x = w + 10;
          else if (p.x > w + 10) p.x = -10;
        }
        const tw = animate ? 0.75 + 0.25 * Math.sin(t * 0.002 + p.phase) : 1;
        ctx.beginPath();
        ctx.fillStyle = `rgb(${p.color} / ${(p.a * tw * alphaScale).toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      t = now;
      if (Math.floor(now / 1000) % 5 === 0) light = document.documentElement.dataset.theme === "light";
      draw(true);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };

    if (reduced) draw(false);
    else raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
