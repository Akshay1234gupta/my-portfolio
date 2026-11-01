import type { useRouter } from "next/navigation";
import { scrollToSection } from "@/lib/scroll";

type Router = ReturnType<typeof useRouter>;

/** Scroll to a home-page section, or route home first when on another page. */
export function goToSection(id: string, pathname: string, router: Router) {
  if (pathname === "/") {
    scrollToSection(id);
  } else {
    router.push(id === "hero" ? "/" : `/#${id}`);
  }
}

export const OPEN_PALETTE_EVENT = "portfolio:open-palette";
export const FOCUS_AI_EVENT = "portfolio:focus-ai";
