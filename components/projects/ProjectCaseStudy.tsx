"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { getLenis } from "@/lib/scroll";
import type { Project } from "@/lib/types";
import { BrowserMockup } from "./ProjectVisual";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Case-study dialog: problem → approach → implementation → outcome. Keyboard + screen-reader friendly. */
export function ProjectCaseStudy({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      getLenis()?.start();
      previouslyFocused?.focus?.();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/70 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            data-lenis-prevent
            className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-3xl border border-line-strong bg-bg-2 p-6 sm:rounded-3xl sm:p-10"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-line-strong text-lg transition-colors hover:border-cyan sm:right-6 sm:top-6"
            >
              <span aria-hidden>×</span>
            </button>

            <p className="eyebrow flex flex-wrap items-center gap-3">
              <span className="text-cyan">Case study · {project.index}</span>
              {project.kind}
              <PlaceholderBadge show={project.placeholder} />
            </p>
            <h3 id="case-study-title" className="mt-4 pr-12 text-4xl font-semibold tracking-tight sm:text-5xl">
              {project.name}
            </h3>
            <p className="serif mt-3 text-2xl text-fg-soft">{project.tagline}</p>

            <div className="mt-8">
              <BrowserMockup project={project} />
            </div>

            <div className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
              {(
                [
                  ["Problem", project.caseStudy.problem],
                  ["Approach", project.caseStudy.approach],
                  ["Implementation", project.caseStudy.implementation],
                  ["Outcome", project.caseStudy.outcome],
                ] as const
              ).map(([label, text], i) => (
                <section key={label} className="border-t border-line pt-5">
                  <h4 className="eyebrow flex items-center gap-3">
                    <span className="text-turquoise">{String(i + 1).padStart(2, "0")}</span>
                    {label}
                  </h4>
                  <p className="mt-3 leading-relaxed text-fg-soft">{text}</p>
                </section>
              ))}
            </div>

            <ul className="mt-9 flex flex-wrap gap-2" aria-label="Technology">
              {project.technology.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>

            {(project.links.live || project.links.source) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    data-cursor="link"
                  >
                    View live project ↗
                  </a>
                )}
                {project.links.source && (
                  <a
                    href={project.links.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    data-cursor="link"
                  >
                    View source code ↗
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
