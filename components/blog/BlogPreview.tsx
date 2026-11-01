import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { blogConfig } from "@/data/blog";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "./BlogCard";

export async function BlogPreview() {
  const posts = (await getAllPosts()).slice(0, blogConfig.homePreviewCount);

  return (
    <section id="blog" data-section="blog" aria-labelledby="blog-title" className="section">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index="09"
            eyebrow="What does he write about?"
            lines={[
              <span key="a" id="blog-title">
                Notes from
              </span>,
              <span key="b" className="serif text-gradient pr-[0.08em]">
                the build.
              </span>,
            ]}
          />
          <Reveal>
            <Link href="/blog" className="btn" data-cursor="link">
              All articles <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        {posts.length === 0 ? (
          <p className="mt-16 text-muted">Articles are coming soon.</p>
        ) : (
          <ul className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 0.08}>
                  <BlogCard post={p} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
