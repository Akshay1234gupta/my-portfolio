/**
 * About section copy. The headline and statement come from the brief; the pillars are
 * PLACEHOLDER-quality descriptions of a general approach — rewrite them in your own voice.
 */
export const about = {
  eyebrow: "Who is behind the interface?",
  statement: ["I don't just write code.", "I turn ideas into experiences."],
  bio: [
    "I'm Akshay Gupta — a Software Engineer at Saeculum Solutions with a passion for frontend engineering, microfrontends, and modern web architectures.",
    "I craft responsive, resilient interfaces using React, Next.js, TypeScript, Ant Design, and Tailwind CSS, backed by strong fundamentals in Java, Spring Boot, and RESTful APIs. From developing Framer plugins like Auto Alt Text and Formly to building the WAWF Admin Panel and WhatsApp Web browser extension, I bridge the space between design fidelity and performant production code.",
  ],
  placeholder: false,
  pillars: [
    {
      title: "Microfrontends & Design Systems",
      text: "Contributing to decoupled, enterprise-grade architectures with modular microfrontends and reusable UI systems based on Ant Design and Tailwind CSS.",
    },
    {
      title: "Plugin & Extension Engineering",
      text: "Architecting custom Framer plugins with dynamic property controls, reusable JSON schemas, and automated accessibility pipelines.",
    },
    {
      title: "Full-Stack Foundations",
      text: "Solid grounding in Java, Spring Boot, Hibernate, MySQL, and REST APIs, enabling confident full-stack communication and end-to-end delivery.",
    },
    {
      title: "Clean Code & Problem Solving",
      text: "Over 250+ algorithmic problems solved on competitive platforms, pairing algorithmic discipline with clean, maintainable component design.",
    },
    {
      title: "Interfaces That Feel Alive",
      text: "Motion, feedback, and interactive craft applied with discipline — ensuring animations enhance usability rather than slow down users.",
    },
  ],
} as const;
