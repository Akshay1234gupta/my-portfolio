import Link from "next/link";
import { siteConfig } from "@/data/site";

const links = [
  { label: "GitHub", href: siteConfig.links.github, external: true },
  { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
  { label: "Email", href: `mailto:${siteConfig.contact.email}`, external: false },
  { label: "Blog", href: "/blog", external: false },
  { label: "Now", href: "/now", external: false },
];

export function Footer() {
  return (
    <footer data-section="footer" className="relative mt-24 min-h-[70svh] border-t border-line">
      <div className="container-x flex min-h-[70svh] flex-col justify-between py-16 md:py-24">
        <div>
          <p className="flex items-center gap-3 eyebrow">
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald" aria-hidden />
            {siteConfig.availability}
          </p>
          <p className="mt-10 text-[clamp(2.8rem,10vw,9.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.055em]">
            Akshay
            <br />
            <span className="text-gradient">Gupta</span>
          </p>
          <p className="serif mt-8 max-w-xl text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight text-fg-soft">
            Building digital experiences
            <br />
            with code, creativity &amp; AI.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[0.95rem]">
              {links.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-underline" data-cursor="link">
                      {l.label} ↗
                    </a>
                  ) : l.href.startsWith("mailto:") ? (
                    <a href={l.href} className="link-underline" data-cursor="link">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="link-underline" data-cursor="link">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-sm text-muted">© 2026 {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
