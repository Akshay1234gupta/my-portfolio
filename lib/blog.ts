import { promises as fs } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { siteConfig } from "@/data/site";
import type { BlogFrontmatter, BlogPostMeta } from "@/lib/types";

/**
 * Blog data layer. Today: MDX files in /content/blog with YAML frontmatter.
 * Tomorrow: replace the bodies of getAllPosts / getPost with calls to a CMS — everything
 * else (pages, RSS, sitemap, AI knowledge, newsletter) only depends on these signatures.
 */

const DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 210;

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function readingTime(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));
}

async function parseFile(file: string): Promise<BlogPost | null> {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = await fs.readFile(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const fm = data as Partial<BlogFrontmatter>;
  if (!fm.title || !fm.description || !fm.date) {
    console.warn(`[blog] ${file} is missing title/description/date — skipped`);
    return null;
  }
  if (fm.draft && process.env.NODE_ENV === "production") return null;
  return {
    content,
    meta: {
      slug,
      title: fm.title,
      description: fm.description,
      date: new Date(fm.date).toISOString(),
      author: fm.author ?? siteConfig.name,
      cover: fm.cover,
      tags: fm.tags ?? [],
      placeholder: fm.placeholder,
      draft: fm.draft,
      readingTime: readingTime(content),
    },
  };
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  let files: string[] = [];
  try {
    files = (await fs.readdir(DIR)).filter((f) => /\.mdx?$/.test(f));
  } catch {
    return [];
  }
  const posts = (await Promise.all(files.map(parseFile))).filter((p): p is BlogPost => p !== null);
  return posts.map((p) => p.meta).sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  for (const ext of ["mdx", "md"]) {
    try {
      return await parseFile(`${slug}.${ext}`);
    } catch {
      /* try next extension */
    }
  }
  return null;
}

export async function getRelatedPosts(slug: string, tags: string[], count = 2): Promise<BlogPostMeta[]> {
  const all = (await getAllPosts()).filter((p) => p.slug !== slug);
  return all
    .map((p) => ({ p, score: p.tags.filter((t) => tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || +new Date(b.p.date) - +new Date(a.p.date))
    .slice(0, count)
    .map((x) => x.p);
}

export async function getAllTags(): Promise<string[]> {
  const tags = new Set<string>();
  for (const p of await getAllPosts()) p.tags.forEach((t) => tags.add(t));
  return [...tags].sort();
}

/** h2/h3 headings for the table of contents. IDs match rehype-slug (same github-slugger). */
export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[`*_]|\[([^\]]+)\]\([^)]+\)/g, "$1");
    headings.push({ id: slugger.slug(text), text, level: m[1].length as 2 | 3 });
  }
  return headings;
}
