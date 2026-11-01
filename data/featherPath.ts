import type { SectionId } from "@/data/navigation";

/**
 * The feather's journey — authored as data so the choreography can be tuned without touching
 * animation code.
 *
 * x / y are the feather's centre as a fraction of the viewport (0–1).
 * `at` positions a keyframe inside its section (0 = section top, 1 = section bottom). The controller
 * interpolates (eased) between successive keyframes as the viewport centre scrolls past them, and
 * adds a little arc / lift / twist mid-flight so it reads as travelling, not sliding.
 */

export interface FeatherPose {
  x: number;
  y: number;
  /** degrees */
  rotate: number;
  scale: number;
  opacity: number;
  /** glow / iridescence strength */
  intensity: number;
  /** how far the vane is unfurled, 0–1 */
  progress: number;
}

const pose = (
  x: number,
  y: number,
  rotate: number,
  scale: number,
  opacity: number,
  intensity = 1,
  progress = 1,
): FeatherPose => ({ x, y, rotate, scale, opacity, intensity, progress });

export interface FeatherKeyframe {
  section: SectionId;
  at: number;
  desktop: FeatherPose;
  mobile: FeatherPose;
}

export const homeKeyframes: readonly FeatherKeyframe[] = [
  // DISCOVER — hero, big and luminous
  { section: "hero", at: 0.5, desktop: pose(0.73, 0.5, 9, 1, 1, 1.15), mobile: pose(0.64, 0.27, 10, 0.95, 1, 1.1) },

  // WHO IS AKSHAY? — slips to the margin, calmer
  { section: "about", at: 0.5, desktop: pose(0.87, 0.52, 26, 0.62, 0.55, 0.75, 0.85), mobile: pose(0.9, 0.16, 24, 0.55, 0.3, 0.7, 0.85) },

  // HOW DOES HE THINK? — becomes a quill drawing the timeline line, tip down
  { section: "journey", at: 0.08, desktop: pose(0.5, 0.24, 176, 0.36, 0.95, 1, 0.9), mobile: pose(0.09, 0.22, 176, 0.3, 0.7, 1, 0.9) },
  { section: "journey", at: 0.92, desktop: pose(0.5, 0.74, 184, 0.36, 0.95, 1, 0.9), mobile: pose(0.09, 0.72, 184, 0.3, 0.7, 1, 0.9) },

  // WHAT DOES HE KNOW? — a soft backdrop behind the technology universe
  { section: "skills", at: 0.5, desktop: pose(0.5, 0.5, 0, 1.25, 0.2, 0.9, 1), mobile: pose(0.5, 0.35, 0, 0.9, 0.14, 0.8, 1) },

  // WHAT HAS HE BUILT? — hops from edge to edge, staying out of the mockups' way
  { section: "projects", at: 0.1, desktop: pose(0.93, 0.42, -22, 0.5, 0.42, 1, 0.9), mobile: pose(0.9, 0.2, -20, 0.5, 0.25, 0.9, 0.9) },
  { section: "projects", at: 0.4, desktop: pose(0.05, 0.56, 22, 0.5, 0.42, 1, 0.9), mobile: pose(0.08, 0.3, 20, 0.5, 0.25, 0.9, 0.9) },
  { section: "projects", at: 0.68, desktop: pose(0.94, 0.5, -18, 0.5, 0.42, 1, 0.9), mobile: pose(0.9, 0.24, -18, 0.5, 0.25, 0.9, 0.9) },
  { section: "projects", at: 0.92, desktop: pose(0.05, 0.5, 18, 0.5, 0.42, 1, 0.9), mobile: pose(0.08, 0.3, 18, 0.5, 0.25, 0.9, 0.9) },

  // where he has worked
  { section: "experience", at: 0.5, desktop: pose(0.91, 0.5, -12, 0.55, 0.45, 1, 0.9), mobile: pose(0.9, 0.2, -12, 0.5, 0.25, 0.9, 0.9) },
  { section: "behind", at: 0.5, desktop: pose(0.07, 0.46, 14, 0.55, 0.38, 1, 0.9), mobile: pose(0.9, 0.2, 14, 0.5, 0.25, 0.9, 0.9) },

  // AI — the feather picks up a violet glow
  { section: "playground", at: 0.5, desktop: pose(0.82, 0.5, -8, 0.85, 0.7, 1.35, 1), mobile: pose(0.85, 0.16, -8, 0.6, 0.35, 1.3, 1) },

  // WHAT IS HE BUILDING NOW?
  { section: "building", at: 0.5, desktop: pose(0.12, 0.5, 12, 0.6, 0.5, 1, 0.95), mobile: pose(0.88, 0.2, 12, 0.5, 0.28, 0.9, 0.95) },

  // WHAT DOES HE WRITE ABOUT?
  { section: "blog", at: 0.4, desktop: pose(0.92, 0.42, -26, 0.55, 0.45, 1, 0.9), mobile: pose(0.9, 0.18, -24, 0.5, 0.25, 0.9, 0.9) },
  { section: "newsletter", at: 0.5, desktop: pose(0.5, 0.5, 0, 1.15, 0.2, 1, 1), mobile: pose(0.5, 0.4, 0, 0.9, 0.16, 1, 1) },

  // CAN I WORK WITH HIM?
  { section: "contact", at: 0.45, desktop: pose(0.18, 0.52, 14, 0.95, 0.78, 1.25, 1), mobile: pose(0.8, 0.14, 14, 0.6, 0.4, 1.1, 1) },
  { section: "footer", at: 0.2, desktop: pose(0.5, 0.42, 0, 1.3, 0.34, 1.1, 1), mobile: pose(0.5, 0.35, 0, 1, 0.3, 1, 1) },
];

/** Fallback poses for non-home routes, keyed by first path segment ("" = unknown). */
export const routePoses: Record<string, { desktop: FeatherPose; mobile: FeatherPose }> = {
  blog: { desktop: pose(0.92, 0.36, -20, 0.5, 0.3, 1, 0.9), mobile: pose(0.88, 0.14, -20, 0.45, 0.18, 0.9, 0.9) },
  now: { desktop: pose(0.85, 0.42, 14, 0.7, 0.5, 1.1, 1), mobile: pose(0.8, 0.16, 14, 0.5, 0.28, 1, 1) },
  "": { desktop: pose(0.9, 0.4, 10, 0.55, 0.32, 1, 0.9), mobile: pose(0.88, 0.14, 10, 0.45, 0.18, 0.9, 0.9) },
};

export const HERO_POSE = homeKeyframes[0];
