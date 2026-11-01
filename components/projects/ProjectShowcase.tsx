"use client";

import { useCallback, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { ProjectCaseStudy } from "./ProjectCaseStudy";

export function ProjectShowcase() {
  const [open, setOpen] = useState<Project | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className="mt-10 divide-y divide-line md:mt-16">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} flip={i % 2 === 1} onOpenCaseStudy={setOpen} />
        ))}
      </div>
      <ProjectCaseStudy project={open} onClose={close} />
    </>
  );
}
