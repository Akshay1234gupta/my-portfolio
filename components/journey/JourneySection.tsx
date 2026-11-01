import { SectionHeading } from "@/components/shared/SectionHeading";
import { journey } from "@/data/journey";
import { JourneyTimeline } from "./JourneyTimeline";

export function JourneySection() {
  return (
    <section id="journey" data-section="journey" aria-labelledby="journey-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow="How does he think?"
          lines={[
            <span key="a" id="journey-title">
              One line of thought,
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              drawn over time.
            </span>,
          ]}
          lead="A quill drawing a line through the years — what I learned, what I shipped, and how the way I think about interfaces changed."
        />
        <JourneyTimeline years={journey} />
      </div>
    </section>
  );
}
