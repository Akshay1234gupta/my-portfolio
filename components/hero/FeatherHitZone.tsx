"use client";

import { registerFeatherClick } from "@/components/animations/featherStore";

/**
 * Invisible click target over the hero feather (the real feather is a fixed, non-interactive layer).
 * Easter egg: five quick clicks → Peacock Mode. A keyboard route exists too (type "peacock").
 */
export function FeatherHitZone() {
  return (
    <div
      aria-hidden="true"
      onClick={registerFeatherClick}
      className="absolute right-[2%] top-[12%] hidden h-[70%] w-[34%] md:block"
    />
  );
}
