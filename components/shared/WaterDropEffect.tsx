"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/prefs";

interface SplashDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
}

interface WaveRing {
  delay: number;
  maxRadius: number;
  weight: number;
  duration: number;
}

interface WaterDrop {
  x: number;
  y: number;
  birth: number;
  color: string;
  rings: WaveRing[];
  droplets: SplashDroplet[];
}

const WATER_COLORS = [
  "34, 211, 238", // Cyan
  "45, 212, 191", // Turquoise
  "56, 189, 248", // Sky blue
  "20, 184, 166", // Teal
  "103, 232, 249", // Glint bright cyan
];

/**
 * Global realistic water droplet impact effect.
 * Produces organic concentric ripples, caustic specular glints, and micro-splash droplets
 * on every pointer/click interaction across the entire screen.
 * Sleeps at 0% CPU/GPU when no ripples are active.
 */
export function WaterDropEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const drops: WaterDrop[] = [];
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const createDrop = (x: number, y: number) => {
      const color = WATER_COLORS[Math.floor(Math.random() * WATER_COLORS.length)];
      const rand = (min: number, max: number) => min + Math.random() * (max - min);

      // Micro-splash droplets scattering on impact
      const dropletCount = Math.floor(rand(5, 8));
      const droplets: SplashDroplet[] = [];
      for (let i = 0; i < dropletCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = rand(1.2, 3.2);
        droplets.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4,
          r: rand(1.0, 2.2),
          alpha: rand(0.7, 0.95),
        });
      }

      // Concentric wave crests
      const rings: WaveRing[] = [
        { delay: 0, maxRadius: rand(70, 95), weight: 2.2, duration: 650 },
        { delay: 70, maxRadius: rand(55, 75), weight: 1.8, duration: 600 },
        { delay: 150, maxRadius: rand(100, 130), weight: 1.2, duration: 750 },
      ];

      drops.push({
        x,
        y,
        birth: performance.now(),
        color,
        rings,
        droplets,
      });

      if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // Don't trigger if click originates from right-click
      if (e.button !== 0 && e.button !== undefined && e.pointerType === "mouse") return;
      createDrop(e.clientX, e.clientY);
    };

    const loop = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = drops.length - 1; i >= 0; i--) {
        const drop = drops[i];
        const age = now - drop.birth;
        let isAlive = false;

        // 1. Central water impact bead & caustic glow
        if (age < 320) {
          isAlive = true;
          const centerProgress = age / 320;
          const centerAlpha = (1 - centerProgress) * 0.85;
          const centerRadius = (1 - centerProgress) * 6 + 1.5;

          const grad = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, centerRadius * 2);
          grad.addColorStop(0, `rgba(255, 255, 255, ${centerAlpha.toFixed(3)})`);
          grad.addColorStop(0.4, `rgba(${drop.color}, ${(centerAlpha * 0.8).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${drop.color}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, centerRadius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Expanding concentric ripples
        for (const ring of drop.rings) {
          if (age >= ring.delay) {
            const ringAge = age - ring.delay;
            if (ringAge < ring.duration) {
              isAlive = true;
              const progress = ringAge / ring.duration;
              // Smooth cubic ease-out
              const ease = 1 - Math.pow(1 - progress, 3);
              const radius = ease * ring.maxRadius;
              const alpha = Math.sin(progress * Math.PI) * (1 - progress * 0.75) * 0.7;
              const lineWidth = Math.max(0.4, ring.weight * (1 - progress * 0.8));

              ctx.save();
              ctx.beginPath();
              ctx.arc(drop.x, drop.y, radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${drop.color}, ${alpha.toFixed(3)})`;
              ctx.lineWidth = lineWidth;
              ctx.shadowColor = `rgba(${drop.color}, 0.5)`;
              ctx.shadowBlur = 5 * (1 - progress);
              ctx.stroke();

              // Subtle caustic specular ring
              if (progress < 0.65) {
                ctx.beginPath();
                ctx.arc(drop.x, drop.y, radius * 0.96, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${(alpha * 0.45).toFixed(3)})`;
                ctx.lineWidth = lineWidth * 0.6;
                ctx.stroke();
              }
              ctx.restore();
            }
          }
        }

        // 3. Micro-splash water droplets
        for (const d of drop.droplets) {
          if (d.alpha > 0.05) {
            isAlive = true;
            d.x += d.vx * 0.95;
            d.y += d.vy * 0.95 + 0.09; // drag + slight gravity
            d.alpha *= 0.94; // evaporation

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r * (d.alpha / 0.95), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${d.alpha.toFixed(3)})`;
            ctx.shadowColor = `rgba(${drop.color}, 0.6)`;
            ctx.shadowBlur = 4;
            ctx.fill();
          }
        }

        if (!isAlive) {
          drops.splice(i, 1);
        }
      }

      if (drops.length > 0) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
        ctx.clearRect(0, 0, w, h);
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[110] h-full w-full select-none"
      aria-hidden="true"
    />
  );
}

export default WaterDropEffect;
