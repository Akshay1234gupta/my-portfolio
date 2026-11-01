import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProjectShowcase } from "./ProjectShowcase";

export function ProjectsSection() {
  return (
    <section id="projects" data-section="projects" aria-labelledby="projects-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow="What does he build?"
          lines={[
            <span key="a" id="projects-title">
              Selected work,
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              told as case studies.
            </span>,
          ]}
          lead="Each project is more than a screenshot. Open a case study for the problem, the approach, and how it was engineered."
        />
        <ProjectShowcase />
      </div>
    </section>
  );
}
