import type { Project } from "@/lib/types";

/**
 * Featured projects by Akshay Gupta.
 * Reflects production work at Saeculum Solutions (Framer plugins, WAWF ecosystem, CRM microfrontends)
 * and full-stack web platforms with title-related UI screenshots.
 */
export const projects: Project[] = [
  {
    id: "auto-alt-text",
    index: "01",
    name: "Auto Alt Text",
    kind: "Framer Plugin · AI Vision & Accessibility",
    tagline: "Automated alt text generation inside Framer.",
    description:
      "A production Framer plugin that analyzes canvas images and automatically generates descriptive alt text, streamlining web accessibility workflows directly inside the design workspace.",
    visual: "alt-text",
    screenshot: "/projects/auto-alt-text.jpg",
    technology: ["React", "TypeScript", "Framer Plugin API", "REST APIs", "AI Vision"],
    contribution:
      "Designed and developed frontend functionality, integrated Framer Plugin APIs and property controls, and implemented automated alt text handling logic.",
    features: [
      "Automated image recognition and descriptive alt text generation",
      "Seamless integration with Framer canvas property controls",
      "One-click review, editing, and batch application directly onto canvas layers",
    ],
    links: {
      source: "https://github.com/Akshay1234gupta",
    },
    caseStudy: {
      problem:
        "Designers often overlook image alt text when publishing Framer sites, hurting web accessibility standards and SEO because manually authoring descriptions for dozens of assets is tedious.",
      approach:
        "Engineered an in-canvas Framer plugin that automates description generation while giving creators instantaneous preview and editing control.",
      implementation:
        "Used Framer Plugin APIs to traverse canvas nodes, detect image layers, query vision APIs, and bind property controls to update image metadata dynamically.",
      outcome:
        "Boosted accessibility compliance for published sites and eliminated external tools for alt-text management.",
    },
    placeholder: false,
  },
  {
    id: "formly",
    index: "02",
    name: "Formly (Forms Plugin)",
    kind: "Framer Plugin · Form Architecture",
    tagline: "Custom form builder with dynamic validation & CAPTCHA.",
    description:
      "A custom Forms Plugin for Framer empowering creators to build, style, and configure complex web forms with basic, advanced, and CAPTCHA-secured fields.",
    visual: "forms",
    screenshot: "/projects/formly.jpg",
    technology: ["React", "TypeScript", "Framer Plugin API", "Tailwind CSS"],
    contribution:
      "Architected reusable field schemas, dynamic property controls, dynamic validation logic, and intuitive form management controls.",
    features: [
      "Basic, Advanced, and CAPTCHA-enabled input field schemas",
      "Dynamic Framer canvas property controls for styling and form state",
      "Built-in client-side validation and responsive field layouts",
    ],
    links: {
      source: "https://github.com/Akshay1234gupta",
    },
    caseStudy: {
      problem:
        "Default form elements in design tools lack fine-grained field schemas, validation rules, and spam mitigation needed for commercial production sites.",
      approach:
        "Architected an extensible form builder with modular input types, responsive layout configurations, and plug-and-play CAPTCHA integration.",
      implementation:
        "Defined typed JSON field schemas in TypeScript, handled validation rules dynamically, and hooked into Framer's Property Controls API for live canvas styling.",
      outcome:
        "Provided creators with production-grade form capability without needing third-party script embeds or iframe bloat.",
    },
    placeholder: false,
  },
  {
    id: "wawf-platform",
    index: "03",
    name: "WAWF Admin Panel & Extension",
    kind: "Enterprise Web App & Browser Extension",
    tagline: "WhatsApp Web business features & enterprise administration.",
    description:
      "An enterprise ecosystem comprising a modular admin panel and a browser extension that unlocks business-focused productivity features directly inside WhatsApp Web.",
    visual: "crm",
    screenshot: "/projects/wawf-extension.jpg",
    technology: ["React", "TypeScript", "JavaScript", "Ant Design", "Tailwind CSS", "Browser Extension API"],
    contribution:
      "Developed enterprise frontend modules, built reusable UI components (Modals, Drawers, Collapse panels, Loaders), implemented multi-language i18n, and contributed to browser extension capabilities.",
    features: [
      "Browser extension injecting business features and contact workflows into WhatsApp Web",
      "Enterprise admin dashboard with high-density data tables and analytics",
      "Internationalization (i18n) via structured language JSON files",
      "Reusable UI component suite crafted with Ant Design and Tailwind CSS",
    ],
    links: {
      source: "https://github.com/Akshay1234gupta",
    },
    caseStudy: {
      problem:
        "Businesses using WhatsApp Web lacked centralized administrative controls, bulk tooling, and custom workflow features necessary to manage large customer communication volumes.",
      approach:
        "Built a dual-layer solution: an in-browser extension extending WhatsApp Web UI and a standalone enterprise administration panel for configuration and customer insights.",
      implementation:
        "Engineered the admin panel in React, TypeScript, and Ant Design with i18n localization. Developed the browser extension with robust DOM injection and background message passing.",
      outcome:
        "Equipped enterprise clients with powerful WhatsApp business capabilities while maintaining high runtime stability and UI responsiveness.",
    },
    placeholder: false,
  },
  {
    id: "crm-microfrontend",
    index: "04",
    name: "Enterprise CRM Platform",
    kind: "Microfrontend Architecture · Platform",
    tagline: "Scalable enterprise CRM with modular microfrontends.",
    description:
      "A high-throughput enterprise CRM platform built on microfrontend architecture, uniting client relationship data, conversation tracking, and internal UI systems.",
    visual: "crm",
    screenshot: "/projects/crm-platform.jpg",
    technology: ["React", "TypeScript", "Ant Design", "Microfrontends", "REST APIs"],
    contribution:
      "Engineered modular microfrontends, integrated Ant Design component standards, and connected frontend modules with container orchestration.",
    features: [
      "Decoupled microfrontends orchestrated inside a master container shell",
      "Standardized UI component library based on Ant Design",
      "Dense data tables, sliding drawers, and conversation history",
    ],
    links: {
      source: "https://github.com/Akshay1234gupta",
    },
    caseStudy: {
      problem:
        "Monolithic CRM platforms create tight coupling, deployment bottlenecks, and increased regression risk during frequent feature releases.",
      approach:
        "Adopted a microfrontend architecture allowing separate feature teams to build, test, and deploy independent modules within a unified container shell.",
      implementation:
        "Implemented host-container routing, shared state channels, and reusable UI components using Ant Design patterns and strict TypeScript contracts.",
      outcome:
        "Accelerated release cycles, reduced module load footprint, and maintained unified visual consistency across large enterprise modules.",
    },
    placeholder: false,
  },
  {
    id: "smart-contact-manager",
    index: "05",
    name: "Smart Contact Manager",
    kind: "Full Stack · Web Application",
    tagline: "Cloud contact management with integrated messaging.",
    description:
      "A full-stack web application for efficient contact management, allowing users to securely add, edit, view, and delete contacts, with an integrated messaging system.",
    visual: "generic",
    screenshot: "/projects/contact-manager.jpg",
    technology: ["Spring Boot", "Tailwind CSS", "MySQL", "REST APIs", "Java"],
    contribution:
      "Designed and developed the application end-to-end: Spring Boot backend, MySQL database schema, and responsive Tailwind UI.",
    features: [
      "Secure contact management with full CRUD operations",
      "Integrated messaging feature for communication with saved contacts",
      "Responsive, clean UI designed with Tailwind CSS",
    ],
    links: {
      source: "https://github.com/Akshay1234gupta/Smart-Contact-Manager",
    },
    caseStudy: {
      problem:
        "Users frequently struggle with disorganized personal and professional address books and lack simple messaging shortcuts for saved contacts.",
      approach:
        "Built a dedicated web portal with authenticated access, categorized contact records, and direct messaging workflows.",
      implementation:
        "Developed a Spring Boot REST backend with Hibernate ORM and MySQL database, paired with a responsive Tailwind CSS frontend.",
      outcome:
        "Delivered a fast, secure contact directory that centralizes communications and contact data in one place.",
    },
    placeholder: false,
  },
  {
    id: "job-portal",
    index: "06",
    name: "Job Portal Web Application",
    kind: "Full Stack · Web Application",
    tagline: "Connecting job seekers and employers with seamless applications.",
    description:
      "A comprehensive job portal platform connecting job seekers with employers, featuring job postings, resume uploads, and advanced search filters.",
    visual: "generic",
    screenshot: "/projects/job-portal.jpg",
    technology: ["React", "Spring Boot", "Tailwind CSS", "MySQL", "REST APIs"],
    contribution:
      "Built candidate and employer portals, resume upload handling, keyword search, and linked React UI with Spring Boot REST endpoints.",
    features: [
      "Secure authentication and profile management for candidates and employers",
      "Resume upload and live job application tracking",
      "Advanced filtering by job role, category, and location",
    ],
    links: {
      source: "https://github.com/Akshay1234gupta/job-portal-frontend",
    },
    caseStudy: {
      problem:
        "Job seekers face bloated application portals, while hiring teams require clean, accessible applicant tracking without complex onboarding.",
      approach:
        "Engineered an intuitive job marketplace connecting candidates and recruiters through clean application flows.",
      implementation:
        "Created a React frontend with responsive Tailwind CSS components, supported by a Spring Boot REST API and MySQL database for user credentials and job postings.",
      outcome:
        "Successfully simplified the hiring process with quick resume submissions and intuitive recruiter pipeline views.",
    },
    placeholder: false,
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
