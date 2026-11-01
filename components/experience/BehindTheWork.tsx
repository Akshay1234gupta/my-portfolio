import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { behindTheWork } from "@/data/experience";

export function BehindTheWorkSection() {
  return (
    <section id="behind" data-section="behind" aria-labelledby="behind-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="06"
          eyebrow="Behind the work"
          lines={[
            <span key="a" id="behind-title">
              What I actually
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              built inside companies.
            </span>,
          ]}
          lead="Job titles say little. This is the engineering: the problem, what I owned, how it was built, and what changed."
        />

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-2">
          {behindTheWork.map((b, i) => {
            const steps: Array<{ label: string; body: React.ReactNode }> = [
              { label: "Problem", body: b.problem },
              { label: "My contribution", body: b.contribution },
              { label: "Technical implementation", body: b.implementation },
              {
                label: "Technology",
                body: (
                  <ul className="flex flex-wrap gap-2">
                    {b.technology.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                ),
              },
              { label: "Result", body: b.result },
            ];
            return (
              <Reveal key={b.id} delay={i * 0.08}>
                <article className="panel h-full p-7 sm:p-9" aria-label={`Behind the work at ${b.company}`}>
                  <header className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="h-title">{b.company}</h3>
                    <PlaceholderBadge show={b.placeholder} />
                  </header>
                  <ol className="mt-8">
                    {steps.map((s, si) => (
                      <li key={s.label} className="relative pb-8 pl-8 last:pb-0">
                        {si < steps.length - 1 && (
                          <span aria-hidden className="absolute left-[5px] top-4 h-full w-px bg-gradient-to-b from-turquoise/60 to-transparent" />
                        )}
                        <span aria-hidden className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border border-turquoise bg-bg-2" />
                        <p className="eyebrow mb-2">{s.label}</p>
                        <div className="text-[0.96rem] leading-relaxed text-fg-soft">{s.body}</div>
                        {si < steps.length - 1 && (
                          <span aria-hidden className="absolute -bottom-0.5 left-0.5 font-mono text-[10px] text-turquoise/70">
                            ↓
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
