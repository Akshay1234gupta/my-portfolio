import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { Reveal, RevealLines } from "@/components/shared/Reveal";
import { about } from "@/data/about";

export function AboutSection() {
  return (
    <section id="about" data-section="about" aria-labelledby="about-title" className="section">
      <div className="container-x">
        <div className="max-w-[62rem] lg:max-w-[66%]">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-cyan">01</span>
              <span aria-hidden className="h-px w-8 bg-current opacity-40" />
              {about.eyebrow} <PlaceholderBadge show={about.placeholder} />
            </p>
          </Reveal>

          <h2 id="about-title" className="sr-only">
            Who is behind the interface?
          </h2>
          <RevealLines
            as="p"
            className="h-section mt-8 !text-[clamp(2.4rem,6.2vw,5.6rem)]"
            lines={[
              about.statement[0],
              <span key="s" className="serif text-gradient pr-[0.08em]">
                {about.statement[1]}
              </span>,
            ]}
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2 md:gap-12">
            {about.bio.map((p, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <p className="lead">{p}</p>
              </Reveal>
            ))}
          </div>

          <dl className="mt-20 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {about.pillars.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08} className="border-t border-line pt-6">
                <dt className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-turquoise">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-title !text-[1.3rem]">{p.title}</span>
                </dt>
                <dd className="mt-3 pl-9 text-[0.98rem] leading-relaxed text-muted">{p.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
