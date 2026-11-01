import type { BehindTheWork, ExperienceEntry } from "@/lib/types";

/**
 * Work experience at Saeculum Solutions Pvt. Ltd. (Ahmedabad, India).
 * Exactly synchronized with latest resume.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "saeculum-junior",
    company: "Saeculum Solutions Pvt. Ltd.",
    role: "Junior Software Engineer",
    period: "Dec 2025 — Present",
    summary:
      "Engineering enterprise web applications, microfrontends, browser extensions, and custom Framer plugins.",
    workedOn: [
      "CRM Application (Microfrontend Architecture)",
      "Framer Plugin – Auto Alt Text",
      "Framer Plugin – Forms Plugin",
      "WAWF Admin Panel – Enterprise Web Application (Ongoing)",
      "WAWF Extension – WhatsApp Web Browser Extension (Ongoing)",
    ],
    built: [
      "Auto Alt Text Framer plugin with automated alt text generation and canvas property controls",
      "Custom Forms Plugin with Basic, Advanced, and CAPTCHA-enabled field schemas",
      "WAWF Admin Panel reusable UI components (Modals, Drawers, Collapse panels, Loaders) using Ant Design & Tailwind CSS",
      "Multi-language internationalization (i18n) pipeline using structured language JSON files",
      "WAWF browser extension delivering business features for WhatsApp Web using React & TypeScript",
      "Scalable microfrontend modules and container integrations for enterprise CRM",
    ],
    technologies: [
      "React",
      "TypeScript",
      "JavaScript",
      "Ant Design",
      "Tailwind CSS",
      "Framer Plugin API",
      "Microfrontends",
      "Browser Extensions",
    ],
    challenges: [
      "Coordinating state and events between WhatsApp Web DOM context and extension UI seamlessly",
      "Maintaining microfrontend isolation and unified design standards across distributed modules",
      "Building high-performance property controls in Framer without canvas layout lag",
    ],
    impact: [
      "Enhanced web accessibility workflows for designers via automated alt text generation in Framer",
      "Delivered robust enterprise UI modules with structured internationalization for global users",
      "Improved runtime stability and interface responsiveness across production applications",
    ],
    placeholder: false,
  },
  {
    id: "saeculum-intern",
    company: "Saeculum Solutions Pvt. Ltd.",
    role: "Software Engineer Intern",
    period: "May 2025 — Nov 2025",
    summary:
      "Gained hands-on experience with production workflows, industry standards, and component architectures.",
    workedOn: [
      "Frontend feature implementation and responsive UI enhancements",
      "Agile team collaboration and Git-based code review cycles",
    ],
    built: [
      "Responsive UI features using React, JavaScript, TypeScript, Ant Design, HTML, CSS, and Tailwind CSS",
      "Clean, modular components following software development lifecycle (SDLC) best practices",
    ],
    technologies: ["React", "JavaScript", "TypeScript", "Ant Design", "HTML5", "CSS3", "Tailwind CSS", "Git"],
    challenges: [
      "Stepping up from academic projects to enterprise-grade codebases with strict type safety and linting",
      "Rapidly mastering production component libraries and Agile sprint workflows",
    ],
    impact: [
      "Consistently completed sprint deliverables with high code quality and minimal defect rates",
      "Transitioned smoothly from intern to full-time Junior Software Engineer",
    ],
    placeholder: false,
  },
];

/** "Behind the work" — what was actually engineered inside Saeculum Solutions. */
export const behindTheWork: BehindTheWork[] = [
  {
    id: "saeculum-junior",
    company: "Saeculum Solutions Pvt. Ltd. (Junior Engineer)",
    problem:
      "Enterprise teams required unified CRM and WhatsApp Web business management tools, while creators in Framer needed automated accessibility solutions and flexible form builders.",
    contribution:
      "Engineered frontend modules for WAWF Admin Panel & Extension, developed Auto Alt Text and Forms plugins for Framer, and contributed to CRM microfrontends.",
    implementation:
      "Constructed modular React/TypeScript architectures. Built reusable UI components (Modals, Drawers, Loaders) with Ant Design and Tailwind CSS, structured internationalization (i18n) via JSON dictionaries, and interfaced with Framer Plugin APIs and browser extension background scripts.",
    technology: [
      "React",
      "TypeScript",
      "Ant Design",
      "Tailwind CSS",
      "Framer Plugin API",
      "Microfrontends",
      "Browser Extensions",
    ],
    result:
      "Shipped production-grade Framer plugins, empowered WhatsApp business operations through the WAWF extension, and achieved high interface stability across enterprise apps.",
    placeholder: false,
  },
  {
    id: "saeculum-intern",
    company: "Saeculum Solutions Pvt. Ltd. (Internship)",
    problem:
      "Maintaining responsive fidelity and component consistency across dynamic web views during fast-paced product sprint cycles.",
    contribution:
      "Built and enhanced responsive UI features with React, TypeScript, and Ant Design, actively participating in Agile sprints.",
    implementation:
      "Adopted strict component-based architecture, modularized styling with Tailwind CSS, and collaborated through Git version control and team reviews.",
    technology: ["React", "TypeScript", "JavaScript", "Ant Design", "Tailwind CSS", "Git"],
    result:
      "Delivered reliable UI improvements that streamlined QA approval times and earned promotion to Junior Software Engineer.",
    placeholder: false,
  },
];
