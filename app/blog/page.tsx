import type { Metadata } from "next";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { Reveal, RevealLines } from "@/components/shared/Reveal";
import { blogConfig } from "@/data/blog";
import { absoluteUrl, siteConfig } from "@/data/site";
import { getAllPosts } from "@/lib/blog";
import { safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: blogConfig.description,
  alternates: { canonical: "/blog" },
  openGraph: { title: `Blog — ${siteConfig.name}`, description: blogConfig.description, url: absoluteUrl("/blog"), type: "website" },
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${siteConfig.name} — ${blogConfig.title}`,
    url: absoluteUrl("/blog"),
    description: blogConfig.description,
    author: { "@type": "Person", name: siteConfig.name },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: absoluteUrl(`/blog/${p.slug}`),
    })),
  };

  return (
    <div className="container-x pb-10 pt-36 md:pt-44">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <header className="max-w-4xl">
        <Reveal>
          <p className="eyebrow">Blog</p>
        </Reveal>
        <RevealLines
          as="h1"
          immediate
          className="h-display mt-6 !text-[clamp(2.8rem,8vw,7rem)]"
          lines={[
            "Notes from",
            <span key="b" className="serif text-gradient pr-[0.08em]">
              the build.
            </span>,
          ]}
        />
        <Reveal delay={0.2}>
          <p className="lead mt-8 max-w-xl">{blogConfig.description}</p>
        </Reveal>
      </header>

      {posts.length === 0 ? (
        <p className="mt-24 text-muted">No articles yet — check back soon.</p>
      ) : (
        <>
          {featured && (
            <div className="mt-16 md:mt-24 lg:max-w-[72%]">
              <Reveal>
                <BlogCard post={featured} featured />
              </Reveal>
            </div>
          )}
          {rest.length > 0 && (
            <ul className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => (
                <li key={p.slug}>
                  <Reveal delay={(i % 3) * 0.08}>
                    <BlogCard post={p} />
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <section aria-labelledby="blog-newsletter" className="panel mt-28 grid gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 id="blog-newsletter" className="h-title !text-[clamp(1.6rem,3vw,2.4rem)]">
            {blogConfig.newsletter.heading}
          </h2>
          <p className="mt-4 max-w-md text-muted">{blogConfig.newsletter.text}</p>
        </div>
        <NewsletterForm source="blog-index" />
      </section>
    </div>
  );
}
