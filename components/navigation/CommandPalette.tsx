"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/data/site";
import { track } from "@/lib/analytics";
import { toggleReducedMotion, toggleTheme, usePrefs } from "@/lib/prefs";
import { getLenis } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { FOCUS_AI_EVENT, goToSection, OPEN_PALETTE_EVENT } from "./goToSection";

interface Command {
  id: string;
  group: "Navigate" | "Actions";
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
}

const GROUPS: Array<Command["group"]> = ["Navigate", "Actions"];

/** Cmd/Ctrl + K palette: navigate, ask the AI, toggle theme / reduced motion. */
export default function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const prefs = usePrefs();
  const [open, setOpen] = useState(false);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => goToSection(id, pathname, router);
    return [
      { id: "home", group: "Navigate", label: "Home", run: go("hero") },
      { id: "about", group: "Navigate", label: "About", keywords: "who bio", run: go("about") },
      { id: "journey", group: "Navigate", label: "Journey", keywords: "timeline", run: go("journey") },
      { id: "skills", group: "Navigate", label: "Skills", keywords: "technologies stack", run: go("skills") },
      { id: "projects", group: "Navigate", label: "Projects", keywords: "work case studies", run: go("projects") },
      { id: "experience", group: "Navigate", label: "Experience", keywords: "jobs companies", run: go("experience") },
      { id: "blog", group: "Navigate", label: "Blog", keywords: "articles writing", run: () => router.push("/blog") },
      { id: "now", group: "Navigate", label: "Now", keywords: "currently", run: () => router.push("/now") },
      { id: "contact", group: "Navigate", label: "Contact", keywords: "hire email", run: go("contact") },
      {
        id: "ask-ai",
        group: "Actions",
        label: "Ask AI",
        hint: "Ask my portfolio",
        keywords: "assistant chat question",
        run: () => {
          goToSection("playground", pathname, router);
          window.setTimeout(() => window.dispatchEvent(new Event(FOCUS_AI_EVENT)), pathname === "/" ? 1300 : 1800);
        },
      },
      {
        id: "theme",
        group: "Actions",
        label: "Toggle theme",
        hint: prefs.theme === "dark" ? "Dark → Light" : "Light → Dark",
        keywords: "dark light mode",
        run: toggleTheme,
      },
      {
        id: "motion",
        group: "Actions",
        label: "Toggle reduced motion",
        hint: prefs.reducedMotion ? "Reduced → Full" : "Full → Reduced",
        keywords: "animation accessibility",
        run: toggleReducedMotion,
      },
      {
        id: "resume",
        group: "Actions",
        label: "View resume",
        keywords: "cv",
        run: () => {
          track("resume_clicked", { source: "palette" });
          window.open(siteConfig.links.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "subscribe",
        group: "Actions",
        label: "Subscribe to the newsletter",
        keywords: "email updates",
        run: () => goToSection("newsletter", pathname, router),
      },
    ];
  }, [pathname, router, prefs.theme, prefs.reducedMotion]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && <PaletteDialog commands={commands} onClose={() => setOpen(false)} />}
    </AnimatePresence>
  );
}

function PaletteDialog({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  // Mounted only while open, so query / selection start fresh every time.
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const listId = `${uid}-list`;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords ?? ""} ${c.group}`.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    track("command_palette_opened");
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    document.getElementById(`${uid}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, uid]);

  const run = (c: Command) => {
    onClose();
    window.setTimeout(c.run, 60); // let the dialog unmount + scroll lock release first
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) run(results[active]);
    } else if (e.key === "Tab") {
      e.preventDefault(); // focus stays in the input; the list follows aria-activedescendant
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/75 backdrop-blur-md px-4 pt-[10vh] sm:pt-[13vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/12 bg-[#090b10]/95 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(34,211,238,0.22)] ring-1 ring-white/5 backdrop-blur-2xl before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan/50 before:to-transparent"
        initial={{ opacity: 0, y: -16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onKeyDown={onKeyDown}
      >
        {/* Search Input Bar with animated glow */}
        <div className="group relative flex items-center gap-3.5 border-b border-white/10 px-5 py-1.5 transition-colors focus-within:border-cyan/40">
          <span aria-hidden className="flex h-5 w-5 items-center justify-center text-cyan transition-transform duration-200 group-focus-within:scale-110">
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${uid}-opt-${active}` : undefined}
            aria-label="Type a command or search"
            placeholder="Type a command or search…"
            autoComplete="off"
            spellCheck={false}
            className="h-14 w-full bg-transparent text-[0.98rem] text-fg outline-none placeholder:text-muted/60 focus:outline-none focus-visible:outline-none focus:ring-0"
          />
          <span className="kbd !text-[0.65rem] !px-2 !h-6 shadow-sm">ESC</span>
        </div>

        {/* Command List with custom thin scrollbar */}
        <div id={listId} role="listbox" aria-label="Commands" data-lenis-prevent className="custom-scrollbar max-h-[50vh] overflow-y-auto p-3 space-y-1">
          {results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted">No matching commands found.</p>
              <p className="mt-1 text-xs text-muted/60">Try searching for &quot;Projects&quot;, &quot;Experience&quot;, or &quot;Resume&quot;.</p>
            </div>
          )}
          {GROUPS.map((g) => {
            const items = results.filter((c) => c.group === g);
            if (!items.length) return null;
            return (
              <div key={g} role="group" aria-label={g} className="pb-1.5">
                <p className="eyebrow px-3 pb-1.5 pt-2 text-[0.62rem] font-semibold tracking-widest text-muted/70 uppercase" aria-hidden>
                  {g}
                </p>
                {items.map((c) => {
                  const idx = results.indexOf(c);
                  const selected = idx === active;
                  return (
                    <div
                      key={c.id}
                      id={`${uid}-opt-${idx}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(idx)}
                      onClick={() => run(c)}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150",
                        selected
                          ? "bg-gradient-to-r from-cyan/15 via-cyan/8 to-transparent border border-cyan/30 text-fg shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
                          : "text-fg-soft hover:bg-white/[0.04] border border-transparent",
                      )}
                    >
                      <span aria-hidden className={cn("font-mono text-sm transition-all duration-150", selected ? "text-cyan translate-x-0.5" : "text-muted/60")}>
                        →
                      </span>
                      <span className="flex-1 font-medium">{c.label}</span>
                      {c.hint && (
                        <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[0.72rem] text-muted">
                          {c.hint}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer with keycap shortcuts */}
        <div className="flex items-center gap-4 border-t border-white/8 bg-white/[0.015] px-5 py-3 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="kbd !text-[0.62rem]">↑</span>
            <span className="kbd !text-[0.62rem]">↓</span> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="kbd !text-[0.62rem]">↵</span> select
          </span>
          <span className="ml-auto flex items-center gap-2 text-fg-soft/80 font-mono text-[0.75rem]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
            {siteConfig.name}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
