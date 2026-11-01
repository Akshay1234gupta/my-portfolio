"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { track } from "@/lib/analytics";
import { scrollToSection } from "@/lib/scroll";
import type { Skill, SkillCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLOR: Record<SkillCategory, string> = {
  Core: "var(--cyan)",
  "UI & Motion": "var(--purple)",
  "Backend & Tooling": "var(--emerald)",
  AI: "var(--blue)",
};
const CATEGORIES = Object.keys(CATEGORY_COLOR) as SkillCategory[];
const DEFAULT_ID = "react";

interface Edge {
  a: Skill;
  b: Skill;
}

/**
 * Interactive technology "universe": a constellation on desktop, a grouped chip cloud on mobile.
 * Hover / focus previews a technology, click / tap pins it. No progress bars — just what it's used
 * for, where, and what it connects to.
 */
export function SkillUniverse() {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string>(DEFAULT_ID);
  const focusId = hover ?? pinned;
  const current = skills.find((s) => s.id === focusId) ?? skills[0];

  const edges = useMemo<Edge[]>(() => {
    const seen = new Set<string>();
    const out: Edge[] = [];
    for (const a of skills) {
      for (const rid of a.related) {
        const b = skills.find((s) => s.id === rid);
        if (!b) continue;
        const key = [a.id, b.id].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a, b });
      }
    }
    return out;
  }, []);

  const connected = useMemo(() => new Set([current.id, ...current.related]), [current]);

  const select = (id: string) => {
    setPinned(id);
    track("skill_selected", { skill: id });
  };

  return (
    <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
      {/* Constellation (desktop) */}
      <div className="relative hidden aspect-[4/3] min-h-[520px] lg:block" role="group" aria-label="Technology universe">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {edges.map(({ a, b }) => {
            const on = a.id === current.id || b.id === current.id;
            return (
              <line
                key={`${a.id}-${b.id}`}
                x1={a.pos[0]}
                y1={a.pos[1]}
                x2={b.pos[0]}
                y2={b.pos[1]}
                vectorEffect="non-scaling-stroke"
                stroke={on ? "var(--cyan)" : "var(--line-strong)"}
                strokeOpacity={on ? 0.9 : 0.5}
                strokeWidth={on ? 1.2 : 0.8}
                style={{ transition: "stroke 0.3s, stroke-opacity 0.3s" }}
              />
            );
          })}
        </svg>

        {skills.map((s, i) => {
          const isFocus = s.id === current.id;
          const dim = !connected.has(s.id);
          return (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(s.id)}
              onBlur={() => setHover(null)}
              onClick={() => select(s.id)}
              aria-pressed={pinned === s.id}
              data-cursor="link"
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.pos[0]}%`, top: `${s.pos[1]}%` }}
            >
              <span
                className="drift flex items-center gap-2.5 rounded-full border bg-bg-2/90 py-2 pl-2.5 pr-4 text-[0.88rem] font-medium transition-[opacity,border-color,transform,box-shadow] duration-300"
                style={
                  {
                    "--dur": `${9 + (i % 5) * 1.7}s`,
                    "--dx": `${(i % 3) - 1}px`,
                    "--dy": `${((i + 1) % 3) - 1}px`,
                    borderColor: isFocus ? CATEGORY_COLOR[s.category] : "var(--line)",
                    opacity: dim ? 0.38 : 1,
                    transform: isFocus ? "scale(1.12)" : undefined,
                    boxShadow: isFocus ? `0 0 34px -6px ${CATEGORY_COLOR[s.category]}` : undefined,
                  } as React.CSSProperties
                }
              >
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: CATEGORY_COLOR[s.category], boxShadow: `0 0 10px ${CATEGORY_COLOR[s.category]}` }}
                />
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chip cloud (mobile / tablet) */}
      <div className="space-y-7 lg:hidden">
        {CATEGORIES.map((cat) => (
          <div key={cat}>
            <p className="eyebrow mb-3 flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR[cat] }} />
              {cat}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === cat)
                .map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => select(s.id)}
                    aria-pressed={pinned === s.id}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      pinned === s.id ? "border-cyan bg-bg-3 text-fg" : "border-line text-fg-soft",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <aside className="panel relative min-h-[22rem] self-start p-7 lg:sticky lg:top-28" aria-live="polite" aria-label="Technology details">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip" style={{ borderColor: CATEGORY_COLOR[current.category] }}>
                {current.category}
              </span>
              <PlaceholderBadge show={current.placeholder} />
            </div>
            <h3 className="mt-5 text-4xl font-semibold tracking-tight">{current.name}</h3>

            <dl className="mt-7 space-y-6 text-[0.95rem]">
              <div>
                <dt className="eyebrow mb-2">What I use it for</dt>
                <dd className="text-fg-soft">{current.usedFor}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Projects</dt>
                <dd>
                  {current.projects.length === 0 ? (
                    <span className="text-muted">Add projects in data/skills.ts</span>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {current.projects.map((pid) => {
                        const p = projects.find((x) => x.id === pid);
                        return (
                          <li key={pid}>
                            <button
                              type="button"
                              onClick={() => scrollToSection("projects")}
                              className="chip transition-colors hover:border-cyan hover:text-fg"
                              data-cursor="link"
                            >
                              {p?.name ?? pid}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Experience</dt>
                <dd className="text-fg-soft">{current.experience}</dd>
              </div>
              <div>
                <dt className="eyebrow mb-2">Connected to</dt>
                <dd className="flex flex-wrap gap-2">
                  {current.related.map((rid) => {
                    const r = skills.find((s) => s.id === rid);
                    if (!r) return null;
                    return (
                      <button
                        key={rid}
                        type="button"
                        onClick={() => select(rid)}
                        className="chip transition-colors hover:border-cyan hover:text-fg"
                        data-cursor="link"
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </dd>
              </div>
            </dl>
          </motion.div>
        </AnimatePresence>
      </aside>

      {/* Legend (desktop) */}
      <ul className="hidden flex-wrap gap-x-6 gap-y-2 text-xs text-muted lg:flex lg:col-span-2" aria-label="Legend">
        {CATEGORIES.map((c) => (
          <li key={c} className="flex items-center gap-2">
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR[c] }} />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
