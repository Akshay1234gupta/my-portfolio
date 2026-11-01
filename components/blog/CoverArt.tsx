import Image from "next/image";
import { cn } from "@/lib/utils";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const PALETTES = [
  ["#0e7490", "#10b981", "#1e3a8a"],
  ["#4c1d95", "#22d3ee", "#0f766e"],
  ["#1d4ed8", "#2dd4bf", "#5b21b6"],
  ["#065f46", "#38bdf8", "#7c3aed"],
] as const;

/**
 * Cover image: uses `cover` when set, otherwise generates deterministic feather-eye art from the slug
 * so every article has a unique, on-brand cover without image files.
 */
export function CoverArt({
  slug,
  cover,
  title,
  className,
  priority = false,
}: {
  slug: string;
  cover?: string;
  title: string;
  className?: string;
  priority?: boolean;
}) {
  if (cover) {
    return (
      <div className={cn("relative overflow-hidden bg-bg-2", className)}>
        <Image
          src={cover}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
      </div>
    );
  }

  const h = hash(slug);
  const [a, b, c] = PALETTES[h % PALETTES.length];
  const cx = 30 + (h % 40);
  const cy = 35 + ((h >> 3) % 30);
  const rot = (h % 50) - 25;

  return (
    <div className={cn("relative overflow-hidden bg-bg-2", className)} role="img" aria-label={`Generated cover art for ${title}`}>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 90% at ${cx}% ${cy}%, ${a}66, transparent 70%), radial-gradient(60% 80% at ${100 - cx}% ${100 - cy}%, ${c}77, transparent 70%)`,
        }}
      />
      <svg aria-hidden viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <g transform={`rotate(${rot} ${cx * 4} ${cy * 2.5})`} fill="none">
          {Array.from({ length: 34 }, (_, i) => {
            const t = (i / 33) * Math.PI;
            const x1 = cx * 4;
            const y1 = cy * 2.5;
            const x2 = x1 + Math.cos(t - Math.PI / 2) * 240;
            const y2 = y1 + Math.sin(t - Math.PI / 2) * 240;
            return <path key={i} d={`M${x1} ${y1}Q${(x1 + x2) / 2 + 26} ${(y1 + y2) / 2} ${x2} ${y2}`} stroke={i % 3 ? b : a} strokeOpacity="0.28" strokeWidth="0.8" />;
          })}
          <ellipse cx={cx * 4} cy={cy * 2.5} rx="46" ry="60" fill={`${a}55`} stroke={b} strokeOpacity="0.5" />
          <ellipse cx={cx * 4} cy={cy * 2.5} rx="32" ry="44" fill={`${c}aa`} stroke={b} strokeOpacity="0.5" />
          <ellipse cx={cx * 4} cy={cy * 2.5} rx="16" ry="24" fill="#0b1a63" stroke="#67e8f9" strokeOpacity="0.6" />
        </g>
      </svg>
    </div>
  );
}
