import type { JourneyYear } from "@/lib/types";

/**
 * Akshay Gupta's engineering journey from 2022 to 2026.
 */
export const journey: JourneyYear[] = [
  {
    year: "2022",
    title: "Foundations in Computer Science",
    summary:
      "Began deep study into computer science fundamentals at Jawaharlal Institute of Technology, Borawan Khargone.",
    items: [
      { label: "Academics", text: "Computer Science & Engineering core curriculum (DSA, OOP, OS)" },
      { label: "Languages", text: "Mastered C and Core Java fundamentals, algorithms, and problem solving" },
      { label: "Milestone", text: "Built first command-line and desktop software utilities" },
    ],
    placeholder: false,
  },
  {
    year: "2023",
    title: "Backend & Full-Stack Foundations",
    summary: "Expanded into enterprise Java, relational databases, and full-stack web applications.",
    items: [
      { label: "Stack", text: "Java, JDBC, Servlets, Hibernate, Spring Boot, and MySQL" },
      { label: "Projects", text: "Engineered Student Management System with full CRUD workflows" },
      { label: "Certifications", text: "Earned Java Programming Certification from Infosys Springboard" },
    ],
    placeholder: false,
  },
  {
    year: "2024",
    title: "Frontend Craft & Modern Frameworks",
    summary:
      "Shifted heavy focus toward modern UI engineering with React, Tailwind CSS, and REST API architectures.",
    items: [
      { label: "Frontend", text: "Adopted React.js, modern JavaScript/ES6+, and Tailwind CSS" },
      { label: "Projects", text: "Built Smart Contact Manager with messaging & Job Portal platform" },
      { label: "DSA", text: "Crossed 250+ solved algorithmic challenges on competitive coding platforms" },
      { label: "Certification", text: "Spring Development Certification on LinkedIn Learning" },
    ],
    placeholder: false,
  },
  {
    year: "2025",
    title: "Shipping Production Software at Saeculum",
    summary:
      "Completed B.Tech CSE (7.76 CGPA) and joined Saeculum Solutions Pvt. Ltd. (Ahmedabad) as an Engineer.",
    items: [
      { label: "Graduation", text: "B.Tech in Computer Science & Engineering (7.76 CGPA)" },
      { label: "Career", text: "Joined Saeculum Solutions as Software Engineer Intern, promoted to Junior Software Engineer" },
      { label: "Plugins", text: "Engineered Framer plugins: Auto Alt Text (AI accessibility) & Formly (Dynamic Forms)" },
      { label: "WAWF & CRM", text: "Contributed to CRM microfrontends, WAWF Admin Panel (i18n), and WAWF WhatsApp Web extension" },
    ],
    placeholder: false,
  },
  {
    year: "2026",
    title: "Interfaces That Feel Alive",
    summary:
      "Engineering robust enterprise applications, microfrontend ecosystems, and Next.js interfaces with craft and performance.",
    items: [
      { label: "Current Focus", text: "Full-time Junior Software Engineer at Saeculum Solutions" },
      { label: "Stack", text: "React, Next.js, TypeScript, Ant Design, Tailwind CSS, Microfrontends" },
      { label: "Next", text: "Advancing scalable frontend systems and exploring AI-grounded interactive tools" },
    ],
    placeholder: false,
  },
];
