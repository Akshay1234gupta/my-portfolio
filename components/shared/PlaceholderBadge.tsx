import { siteConfig } from "@/data/site";

/** Marks sample content. Hidden when NEXT_PUBLIC_SHOW_PLACEHOLDERS=false. */
export function PlaceholderBadge({ show, label = "Sample" }: { show?: boolean; label?: string }) {
  if (!show || !siteConfig.showPlaceholders) return null;
  return (
    <span className="placeholder-chip" title="Placeholder content — replace it in the /data folder">
      {label}
    </span>
  );
}
