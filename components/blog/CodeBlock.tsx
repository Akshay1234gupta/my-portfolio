"use client";

import { useEffect, useRef, useState } from "react";

/** Highlighted code (HTML produced on the server by sugar-high) with a copy button. */
export function CodeBlock({ html, raw, lang }: { html: string; raw: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable (insecure context) — nothing to do */
    }
  };

  return (
    <div className="code-block group">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted">{lang ?? "code"}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded-full border border-line px-3 py-1 font-mono text-[0.68rem] text-fg-soft transition-colors hover:border-cyan hover:text-fg"
          aria-label={copied ? "Code copied" : "Copy code to clipboard"}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre tabIndex={0} aria-label={`${lang ?? "Code"} snippet`}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <span role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}
