import { siteConfig } from "@/data/site";
import { FeatherHitZone } from "./FeatherHitZone";
import { HeroActions, ScrollCue } from "./HeroActions";

const lines = ["I build interfaces", "that feel alive."];

export function HeroSection() {
  return (
    <section
      id="hero"
      data-section="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-between pb-8 pt-24 sm:pt-28 md:pb-10 md:pt-32"
    >
      <FeatherHitZone />
      <div className="container-x relative flex flex-1 flex-col justify-center py-4 sm:py-6">
        <div className="max-w-[54rem]">
          <p className="fade-up eyebrow flex items-center gap-3" style={{ "--d": "80ms" } as React.CSSProperties}>
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald" aria-hidden />
            {siteConfig.availability}
          </p>

          <h1 id="hero-title" className="mt-6 md:mt-8">
            <span
              className="fade-up mb-5 inline-block font-mono text-[0.75rem] font-medium uppercase tracking-[0.35em] text-cyan/90 md:mb-6 md:text-xs"
              style={{ "--d": "150ms" } as React.CSSProperties}
            >
              {siteConfig.name} &bull; Portfolio
            </span>
            <span className="h-display block">
              {lines.map((l, i) => (
                <span key={l} className="hero-line" style={{ "--i": i } as React.CSSProperties}>
                  <span>{i === 1 ? <span className="serif text-gradient pr-[0.08em]">{l}</span> : l}</span>
                </span>
              ))}
            </span>
          </h1>

          <ul
            className="fade-up mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[0.95rem] text-fg-soft md:text-base"
            style={{ "--d": "620ms" } as React.CSSProperties}
            aria-label="Roles"
          >
            {siteConfig.roles.map((r, i) => (
              <li key={r} className="flex items-center gap-4">
                {r}
                {i < siteConfig.roles.length - 1 && <span aria-hidden className="h-1 w-1 rounded-full bg-turquoise" />}
              </li>
            ))}
          </ul>

          <p className="fade-up lead mt-6 max-w-xl" style={{ "--d": "740ms" } as React.CSSProperties}>
            Frontend engineer turning ideas into interactive experiences — with React, motion, and a growing
            obsession with what AI makes possible.
          </p>

          <div className="fade-up mt-8 md:mt-9" style={{ "--d": "860ms" } as React.CSSProperties}>
            <HeroActions />
          </div>
        </div>
      </div>

      <div className="container-x relative z-10 shrink-0 fade-up pt-4 pb-2" style={{ "--d": "1100ms" } as React.CSSProperties}>
        <ScrollCue />
      </div>
    </section>
  );
}
