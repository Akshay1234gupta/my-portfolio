"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CustomCursor } from "./CustomCursor";
import { WaterDropEffect } from "./WaterDropEffect";

// Non-critical layers are code-split and only mounted once the browser is idle.
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/navigation/CommandPalette"), { ssr: false });

export function ClientLayers() {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 1800 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <>
      <WaterDropEffect />
      {idle && <ParticleField />}
      {idle && <CommandPalette />}
      <CustomCursor />
    </>
  );
}
