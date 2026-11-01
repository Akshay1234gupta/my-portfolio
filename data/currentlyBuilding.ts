import type { CurrentlyBuildingItem } from "@/lib/types";

/**
 * Projects currently in progress by Akshay Gupta.
 * Reflects ongoing work at Saeculum Solutions (WAWF ecosystem) and portfolio craft.
 */
export const currentlyBuilding: CurrentlyBuildingItem[] = [
  {
    id: "portfolio",
    name: "Interactive Peacock Portfolio",
    description:
      "A scroll-driven portfolio where a procedural SVG peacock feather guides visitors through the engineering story.",
    progress: 95,
    status: "Polishing",
    placeholder: false,
  },
  {
    id: "wawf-admin",
    name: "WAWF Admin Panel",
    description:
      "Enterprise frontend modules featuring internationalization (i18n), reusable Ant Design components, and runtime stability optimizations.",
    progress: 80,
    status: "Active Development",
    placeholder: false,
  },
  {
    id: "wawf-extension",
    name: "WAWF WhatsApp Web Extension",
    description:
      "Browser extension delivering business productivity features and contact management directly within WhatsApp Web.",
    progress: 70,
    status: "Active Development",
    placeholder: false,
  },
];
