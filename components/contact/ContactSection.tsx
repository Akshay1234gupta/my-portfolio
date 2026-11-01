import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { siteConfig } from "@/data/site";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" data-section="contact" aria-labelledby="contact-title" className="section">
      <div className="container-x">
        <SectionHeading
          index="10"
          eyebrow="Can I work with him?"
          lines={[
            <span key="a" id="contact-title">
              Let&rsquo;s build something
            </span>,
            <span key="b" className="serif text-gradient pr-[0.08em]">
              that feels alive.
            </span>,
          ]}
        />

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12">
          <Reveal className="lg:col-span-4 lg:col-start-1">
            <p className="lead max-w-sm">{siteConfig.availability} Tell me a little about what you have in mind.</p>
            <ul className="mt-8 space-y-3 text-[0.98rem]">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="link-underline" data-cursor="link">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href="tel:+918103465748" className="link-underline" data-cursor="link">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="text-muted">
                {siteConfig.location}
              </li>
              <li>
                <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="link-underline" data-cursor="link">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline" data-cursor="link">
                  LinkedIn ↗
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8 lg:col-start-5">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
