"use client";

import { useSyncExternalStore } from "react";

/**
 * User preferences (theme, reduced motion) as a tiny external store.
 * - Persisted in localStorage.
 * - Applied to <html> as data-theme / data-motion. An inline script in the root layout applies
 *   them before first paint so there's no flash.
 */

export type Theme = "dark" | "light";

interface Prefs {
  theme: Theme;
  /** null = follow the OS setting */
  motionOverride: boolean | null;
  systemReduced: boolean;
}

const STORAGE_KEY = "portfolio:prefs";
const listeners = new Set<() => void>();

let state: Prefs = { theme: "dark", motionOverride: null, systemReduced: false };
let initialised = false;

function apply() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = state.theme;
  root.dataset.motion = isMotionReduced() ? "reduced" : "full";
}

function emit() {
  apply();
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: state.theme, motionOverride: state.motionOverride }));
  } catch {
    /* storage unavailable — preferences last for the session only */
  }
}

export function initPrefs() {
  if (initialised || typeof window === "undefined") return;
  initialised = true;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let saved: Partial<Prefs> = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    saved = {};
  }
  state = {
    theme: saved.theme === "light" ? "light" : "dark",
    motionOverride: typeof saved.motionOverride === "boolean" ? saved.motionOverride : null,
    systemReduced: mq.matches,
  };
  mq.addEventListener("change", (e) => {
    state = { ...state, systemReduced: e.matches };
    emit();
  });
  emit();
}

export function isMotionReduced(): boolean {
  return state.motionOverride ?? state.systemReduced;
}

export function toggleTheme() {
  state = { ...state, theme: state.theme === "dark" ? "light" : "dark" };
  persist();
  emit();
}

export function toggleReducedMotion() {
  state = { ...state, motionOverride: !isMotionReduced() };
  persist();
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const serverState: Prefs = { theme: "dark", motionOverride: null, systemReduced: false };

export function usePrefs(): Prefs & { reducedMotion: boolean } {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
  return { ...s, reducedMotion: s.motionOverride ?? s.systemReduced };
}

export function useReducedMotion(): boolean {
  return usePrefs().reducedMotion;
}

/** Inline script (string) that applies stored prefs before paint. */
export const prefsBootScript = `(function(){try{var p=JSON.parse(localStorage.getItem('${STORAGE_KEY}')||'{}');var r=document.documentElement;r.dataset.theme=p.theme==='light'?'light':'dark';var m=typeof p.motionOverride==='boolean'?p.motionOverride:window.matchMedia('(prefers-reduced-motion: reduce)').matches;r.dataset.motion=m?'reduced':'full';}catch(e){document.documentElement.dataset.theme='dark';}})();`;
