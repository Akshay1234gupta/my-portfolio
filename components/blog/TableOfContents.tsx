"use client";

import { useEffect, useState } from "react";
import { getLenis } from "@/lib/scroll";
import type { Heading } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const go = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -96 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  const list = (
    <ol className="space-y-1 border-l border-line text-sm">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => go(e, h.id)}
            aria-current={active === h.id ? "location" : undefined}
            className={cn(
              "-ml-px block border-l py-1.5 transition-colors",
              h.level === 3 ? "pl-8" : "pl-4",
              active === h.id ? "border-cyan text-fg" : "border-transparent text-muted hover:text-fg",
            )}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label="Table of contents">
      {/* mobile: collapsible */}
      <details className="panel px-5 py-4 lg:hidden">
        <summary className="eyebrow cursor-pointer list-none">On this page ↓</summary>
        <div className="mt-4">{list}</div>
      </details>
      {/* desktop: sticky */}
      <div className="hidden lg:block">
        <p className="eyebrow mb-4">On this page</p>
        {list}
      </div>
    </nav>
  );
}
