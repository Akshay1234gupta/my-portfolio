"use client";

import { useEffect, useRef, useState } from "react";

/** Native share sheet where available (mobile), otherwise copies the link. */
export function ShareButton({ url, title }: { url: string; title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (s: "copied" | "failed") => {
    setState(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2200);
  };

  const share = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as DOMException).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
    } catch {
      flash("failed");
    }
  };

  return (
    <>
      <button type="button" onClick={share} className="btn !px-5 !py-2.5 !text-sm" data-cursor="link">
        {state === "copied" ? "Link copied ✓" : state === "failed" ? "Copy the URL manually" : "Share"} <span aria-hidden>↗</span>
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? "Link copied to clipboard" : ""}
      </span>
    </>
  );
}
