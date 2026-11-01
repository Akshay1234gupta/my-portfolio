import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { currentlyBuilding } from "@/data/currentlyBuilding";

export function CurrentlyBuilding() {
  return (
    <section id="building" data-section="building" aria-labelledby="building-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="08"
          eyebrow="What is he building now?"
          lines={[
            <span key="a" id="building-title">
              Currently
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              building.
            </span>,
          ]}
        />

        <ul className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {currentlyBuilding.map((item, i) => (
            <li key={item.id}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className="panel flex h-full flex-col p-7">
                  <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-fg-soft">
                    <span aria-hidden className="pulse-dot h-2 w-2 rounded-full bg-emerald" />
                    {item.status}
                    <PlaceholderBadge show={item.placeholder} />
                  </p>
                  <h3 className="h-title mt-6">{item.name}</h3>
                  <p className="mt-3 flex-1 text-[0.96rem] leading-relaxed text-muted">{item.description}</p>
                  <div className="mt-8">
                    <div className="mb-2 flex justify-between font-mono text-xs text-muted">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div
                      role="progressbar"
                      aria-label={`${item.name} progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={item.progress}
                      className="h-1 overflow-hidden rounded-full bg-line"
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan via-emerald to-purple"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
