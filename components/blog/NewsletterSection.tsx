import { Reveal, RevealLines } from "@/components/shared/Reveal";
import { blogConfig } from "@/data/blog";
import { siteConfig } from "@/data/site";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section id="newsletter" data-section="newsletter" aria-labelledby="newsletter-title" className="section">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow">Newsletter</p>
          </Reveal>
          <RevealLines
            lines={[
              <span key="a" id="newsletter-title">
                DON&rsquo;T MISS
              </span>,
              <span key="b" className="serif text-gradient pr-[0.08em] normal-case">
                the next build.
              </span>,
            ]}
            className="h-section mt-6"
          />
          <Reveal delay={0.1}>
            <p className="lead mx-auto mt-8 max-w-xl">{blogConfig.newsletter.text}</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Topics">
              {siteConfig.blogTopics.map((t) => (
                <li key={t} className="chip">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.18} className="mx-auto mt-10 max-w-xl text-left">
            <NewsletterForm source="home" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
