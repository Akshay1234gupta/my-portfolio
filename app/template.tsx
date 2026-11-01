"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

let hasMounted = false;

/**
 * Page transition: a short fade + rise on client navigations. The first load renders straight
 * away (no hidden content before hydration → better LCP). The feather lives in the root layout,
 * so it persists across routes and provides the visual continuity.
 */
export default function Template({ children }: { children: ReactNode }) {
  const [skipIntro] = useState(() => !hasMounted);
  useEffect(() => {
    hasMounted = true;
  }, []);

  return (
    <motion.div
      initial={skipIntro ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
