/**
 * Procedural Mor Pankh (Peacock Feather) Geometry.
 *
 * Generates mathematically authentic, biological SVG path data for a photorealistic
 * Indian Peacock feather (Pavo cristatus), matching natural plumage:
 *  - Organic curved rachis (quill) with natural base-to-tip horn & ivory spine.
 *  - Multi-tiered barb vane with biological cubic S-droop, majestic crown fan arch,
 *    and soft downy aftershaft wisps.
 *  - Iconic 6-zone ocellus (eyespot) with:
 *     - Velvet midnight-indigo indented heart/kidney pupil
 *     - Iridescent structural sapphire keratin sheen arc
 *     - Luminous electric turquoise halo with soft color gradation
 *     - Shimmering metallic amber-gold band with 84 fine radial micro-barbule striations
 *     - Outer bronze-emerald radiating fringe that blends seamlessly into the vane
 *
 * Seeded PRNG ensures identical server & client hydration.
 */

export const FEATHER_VIEWBOX = { w: 300, h: 700 } as const;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v: number) => String(Number(v.toFixed(1)));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};

// Rachis cubic Bézier: base → tip, natural organic spine curve
const P0 = [150, 700] as const;
const P1 = [174, 520] as const;
const P2 = [126, 300] as const;
const P3 = [151, 16] as const;

export function rachisAt(t: number): { x: number; y: number } {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: b0 * P0[0] + b1 * P1[0] + b2 * P2[0] + b3 * P3[0],
    y: b0 * P0[1] + b1 * P1[1] + b2 * P2[1] + b3 * P3[1],
  };
}

export function tAtY(y: number): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (rachisAt(mid).y > y) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Majestic vane dimensions matching authentic full-length peacock plumage
const VANE = { cy: 220, ry: 218, rx: 136 } as const;
const eyeAnchor = rachisAt(tAtY(VANE.cy));
export const EYE = { cx: Number(eyeAnchor.x.toFixed(1)), cy: VANE.cy } as const;

interface BarbLayerOptions {
  seed: number;
  step: number;
  offset: number;
  lengthScale: number;
  wispOnly?: boolean;
  crownOnly?: boolean;
}

function buildBarbs({ seed, step, offset, lengthScale, wispOnly, crownOnly }: BarbLayerOptions): string {
  const rand = mulberry32(seed);
  const segs: string[] = [];

  for (let y = 22 + offset; y < 695; y += step) {
    if (crownOnly && y > VANE.cy) break;
    const { x } = rachisAt(tAtY(y));
    const inVane = Math.abs(y - VANE.cy) < VANE.ry;
    const normDist = (y - VANE.cy) / VANE.ry;

    // Crown barbs above the eye (y < VANE.cy) fan outward with a majestic arching crown
    const isCrown = y < VANE.cy;
    const crownMultiplier = isCrown ? 1.12 + 0.22 * (1 - y / VANE.cy) : 1.0;
    const vaneLen = inVane ? VANE.rx * Math.pow(Math.max(0, 1 - normDist * normDist), 0.42) * crownMultiplier : 0;

    // Lower fluffy downy aftershaft (wisps)
    const skirtBump = Math.sin(Math.PI * clamp01((y - 290) / 400));
    const wisp = y > 280 ? (22 + 58 * Math.pow(skirtBump, 0.82)) * (0.55 + rand() * 1.1) : 0;
    const fade = smooth((y - 300) / 100);
    const baseLen = wispOnly ? wisp : Math.max(vaneLen * (0.94 + rand() * 0.12), wisp * fade);
    const len = baseLen * lengthScale;
    if (len < 2.5) continue;

    // Upward angle towards the tip, natural droop towards the base
    const up = isCrown ? smooth((VANE.cy - y) / VANE.ry) : 0;
    const inWisp = wisp > vaneLen;
    const angle = inWisp ? 0.10 + rand() * 0.44 : 0.28 + 0.98 * up + rand() * 0.08;

    for (const side of [-1, 1] as const) {
      const jitter = 0.93 + rand() * 0.16;
      const l = len * jitter;
      const dx = side * l * Math.cos(angle);
      const dy = -l * Math.sin(angle);

      // Biological cubic S-droop: outward arch, natural gravity sag, and delicate upward tip curl
      const droop = l * (inWisp ? 0.24 : isCrown ? 0.07 : 0.11);
      const cp1x = x + dx * 0.30;
      const cp1y = y + dy * 0.16 - (inWisp ? 0 : l * 0.05);
      const cp2x = x + dx * 0.70;
      const cp2y = y + dy * 0.64 + droop;
      const endX = x + dx;
      const endY = y + dy + droop * 0.38;

      segs.push(`M${n(x)} ${n(y)}C${n(cp1x)} ${n(cp1y)} ${n(cp2x)} ${n(cp2y)} ${n(endX)} ${n(endY)}`);
    }
  }
  return segs.join("");
}

function buildRachis(): string {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const { x, y } = rachisAt(i / 60);
    pts.push(`${i === 0 ? "M" : "L"}${n(x)} ${n(y)}`);
  }
  return pts.join("");
}

/** Authentic ovoid path for outer feather eye zones. */
export function eyePath(rx: number, ry: number, lift = 0): string {
  const { cx, cy } = EYE;
  const top = cy - ry - lift;
  const bottom = cy + ry;
  return (
    `M${n(cx)} ${n(top)}` +
    `C${n(cx + rx * 0.62)} ${n(top)} ${n(cx + rx)} ${n(cy - ry * 0.52)} ${n(cx + rx)} ${n(cy + ry * 0.06)}` +
    `C${n(cx + rx)} ${n(cy + ry * 0.72)} ${n(cx + rx * 0.55)} ${n(bottom)} ${n(cx)} ${n(bottom)}` +
    `C${n(cx - rx * 0.55)} ${n(bottom)} ${n(cx - rx)} ${n(cy + ry * 0.72)} ${n(cx - rx)} ${n(cy + ry * 0.06)}` +
    `C${n(cx - rx)} ${n(cy - ry * 0.52)} ${n(cx - rx * 0.62)} ${n(top)} ${n(cx)} ${n(top)}Z`
  );
}

/**
 * Authentic kidney / inverted heart-shaped pupil of the peacock ocellus.
 * This distinct indentation is the biological hallmark of natural Pavo cristatus feathers.
 */
export function eyeHeartPath(rx: number, ry: number, dip = 0.24): string {
  const { cx, cy } = EYE;
  const top = cy - ry;
  const bottom = cy + ry * 0.94;
  const dipY = top + ry * dip;
  return (
    `M${n(cx)} ${n(dipY)}` +
    `C${n(cx + rx * 0.38)} ${n(top)} ${n(cx + rx)} ${n(cy - ry * 0.28)} ${n(cx + rx * 0.94)} ${n(cy + ry * 0.26)}` +
    `C${n(cx + rx * 0.80)} ${n(cy + ry * 0.78)} ${n(cx + rx * 0.38)} ${n(bottom)} ${n(cx)} ${n(bottom)}` +
    `C${n(cx - rx * 0.38)} ${n(bottom)} ${n(cx - rx * 0.80)} ${n(cy + ry * 0.78)} ${n(cx - rx * 0.94)} ${n(cy + ry * 0.26)}` +
    `C${n(cx - rx)} ${n(cy - ry * 0.28)} ${n(cx - rx * 0.38)} ${n(top)} ${n(cx)} ${n(dipY)}Z`
  );
}

/** Iridescent sapphire keratin sheen crescent within the dark velvet pupil */
function buildPupilSheen(): string {
  const { cx, cy } = EYE;
  return (
    `M${n(cx - 14)} ${n(cy - 12)}` +
    `C${n(cx - 6)} ${n(cy - 22)} ${n(cx + 6)} ${n(cy - 22)} ${n(cx + 14)} ${n(cy - 12)}` +
    `C${n(cx + 8)} ${n(cy - 6)} ${n(cx - 8)} ${n(cy - 6)} ${n(cx - 14)} ${n(cy - 12)}Z`
  );
}

/**
 * Radiating golden micro-barbule striations inside the metallic amber ring.
 * Creates the authentic brushed-microfiber texture of natural peacock eyespots.
 */
function buildEyeStriations(): string {
  const segs: string[] = [];
  const { cx, cy } = EYE;
  const count = 84;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r1 = 44 + Math.sin(i * 3.1) * 1.5;
    const r2 = 60 + Math.cos(i * 4.7) * 3.5;
    const x1 = cx + r1 * Math.cos(angle) * 0.95;
    const y1 = cy + r1 * Math.sin(angle) * 1.22;
    const x2 = cx + r2 * Math.cos(angle) * 1.02;
    const y2 = cy + r2 * Math.sin(angle) * 1.28;
    segs.push(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`);
  }
  return segs.join("");
}

/** Radiating golden-bronze barbule fringe crowning the outer eye perimeter */
function buildEyeFringe(): string {
  const segs: string[] = [];
  const { cx, cy } = EYE;
  const count = 96;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const r1 = 64 + Math.sin(i * 3.7) * 2.5;
    const r2 = r1 + 12 + Math.cos(i * 5.3) * 7.5;
    const x1 = cx + r1 * Math.cos(angle) * 1.06;
    const y1 = cy + r1 * Math.sin(angle) * 1.28;
    const x2 = cx + r2 * Math.cos(angle) * 1.12;
    const y2 = cy + r2 * Math.sin(angle) * 1.34;
    segs.push(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`);
  }
  return segs.join("");
}

export interface FeatherGeometry {
  rachis: string;
  rachisHighlight: string;
  back: string;
  main: string;
  front: string;
  wisps: string;
  crown: string;
  eye: {
    outer: string;
    gold: string;
    turquoise: string;
    blue: string;
    core: string;
    sheen: string;
    striations: string;
    fringe: string;
  };
}

let cached: FeatherGeometry | null = null;

export function getFeatherGeometry(): FeatherGeometry {
  if (cached) return cached;
  cached = {
    rachis: buildRachis(),
    rachisHighlight: buildRachis(),
    back: buildBarbs({ seed: 11, step: 4.2, offset: 0, lengthScale: 1.08 }),
    main: buildBarbs({ seed: 23, step: 3.1, offset: 1.5, lengthScale: 1.0 }),
    front: buildBarbs({ seed: 37, step: 6.8, offset: 2.6, lengthScale: 0.78 }),
    wisps: buildBarbs({ seed: 41, step: 5.2, offset: 0.8, lengthScale: 1.25, wispOnly: true }),
    crown: buildBarbs({ seed: 53, step: 3.8, offset: 0.5, lengthScale: 1.18, crownOnly: true }),
    eye: {
      outer: eyePath(68, 86, 3),
      gold: eyePath(58, 74, 2),
      turquoise: eyePath(47, 60),
      blue: eyePath(36, 47),
      core: eyeHeartPath(23, 31, 0.24),
      sheen: buildPupilSheen(),
      striations: buildEyeStriations(),
      fringe: buildEyeFringe(),
    },
  };
  return cached;
}
