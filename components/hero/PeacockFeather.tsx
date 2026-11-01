import { useId, type CSSProperties, type Ref } from "react";
import { EYE, FEATHER_VIEWBOX, getFeatherGeometry } from "@/lib/feather";
import { cn } from "@/lib/utils";

export interface PeacockFeatherProps {
  /** 0 → closed/narrow, 1 → fully unfurled vane */
  progress?: number;
  /** degrees */
  rotation?: number;
  scale?: number;
  /** translation as a percentage of the feather's own size */
  position?: { x: number; y: number };
  /** 0 → dim, 1 → normal, >1 → glowing (peacock mode) */
  intensity?: number;
  /** tints the feather subtly per story section */
  activeSection?: string;
  /** decorative feathers are hidden from assistive tech */
  decorative?: boolean;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Authentic Photorealistic Mor Pankh (Indian Peacock Feather) Component.
 *
 * Faithfully replicates real Pavo cristatus plumage:
 *  - Majestic sweeping crown fan with organic cubic S-droop barbs.
 *  - Iconic 6-zone biological ocellus (eyespot) with:
 *     - Velvet midnight-indigo indented heart pupil with structural sapphire sheen arc
 *     - Radiant electric turquoise halo
 *     - Metallic golden-amber band with 84 micro-barbule striations
 *     - Seamless radiating golden-bronze fringe feathering into the vane
 *  - Natural horn-to-ivory 3D rachis (quill).
 *  - Dynamic SVG airflow turbulence displacement for wind flutter during scroll.
 */
export function PeacockFeather({
  progress = 1,
  rotation = 0,
  scale = 1,
  position,
  intensity = 1,
  activeSection,
  decorative = true,
  className,
  ref,
}: PeacockFeatherProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const geo = getFeatherGeometry();
  const style = {
    "--progress": progress,
    "--intensity": intensity,
    transform: `translate(${position?.x ?? 0}%, ${position?.y ?? 0}%) rotate(${rotation}deg) scale(${scale})`,
  } as CSSProperties;

  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": "Illustration of an authentic peacock feather (Mor Pankh)" } as const);
  const svgBase = {
    viewBox: `0 0 ${FEATHER_VIEWBOX.w} ${FEATHER_VIEWBOX.h}`,
    preserveAspectRatio: "xMidYMid meet",
    focusable: false as const,
  };

  return (
    <div ref={ref} className={cn("feather", className)} style={style} data-section={activeSection} {...a11y}>
      <div className="feather__glow" />

      {/* BACK LAYER — soft background barbs, downy wisps, and crown backdrop */}
      <svg {...svgBase} className="feather__layer feather__layer--back" aria-hidden>
        <defs>
          <filter id={`${uid}-wind-b`} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.013 0.025" numOctaves="2" seed="17" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <radialGradient id={`${uid}-b`} gradientUnits="userSpaceOnUse" cx={EYE.cx} cy={EYE.cy} r="350">
            <stop offset="0%" style={{ stopColor: "var(--f-core)" }} />
            <stop offset="25%" style={{ stopColor: "var(--f-teal)" }} />
            <stop offset="55%" style={{ stopColor: "var(--f-emerald)" }} />
            <stop offset="80%" style={{ stopColor: "var(--f-gold)" }} />
            <stop offset="100%" style={{ stopColor: "var(--f-bronze)" }} />
          </radialGradient>
          <linearGradient id={`${uid}-bw`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#78350f" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#0f766e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.38" />
          </linearGradient>
        </defs>
        <g className="feather__vane">
          <g filter={`url(#${uid}-wind-b)`}>
            <path d={geo.back} fill="none" stroke={`url(#${uid}-b)`} strokeWidth="1.2" strokeLinecap="round" opacity="0.46" />
            <path d={geo.wisps} fill="none" stroke={`url(#${uid}-bw)`} strokeWidth="0.88" strokeLinecap="round" />
            <path d={geo.crown} fill="none" stroke={`url(#${uid}-b)`} strokeWidth="0.95" strokeLinecap="round" opacity="0.4" />
          </g>
        </g>
      </svg>

      {/* MAIN LAYER — structured barbs, quill spine, and realistic 6-zone ocellus */}
      <svg {...svgBase} className="feather__layer feather__layer--main" aria-hidden>
        <defs>
          {/* Airflow turbulence displacement for main plumage barbs */}
          <filter id={`${uid}-wind-m`} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.024" numOctaves="2" seed="29" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Main barb gradient with authentic iridescent peacock color flow */}
          <radialGradient id={`${uid}-m`} gradientUnits="userSpaceOnUse" cx={EYE.cx} cy={EYE.cy} r="330">
            <stop offset="0%" style={{ stopColor: "var(--f-teal)" }} />
            <stop offset="26%" style={{ stopColor: "var(--f-emerald)" }} />
            <stop offset="64%" style={{ stopColor: "var(--f-gold)" }} />
            <stop offset="86%" style={{ stopColor: "var(--f-bronze)" }} />
            <stop offset="100%" stopColor="#451a03" />
          </radialGradient>

          {/* Horn & Ivory Rachis (Quill) Gradient */}
          <linearGradient id={`${uid}-q-base`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#3b1d07" />
            <stop offset="28%" stopColor="#78350f" />
            <stop offset="58%" stopColor="#b45309" />
            <stop offset="82%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#2dd4bf" />
          </linearGradient>

          {/* Rachis illuminated 3D ivory ridge */}
          <linearGradient id={`${uid}-q-highlight`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.82" />
            <stop offset="48%" stopColor="#fffbeb" stopOpacity="0.92" />
            <stop offset="82%" stopColor="#ccfbf1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.75" />
          </linearGradient>

          {/* Ocellus Zone 1: Outer bronze-to-emerald transition zone */}
          <radialGradient id={`${uid}-e-outer`} cx="0.5" cy="0.45" r="0.65">
            <stop offset="0%" stopColor="#b45309" stopOpacity="0.9" />
            <stop offset="42%" stopColor="#713f12" />
            <stop offset="70%" stopColor="#365314" />
            <stop offset="90%" stopColor="#14532d" />
            <stop offset="100%" stopColor="#052e16" stopOpacity="0.85" />
          </radialGradient>

          {/* Ocellus Zone 2: Shimmering Metallic Amber-Gold Band */}
          <radialGradient id={`${uid}-e-gold`} cx="0.5" cy="0.42" r="0.62">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="24%" stopColor="#f59e0b" />
            <stop offset="68%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          {/* Ocellus Zone 3: Luminous Electric Turquoise Halo */}
          <radialGradient id={`${uid}-e-turquoise`} cx="0.5" cy="0.40" r="0.60">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="28%" stopColor="#22d3ee" />
            <stop offset="66%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#042f2e" />
          </radialGradient>

          {/* Ocellus Zone 4: Royal Sapphire Blue Ring */}
          <radialGradient id={`${uid}-e-blue`} cx="0.5" cy="0.38" r="0.64">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="32%" stopColor="#3b82f6" />
            <stop offset="72%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>

          {/* Ocellus Zone 5: Authentic Midnight Velvet Pupil Core */}
          <radialGradient id={`${uid}-e-core`} cx="0.5" cy="0.30" r="0.68">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="18%" stopColor="#4f46e5" />
            <stop offset="52%" stopColor="#312e81" />
            <stop offset="82%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#070414" />
          </radialGradient>

          {/* Iridescent Sapphire Structural Keratin Sheen Arc */}
          <linearGradient id={`${uid}-e-sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.5" />
          </linearGradient>

          {/* Ocellus Natural Soft Drop Shadow */}
          <filter id={`${uid}-eye-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3.2" stdDeviation="3.5" floodColor="#020617" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Vane plumage barbs with wind flutter displacement */}
        <g className="feather__vane">
          <g filter={`url(#${uid}-wind-m)`}>
            <path d={geo.main} fill="none" stroke={`url(#${uid}-m)`} strokeWidth="0.94" strokeLinecap="round" opacity="0.92" />
            <path d={geo.crown} fill="none" stroke={`url(#${uid}-m)`} strokeWidth="0.88" strokeLinecap="round" opacity="0.86" />
          </g>
          {/* Base rachis spine */}
          <path d={geo.rachis} fill="none" stroke={`url(#${uid}-q-base)`} strokeWidth="3.0" strokeLinecap="round" />
          {/* Illuminated ivory spine ridge */}
          <path d={geo.rachisHighlight} fill="none" stroke={`url(#${uid}-q-highlight)`} strokeWidth="1.15" strokeLinecap="round" opacity="0.86" />
        </g>

        {/* Authentic Photorealistic Peacock Ocellus (Eyespot) */}
        <g className="feather__eye" filter={`url(#${uid}-eye-shadow)`}>
          {/* Radiating golden-bronze barbule fringe feathering seamlessly into the vane */}
          <path d={geo.eye.fringe} fill="none" stroke="#facc15" strokeWidth="0.55" strokeLinecap="round" opacity="0.46" />

          {/* Zone 1: Outer bronze-emerald aura */}
          <path d={geo.eye.outer} fill={`url(#${uid}-e-outer)`} opacity="0.95" />

          {/* Zone 2: Shimmering Metallic Amber-Gold Band */}
          <path d={geo.eye.gold} fill={`url(#${uid}-e-gold)`} />

          {/* Micro-barbule striations inside the golden ring (natural brushed-metal texture) */}
          <path d={geo.eye.striations} fill="none" stroke="#fef08a" strokeWidth="0.45" strokeLinecap="round" opacity="0.42" />

          {/* Zone 3: Luminous Electric Turquoise Halo */}
          <path d={geo.eye.turquoise} fill={`url(#${uid}-e-turquoise)`} />

          {/* Zone 4: Royal Sapphire Blue Ring */}
          <path d={geo.eye.blue} fill={`url(#${uid}-e-blue)`} />

          {/* Zone 5: Biological Inverted Heart Velvet Pupil Core */}
          <path d={geo.eye.core} fill={`url(#${uid}-e-core)`} />

          {/* Iridescent sapphire structural keratin sheen arc across the pupil */}
          <path d={geo.eye.sheen} fill={`url(#${uid}-e-sheen)`} opacity="0.65" style={{ mixBlendMode: "screen" }} />

          {/* Specular Keratin Catchlights (Liquid light reflection on moist surface) */}
          <ellipse
            cx={EYE.cx - 5.5}
            cy={EYE.cy - 13.5}
            rx="6.5"
            ry="11"
            transform={`rotate(-26 ${EYE.cx - 5.5} ${EYE.cy - 13.5})`}
            fill="#ffffff"
            opacity="0.32"
          />
          <ellipse
            cx={EYE.cx + 7.5}
            cy={EYE.cy - 6.5}
            rx="2.8"
            ry="5.2"
            transform={`rotate(22 ${EYE.cx + 7.5} ${EYE.cy - 6.5})`}
            fill="#ffffff"
            opacity="0.20"
          />
          <circle cx={EYE.cx - 2.5} cy={EYE.cy - 2.5} r="1.6" fill="#e0f2fe" opacity="0.55" />
        </g>
      </svg>

      {/* FRONT LAYER — delicate iridescent glints responding to parallax & breeze */}
      <svg {...svgBase} className="feather__layer feather__layer--front" aria-hidden>
        <defs>
          <filter id={`${uid}-wind-f`} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.03" numOctaves="2" seed="41" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <linearGradient id={`${uid}-f`} gradientUnits="userSpaceOnUse" x1="150" y1="20" x2="150" y2="480">
            <stop offset="0%" style={{ stopColor: "var(--f-glint-a)" }} />
            <stop offset="50%" style={{ stopColor: "var(--f-glint-b)" }} />
            <stop offset="100%" style={{ stopColor: "var(--f-glint-c)" }} />
          </linearGradient>
        </defs>
        <g className="feather__vane">
          <g filter={`url(#${uid}-wind-f)`}>
            <path d={geo.front} fill="none" stroke={`url(#${uid}-f)`} strokeWidth="0.8" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
