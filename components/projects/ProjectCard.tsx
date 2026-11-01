"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MagneticButton } from "@/components/shared/MagneticButton";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { Reveal, RevealLines } from "@/components/shared/Reveal";
import { track } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/prefs";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BrowserMockup } from "./ProjectVisual";

interface ProjectCardProps {
  project: Project;
  flip: boolean;
  onOpenCaseStudy: (project: Project) => void;
}

/** One featured project, laid out as a mini case study with a parallax browser mockup. */
export function ProjectCard({ project, flip, onOpenCaseStudy }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [70, -70]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [0, 0, 0] : [flip ? -2.2 : 2.2, 0, flip ? 2.2 : -2.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduced ? [1, 1, 1] : [0.94, 1, 0.97]);

  return (
    <article
      ref={ref}
      aria-labelledby={`project-${project.id}`}
      data-cursor="view"
      className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-12 lg:gap-14"
    >
      <div className={cn("lg:col-span-5", flip ? "lg:order-2 lg:col-start-8" : "lg:col-start-1")}>
        <Reveal>
          <p className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted">
            <span className="text-cyan">Project {project.index}</span>
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
            {project.kind}
            <PlaceholderBadge show={project.placeholder} />
          </p>
        </Reveal>

        <RevealLines
          as="h3"
          lines={[project.name]}
          className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
        />
        <span id={`project-${project.id}`} className="sr-only">
          {project.name}
        </span>

        <Reveal delay={0.08}>
          <p className="serif mt-4 text-2xl text-fg-soft md:text-[1.7rem]">{project.tagline}</p>
          <p className="mt-5 text-[1rem] leading-relaxed text-muted">{project.description}</p>
        </Reveal>

        <Reveal delay={0.12}>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology">
            {project.technology.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.16}>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="eyebrow mb-2">My contribution</dt>
              <dd className="text-[0.95rem] leading-relaxed text-fg-soft">{project.contribution}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Key features</dt>
              <dd>
                <ul className="space-y-2 text-[0.95rem] text-fg-soft">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span aria-hidden className="mt-[0.6em] h-1 w-3 shrink-0 rounded-full bg-turquoise" />
                      {f}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
          {project.links.live && (
            <MagneticButton
              variant="primary"
              href={project.links.live}
              external
              aria-label={`View live demo for ${project.name}`}
              onClick={() => track("project_clicked", { project: project.id, type: "live" })}
            >
              View live <span aria-hidden>↗</span>
            </MagneticButton>
          )}
          {project.links.source && (
            <MagneticButton
              variant={project.links.live ? "secondary" : "primary"}
              href={project.links.source}
              external
              aria-label={`View source code for ${project.name}`}
              onClick={() => track("project_clicked", { project: project.id, type: "source" })}
            >
              View code <span aria-hidden>↗</span>
            </MagneticButton>
          )}
          {!project.links.live && !project.links.source && (
            <MagneticButton
              variant="primary"
              disabled
              aria-label={`${project.name} — link coming soon`}
            >
              Link coming soon
            </MagneticButton>
          )}
          <MagneticButton
            onClick={() => {
              track("case_study_opened", { project: project.id });
              onOpenCaseStudy(project);
            }}
          >
            Case study
          </MagneticButton>
        </Reveal>
      </div>

      <div className={cn("lg:col-span-7", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-6")}>
        <motion.div style={{ y, rotate, scale }} data-cursor="explore" className="will-change-transform">
          <BrowserMockup project={project} />
        </motion.div>
      </div>
    </article>
  );
}
