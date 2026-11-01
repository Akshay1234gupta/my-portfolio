"use client";

import { motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useFeatherState } from "@/components/animations/featherStore";
import { navItems } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { goToSection, OPEN_PALETTE_EVENT } from "./goToSection";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSection } = useFeatherState();
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(
    () => () => {},
    () => /Mac|iPhone|iPad/.test(navigator.platform),
    () => false,
  );
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const onNav = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    goToSection(id, pathname, router);
  };

  const isActive = (id: string) => pathname === "/" && activeSection === id;
  const blogActive = pathname.startsWith("/blog");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg via-bg/70 to-transparent" />
        <div className="container-x relative flex h-16 items-center justify-between md:h-20">
          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            onClick={(e) => pathname === "/" && onNav(e, "hero")}
            className="group flex items-center gap-3"
            data-cursor="link"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line font-mono text-[0.7rem] tracking-widest transition-colors group-hover:border-cyan">
              AG
            </span>
            <span className="hidden text-sm font-medium tracking-tight sm:block">{siteConfig.name}</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = item.id === "blog" ? isActive("blog") || blogActive : isActive(item.id);
              return (
                <a
                  key={item.id}
                  href={item.id === "hero" ? "/" : `/#${item.id}`}
                  onClick={(e) => onNav(e, item.id)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-[0.85rem] transition-colors",
                    active ? "text-fg" : "text-muted hover:text-fg",
                  )}
                  data-cursor="link"
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gradient-to-r from-cyan via-emerald to-purple"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted/80 backdrop-blur-md transition-all duration-200 hover:border-cyan/40 hover:bg-white/[0.06] hover:text-fg hover:shadow-[0_0_20px_-3px_rgba(34,211,238,0.25)] sm:flex"
              aria-label="Open command palette"
              aria-keyshortcuts="Control+K Meta+K"
              data-cursor="link"
            >
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan/80">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="m13 13 4 4" />
              </svg>
              <span>Search</span>
              <span className="kbd !text-[0.62rem] !px-1.5">{isMac ? "⌘" : "Ctrl"}</span>
              <span className="kbd !text-[0.62rem] !px-1.5">K</span>
            </button>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-4">
                <span className={cn("absolute left-0 top-0 h-px w-4 bg-current transition-transform", open && "translate-y-[6px] rotate-45")} />
                <span className={cn("absolute left-0 bottom-0 h-px w-4 bg-current transition-transform", open && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
        <motion.div
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cyan via-emerald to-purple"
        />
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col justify-center bg-bg/97 px-8 md:hidden"
      >
        <nav aria-label="Mobile primary" className="flex flex-col gap-1">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={item.id === "hero" ? "/" : `/#${item.id}`}
              onClick={(e) => onNav(e, item.id)}
              className="flex items-baseline gap-4 border-b border-line py-4 text-4xl font-semibold tracking-tight"
            >
              <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
          <Link href="/now" onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4 text-2xl text-muted">
            <span className="font-mono text-xs">/</span>now
          </Link>
        </nav>
      </div>
    </>
  );
}
