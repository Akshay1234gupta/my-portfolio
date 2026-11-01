/**
 * /now page — snapshot of Akshay Gupta's current work and focus.
 */
export const now = {
  updated: "2026-11-01",
  intro:
    "A snapshot of what has my attention right now — inspired by Derek Sivers' /now movement. Here is what I am building, learning, and thinking about today.",
  sections: [
    {
      id: "building",
      title: "Building",
      items: [
        { text: "WAWF Admin Panel & WhatsApp Web browser extension for enterprise messaging workflows." },
        { text: "This interactive portfolio — perfecting the procedural peacock feather and scroll choreography." },
        { text: "Reusable UI systems with Ant Design, TypeScript, and custom Framer plugins." },
      ],
    },
    {
      id: "learning",
      title: "Learning & Deepening",
      items: [
        { text: "Advanced microfrontend communication patterns and container state isolation." },
        { text: "Next.js App Router performance optimizations and Turbopack compiler ergonomics." },
      ],
    },
    {
      id: "experimenting",
      title: "Experimenting with",
      items: [
        { text: "AI-grounded developer assistants and automated accessibility inspection in design tools." },
        { text: "Smooth scroll physics with Lenis and GPU-accelerated SVG animation layers." },
      ],
    },
    {
      id: "exploring",
      title: "Technologies I'm exploring",
      items: [
        { text: "Tailwind CSS v4 engine and CSS @property gradient interpolations." },
        { text: "Interactive canvas APIs and plugin architectures for design-to-code workflows." },
      ],
    },
    {
      id: "reading",
      title: "Reading & Research",
      items: [
        { text: "Web interface performance patterns, accessible rich internet applications (ARIA), and design systems at scale." },
      ],
    },
  ],
} as const;
