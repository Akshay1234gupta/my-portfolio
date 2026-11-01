import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { BlogCard } from "@/components/blog/BlogCard";
import { CoverArt } from "@/components/blog/CoverArt";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { ShareButton } from "@/components/blog/ShareButton";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { blogConfig } from "@/data/blog";
import { absoluteUrl, siteConfig } from "@/data/site";
import { extractHeadings, getAllPosts, getPost, getRelatedPosts } from "@/lib/blog";
import { formatDate, safeJsonLd } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const { meta } = post;
  const url = absoluteUrl(`/blog/${meta.slug}`);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/blog/${meta.slug}` },
    authors: [{ name: meta.author }],
    keywords: meta.tags,
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.date,
      authors: [meta.author],
      tags: meta.tags,
      ...(meta.cover ? { images: [meta.cover] } : {}),
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { meta, content } = post;
  const headings = extractHeadings(content);
  const related = await getRelatedPosts(meta.slug, meta.tags, 2);
  const url = absoluteUrl(`/blog/${meta.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: { "@type": "Person", name: meta.author, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.name },
    mainEntityOfPage: url,
    keywords: meta.tags.join(", "),
    ...(meta.cover ? { image: absoluteUrl(meta.cover) } : {}),
  };

  return (
    <article className="pb-10 pt-32 md:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <header className="container-x">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb">
            <Link href="/blog" className="link-underline eyebrow" data-cursor="link">
              ← All articles
            </Link>
          </nav>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
            {meta.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
          <h1 className="mt-6 text-[clamp(2.2rem,5.4vw,4.4rem)] font-semibold leading-[1] tracking-[-0.045em] text-balance">
            {meta.title}
          </h1>
          <p className="lead mt-6">{meta.description}</p>
          <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
            <span>{meta.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span aria-hidden>·</span>
            <span>{meta.readingTime} min read</span>
            <PlaceholderBadge show={meta.placeholder} label="Sample article" />
          </p>
        </div>

        <CoverArt slug={meta.slug} cover={meta.cover} title={meta.title} priority className="mx-auto mt-12 aspect-[21/9] max-w-5xl rounded-3xl border border-line" />
      </header>

      <div className="container-x mt-14 md:mt-20">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="mx-auto max-w-[44rem] lg:mx-0">
              <BlogArticle source={content} />

              <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
                <p className="text-sm text-muted">Enjoyed this? Pass it on.</p>
                <ShareButton url={url} title={meta.title} />
              </div>
            </div>
          </div>
          <aside className="lg:col-start-2 lg:row-start-1 lg:pt-2">
            <div className="lg:sticky lg:top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>

      <div className="container-x mt-24">
        <section aria-labelledby="post-newsletter" className="panel mx-auto grid max-w-5xl gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="post-newsletter" className="h-title !text-[clamp(1.6rem,3vw,2.4rem)]">
              {blogConfig.newsletter.heading}
            </h2>
            <p className="mt-4 max-w-md text-muted">{blogConfig.newsletter.text}</p>
          </div>
          <NewsletterForm source={`post:${meta.slug}`} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mx-auto mt-24 max-w-5xl">
            <h2 id="related" className="eyebrow mb-8">
              Keep reading
            </h2>
            <ul className="grid gap-10 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
