/** Shared content types. Data files in /data conform to these. */

export interface Placeholderable {
  /** true = sample content that must be replaced with real information */
  placeholder?: boolean;
}

export interface Project extends Placeholderable {
  id: string;
  index: string;
  name: string;
  kind: string;
  tagline: string;
  description: string;
  /** Which abstract UI to draw inside the browser mockup when no screenshot exists */
  visual: "alt-text" | "forms" | "crm" | "generic";
  /** Optional real screenshot in /public (e.g. "/projects/formly.avif") */
  screenshot?: string;
  technology: string[];
  contribution: string;
  features: string[];
  links: { live?: string; source?: string };
  caseStudy: {
    problem: string;
    approach: string;
    implementation: string;
    outcome: string;
  };
}

export interface ExperienceEntry extends Placeholderable {
  id: string;
  company: string;
  role: string;
  period: string;
  summary: string;
  workedOn: string[];
  built: string[];
  technologies: string[];
  challenges: string[];
  impact: string[];
}

export interface BehindTheWork extends Placeholderable {
  id: string;
  company: string;
  problem: string;
  contribution: string;
  implementation: string;
  technology: string[];
  result: string;
}

export interface JourneyYear extends Placeholderable {
  year: string;
  title: string;
  summary: string;
  items: { label: string; text: string }[];
}

export type SkillCategory = "Core" | "UI & Motion" | "Backend & Tooling" | "AI";

export interface Skill extends Placeholderable {
  id: string;
  name: string;
  category: SkillCategory;
  /** Position inside the 0–100 × 0–100 universe canvas (desktop) */
  pos: [number, number];
  usedFor: string;
  projects: string[];
  experience: string;
  related: string[];
}

export interface CurrentlyBuildingItem extends Placeholderable {
  id: string;
  name: string;
  description: string;
  /** 0–100 */
  progress: number;
  status: string;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  author?: string;
  cover?: string;
  tags: string[];
  /** Marks sample articles that should be replaced with real writing */
  placeholder?: boolean;
  draft?: boolean;
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string;
  readingTime: number;
  author: string;
}
