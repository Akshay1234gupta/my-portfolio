export type SectionId =
  | "hero"
  | "about"
  | "journey"
  | "skills"
  | "projects"
  | "experience"
  | "behind"
  | "playground"
  | "building"
  | "blog"
  | "newsletter"
  | "contact"
  | "footer";

export interface SectionMeta {
  id: SectionId;
  label: string;
  /** Show in the top navigation */
  nav: boolean;
}

/** Order here is the order sections appear on the home page. */
export const sections: readonly SectionMeta[] = [
  { id: "hero", label: "Home", nav: true },
  { id: "about", label: "About", nav: true },
  { id: "journey", label: "Journey", nav: false },
  { id: "skills", label: "Skills", nav: true },
  { id: "projects", label: "Projects", nav: true },
  { id: "experience", label: "Experience", nav: true },
  { id: "behind", label: "Behind the work", nav: false },
  { id: "playground", label: "Ask AI", nav: false },
  { id: "building", label: "Building", nav: false },
  { id: "blog", label: "Blog", nav: true },
  { id: "newsletter", label: "Newsletter", nav: false },
  { id: "contact", label: "Contact", nav: true },
  { id: "footer", label: "Footer", nav: false },
] as const;

export const navItems = sections.filter((s) => s.nav);
