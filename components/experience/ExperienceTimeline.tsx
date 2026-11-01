import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { Reveal, RevealLines } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { experience } from "@/data/experience";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 text-[0.98rem] leading-relaxed text-fg-soft">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-turquoise" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ExperienceTimeline() {
  return (
    <section id="experience" data-section="experience" aria-labelledby="experience-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="05"
          eyebrow="Where has he worked?"
          lines={[
            <span key="a" id="experience-title">
              Experience,
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              in detail.
            </span>,
          ]}
        />

        <ol className="mt-16 md:mt-24">
          {experience.map((e, i) => (
            <li key={e.id} className="grid gap-8 border-t border-line py-14 first:border-t-0 md:py-20 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <Reveal>
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan">{String(i + 1).padStart(2, "0")}</p>
                  </Reveal>
                  <RevealLines as="h3" lines={[e.company]} className="mt-4 text-[clamp(2rem,3.8vw,3.2rem)] font-semibold leading-[1] tracking-[-0.04em]" />
                  <Reveal delay={0.08}>
                    <p className="mt-4 text-lg text-fg-soft">{e.role}</p>
                    <p className="mt-1 font-mono text-sm text-muted">{e.period}</p>
                    <div className="mt-4">
                      <PlaceholderBadge show={e.placeholder} />
                    </div>
                    <p className="mt-6 max-w-sm text-[0.98rem] leading-relaxed text-muted">{e.summary}</p>
                  </Reveal>
                </div>
              </div>

              <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-8">
                <Reveal>
                  <h4 className="eyebrow mb-4">What I worked on</h4>
                  <BulletList items={e.workedOn} />
                </Reveal>
                <Reveal delay={0.06}>
                  <h4 className="eyebrow mb-4">What I built</h4>
                  <BulletList items={e.built} />
                </Reveal>
                <Reveal delay={0.1}>
                  <h4 className="eyebrow mb-4">Challenges</h4>
                  <BulletList items={e.challenges} />
                </Reveal>
                <Reveal delay={0.14}>
                  <h4 className="eyebrow mb-4">Impact</h4>
                  <BulletList items={e.impact} />
                </Reveal>
                <Reveal delay={0.1} className="sm:col-span-2">
                  <h4 className="eyebrow mb-4">Technologies</h4>
                  <ul className="flex flex-wrap gap-2">
                    {e.technologies.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
