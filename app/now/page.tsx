import type { Metadata } from "next";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { Reveal, RevealLines } from "@/components/shared/Reveal";
import { now } from "@/data/now";
import { absoluteUrl, siteConfig } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${siteConfig.name} is building, learning, experimenting with and reading right now.`,
  alternates: { canonical: "/now" },
  openGraph: { title: `Now — ${siteConfig.name}`, url: absoluteUrl("/now"), type: "website" },
};

export default function NowPage() {
  return (
    <div className="container-x pb-10 pt-36 md:pt-44">
      <header className="max-w-3xl">
        <Reveal>
          <p className="eyebrow">/now · Updated {formatDate(now.updated)}</p>
        </Reveal>
        <RevealLines
          as="h1"
          immediate
          className="h-display mt-6 !text-[clamp(2.8rem,8vw,7rem)]"
          lines={[
            "What I'm doing",
            <span key="b" className="serif text-gradient pr-[0.08em]">
              right now.
            </span>,
          ]}
        />
        <Reveal delay={0.2}>
          <p className="lead mt-8 max-w-xl">{now.intro}</p>
        </Reveal>
      </header>

      <div className="mt-20 max-w-3xl divide-y divide-line border-y border-line lg:max-w-[62%]">
        {now.sections.map((s, i) => (
          <section key={s.id} aria-labelledby={`now-${s.id}`} className="grid gap-4 py-10 sm:grid-cols-[11rem_1fr] sm:gap-10">
            <Reveal>
              <h2 id={`now-${s.id}`} className="eyebrow pt-1">
                <span className="mr-3 text-cyan">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <ul className="space-y-3 text-[1.02rem] leading-relaxed text-fg-soft">
                {s.items.map((item) => (
                  <li key={item.text} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-turquoise" />
                    <span>
                      {item.text} <PlaceholderBadge show={"placeholder" in item && item.placeholder} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
