/** Blog configuration. Articles themselves live in /content/blog/*.mdx (see lib/blog.ts). */
export const blogConfig = {
  title: "Notes from the build",
  description:
    "Writing on AI, React, TypeScript, frontend engineering, Framer and creative development.",
  newsletter: {
    heading: "Don't miss the next build",
    text: "I write about AI, React, TypeScript, Frontend Engineering, Framer and Creative Development. New articles, straight to your inbox. No spam, unsubscribe any time.",
  },
  /** How many articles the home page teases */
  homePreviewCount: 3,
} as const;
