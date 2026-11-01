import type { ReactNode } from "react";
import { Reveal, RevealLines } from "./Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index?: string;
  eyebrow: string;
  lines: ReactNode[];
  lead?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({ index, eyebrow, lines, lead, className, as = "h2" }: SectionHeadingProps) {
  return (
    <header className={cn("max-w-4xl", className)}>
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          {index && <span className="text-cyan">{index}</span>}
          <span aria-hidden className="h-px w-8 bg-current opacity-40" />
          {eyebrow}
        </p>
      </Reveal>
      <RevealLines as={as} lines={lines} className="h-section mt-6" />
      {lead && (
        <Reveal delay={0.15} className="lead mt-8 max-w-2xl">
          {lead}
        </Reveal>
      )}
    </header>
  );
}
