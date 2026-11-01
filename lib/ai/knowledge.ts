import { about } from "@/data/about";
import { currentlyBuilding } from "@/data/currentlyBuilding";
import { behindTheWork, experience } from "@/data/experience";
import { journey } from "@/data/journey";
import { now } from "@/data/now";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { skills } from "@/data/skills";
import { getAllPosts } from "@/lib/blog";

/**
 * The assistant's entire world. Generated from the same data files that render the site, so
 * updating a project on the page updates the assistant too.
 */

export interface KnowledgeChunk {
  id: string;
  kind: "profile" | "project" | "experience" | "skills" | "building" | "journey" | "blog" | "contact" | "now";
  title: string;
  text: string;
}

const PH = " (placeholder — real details have not been added yet)";

export async function buildKnowledge(): Promise<KnowledgeChunk[]> {
  const chunks: KnowledgeChunk[] = [];

  chunks.push({
    id: "profile",
    kind: "profile",
    title: `About ${siteConfig.name}`,
    text: `${siteConfig.name} is a ${siteConfig.roles.join(", ")}. ${siteConfig.tagline} ${about.bio.join(" ")}${
      about.placeholder ? PH : ""
    } ${about.pillars.map((p) => `${p.title}: ${p.text}`).join(" ")} ${siteConfig.availability}`,
  });

  for (const p of projects) {
    chunks.push({
      id: `project-${p.id}`,
      kind: "project",
      title: `Project: ${p.name}`,
      text:
        `${p.name} (${p.kind}) — ${p.tagline} ${p.description} Technology: ${p.technology.join(", ")}. ` +
        `Contribution: ${p.contribution} Key features: ${p.features.join("; ")}. ` +
        `Case study — problem: ${p.caseStudy.problem} approach: ${p.caseStudy.approach} implementation: ${p.caseStudy.implementation} outcome: ${p.caseStudy.outcome}` +
        (p.placeholder ? PH : ""),
    });
  }

  for (const e of experience) {
    const b = behindTheWork.find((x) => x.id === e.id);
    chunks.push({
      id: `experience-${e.id}`,
      kind: "experience",
      title: `Experience: ${e.company}`,
      text:
        `${e.role} at ${e.company} (${e.period}). ${e.summary} Worked on: ${e.workedOn.join("; ")}. Built: ${e.built.join("; ")}. ` +
        `Technologies: ${e.technologies.join(", ")}. Challenges: ${e.challenges.join("; ")}. Impact: ${e.impact.join("; ")}.` +
        (b
          ? ` Behind the work — problem: ${b.problem} contribution: ${b.contribution} implementation: ${b.implementation} result: ${b.result}`
          : "") +
        (e.placeholder ? PH : ""),
    });
  }

  chunks.push({
    id: "skills",
    kind: "skills",
    title: "Technologies and skills",
    text:
      skills
        .map((s) => `${s.name} (${s.category}): ${s.usedFor} Used in: ${s.projects.join(", ") || "n/a"}.`)
        .join(" ") + (skills.some((s) => s.placeholder) ? PH : ""),
  });

  chunks.push({
    id: "building",
    kind: "building",
    title: "Currently building",
    text: currentlyBuilding
      .map((c) => `${c.name} — ${c.description} Status: ${c.status}, ${c.progress}% done.${c.placeholder ? PH : ""}`)
      .join(" "),
  });

  chunks.push({
    id: "journey",
    kind: "journey",
    title: "Journey 2022–2026",
    text:
      journey.map((j) => `${j.year} — ${j.title}: ${j.summary}`).join(" ") +
      (journey.some((j) => j.placeholder) ? PH : ""),
  });

  chunks.push({
    id: "now",
    kind: "now",
    title: "What I'm doing now",
    text: now.sections.map((s) => `${s.title}: ${s.items.map((i) => i.text).join("; ")}`).join(" "),
  });

  for (const post of await getAllPosts()) {
    chunks.push({
      id: `blog-${post.slug}`,
      kind: "blog",
      title: `Article: ${post.title}`,
      text: `"${post.title}" — ${post.description} Tags: ${post.tags.join(", ")}. Published ${post.date.slice(0, 10)}. URL: /blog/${post.slug}`,
    });
  }

  chunks.push({
    id: "contact",
    kind: "contact",
    title: "Contact and availability",
    text: `${siteConfig.availability} Contact via the form on this site${
      siteConfig.contact.email.endsWith("example.com") ? "" : ` or ${siteConfig.contact.email}`
    }.`,
  });

  return chunks;
}

export function knowledgeToPrompt(chunks: KnowledgeChunk[]): string {
  return chunks.map((c) => `## ${c.title}\n${c.text}`).join("\n\n");
}
