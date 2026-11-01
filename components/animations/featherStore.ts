"use client";

import { useSyncExternalStore } from "react";

/**
 * Central state for the feather. Sections never move the feather themselves — they only
 * expose `data-section` markers; FeatherStage reads scroll and writes the pose.
 *
 * `pointer` is a mutable, non-reactive value (updated at pointer-event rate), while
 * `activeSection` and `peacock` are reactive via useFeatherState().
 */

export interface FeatherState {
  activeSection: string;
  peacock: boolean;
}

let state: FeatherState = { activeSection: "hero", peacock: false };
const listeners = new Set<() => void>();

/** Normalised pointer position, -1 … 1 from the viewport centre. */
export const pointer = { x: 0, y: 0 };

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeFeather(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getFeatherState() {
  return state;
}

export function setActiveSection(id: string) {
  if (state.activeSection === id) return;
  state = { ...state, activeSection: id };
  emit();
}

let peacockTimer: ReturnType<typeof setTimeout> | undefined;

export function setPeacock(on: boolean, autoOffMs = 12000) {
  clearTimeout(peacockTimer);
  if (state.peacock !== on) {
    state = { ...state, peacock: on };
    if (typeof document !== "undefined") document.documentElement.dataset.peacock = String(on);
    emit();
  }
  if (on) peacockTimer = setTimeout(() => setPeacock(false), autoOffMs);
}

// ── Easter egg: click the feather five times (within ~2s of each other) → Peacock Mode ──
let clickCount = 0;
let clickTimer: ReturnType<typeof setTimeout> | undefined;

export function registerFeatherClick() {
  clickCount += 1;
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => (clickCount = 0), 2000);
  if (clickCount >= 5) {
    clickCount = 0;
    setPeacock(!state.peacock);
  }
}

export function useFeatherState(): FeatherState {
  return useSyncExternalStore(subscribeFeather, getFeatherState, getFeatherState);
}
