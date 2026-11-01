"use client";

import Link from "next/link";
import { PlaceholderBadge } from "@/components/shared/PlaceholderBadge";
import { track } from "@/lib/analytics";
import type { BlogPostMeta } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CoverArt } from "./CoverArt";

export function BlogCard({ post, featured = false }: { post: BlogPostMeta; featured?: boolean }) {
  return (
    <article className="group relative">
      <Link
        href={`/blog/${post.slug}`}
        onClick={() => track("blog_opened", { slug: post.slug })}
        data-cursor="read"
        className="block rounded-2xl outline-offset-8"
      >
        <CoverArt
          slug={post.slug}
          cover={post.cover}
          title={post.title}
          className={
            featured
              ? "aspect-[16/9] rounded-2xl border border-line transition-transform duration-700 group-hover:scale-[1.015]"
              : "aspect-[16/10] rounded-2xl border border-line transition-transform duration-700 group-hover:scale-[1.02]"
          }
        />
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
          <PlaceholderBadge show={post.placeholder} />
        </div>
        <h3
          className={
            featured
              ? "mt-3 text-[clamp(1.7rem,3.2vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.04em] transition-colors group-hover:text-cyan"
              : "mt-3 text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.03em] transition-colors group-hover:text-cyan"
          }
        >
          {post.title}
        </h3>
        <p className="mt-3 text-[0.96rem] leading-relaxed text-muted">{post.description}</p>
      </Link>
      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
          {post.tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
