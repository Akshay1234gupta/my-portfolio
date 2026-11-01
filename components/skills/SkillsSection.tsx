import { SectionHeading } from "@/components/shared/SectionHeading";
import { SkillUniverse } from "./SkillUniverse";

export function SkillsSection() {
  return (
    <section id="skills" data-section="skills" aria-labelledby="skills-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow="What does he know?"
          lines={[
            <span key="a" id="skills-title">
              A universe of
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              technologies.
            </span>,
          ]}
          lead="No percentage bars. Hover or tap a technology to see what I use it for, where it shows up in my work, and what it connects to."
        />
        <SkillUniverse />
      </div>
    </section>
  );
}
