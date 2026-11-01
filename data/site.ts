/**
 * Site-wide configuration.
 *
 * Anything flagged `placeholder: true` (or wrapped in PLACEHOLDER below) is NOT real
 * information — replace it before launch. Search the repo for "PLACEHOLDER" to find all of it.
 */

export const siteConfig = {
  name: "Akshay Gupta",
  handle: "akshaygupta",
  role: "Software Engineer · Frontend Developer · Creative Explorer",
  roles: ["Software Engineer", "Frontend Developer", "Creative Explorer"],
  tagline: "I build interfaces that feel alive.",
  description:
    "Akshay Gupta — Software Engineer and Frontend Developer specializing in React, Next.js, TypeScript, Ant Design, Framer Plugins, and Spring Boot.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  location: "Khargone, M.P & Ahmedabad, India",
  availability: "Available for interesting engineering opportunities.",
  /** Shown as a small "sample" chip next to placeholder content. Set NEXT_PUBLIC_SHOW_PLACEHOLDERS=false to hide. */
  showPlaceholders: process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true",
  contact: {
    email: "akshayguptaa444@gmail.com",
    phone: "+91 8103465748",
  },
  links: {
    github: "https://github.com/Akshay1234gupta",
    linkedin: "https://www.linkedin.com/in/akshay-gupta-bbb974238",
    instagram: "https://www.instagram.com/_akshay_gupta_35/",
    resume: "/resume.pdf",
    resumeDrive: "https://drive.google.com/file/d/1aZyuyB4E5RyhLFfEoYa3OCEvTkVxAsV7/view?usp=sharing",
  },
  blogTopics: ["React", "TypeScript", "Frontend Engineering", "Microfrontends", "Framer", "Spring Boot"],
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
