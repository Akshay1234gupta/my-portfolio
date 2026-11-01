"use client";

import { MagneticButton } from "@/components/shared/MagneticButton";
import { siteConfig } from "@/data/site";
import { track } from "@/lib/analytics";
import { scrollToSection } from "@/lib/scroll";

export function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <MagneticButton variant="primary" onClick={() => scrollToSection("projects")}>
        Explore my work <span aria-hidden>↓</span>
      </MagneticButton>
      <MagneticButton
        href={siteConfig.links.resume}
        external
        onClick={() => track("resume_clicked", { source: "hero" })}
      >
        View resume <span aria-hidden>↗</span>
      </MagneticButton>
    </div>
  );
}

export function ScrollCue() {
  return (
    <button
      type="button"
      onClick={() => scrollToSection("about")}
      className="group flex items-center gap-4 text-left"
      data-cursor="link"
    >
      <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-line">
        <span className="scroll-cue absolute inset-0 bg-cyan" />
      </span>
      <span className="eyebrow transition-colors group-hover:text-fg">Scroll to explore ↓</span>
    </button>
  );
}
