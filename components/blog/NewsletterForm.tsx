"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import { normalizeEmail } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm({ source, className }: { source: string; className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const inputId = useId();
  const helpId = useId();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const clean = normalizeEmail(email);
    if (!clean) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: clean, source, company: form.get("company") ?? "" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("success");
      setMessage("You're in! Check your inbox for a welcome note.");
      setEmail("");
      track("newsletter_subscribed", { source });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className={cn("w-full max-w-xl", className)}>
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div
        className="animated-input-wrap relative flex flex-col gap-2 p-1.5 sm:flex-row sm:items-center !rounded-2xl sm:!rounded-full border border-white/12 bg-[#090b10]/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 focus-within:!border-cyan/60 focus-within:shadow-[0_0_35px_-5px_rgba(34,211,238,0.32)]"
        data-invalid={status === "error"}
      >
        <div className="flex flex-1 items-center gap-3 px-4 py-2 sm:py-0">
          <span className="flex h-5 w-5 items-center justify-center text-cyan">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <input
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email address…"
            aria-invalid={status === "error"}
            aria-describedby={helpId}
            disabled={status === "loading"}
            className="h-12 w-full bg-transparent text-[0.98rem] text-fg outline-none placeholder:text-muted/50 focus:outline-none focus:ring-0"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn btn-primary h-12 !rounded-xl sm:!rounded-full px-7 shadow-md transition-all duration-200 hover:shadow-[0_0_25px_-3px_rgba(34,211,238,0.45)] sm:min-w-36"
          data-cursor="link"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              Joining…
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              Subscribe <span aria-hidden>→</span>
            </span>
          )}
        </button>
      </div>

      <p
        id={helpId}
        role={status === "error" ? "alert" : "status"}
        className={cn(
          "mt-3.5 flex items-center gap-2 px-3 text-xs min-h-5 transition-colors",
          status === "error" && "text-red-400 font-medium",
          status === "success" && "text-emerald font-medium",
          (status === "idle" || status === "loading") && "text-muted",
        )}
      >
        {status === "success" && <span className="h-1.5 w-1.5 rounded-full bg-emerald" />}
        {message || "No spam. Only updates when a major article or experiment goes live."}
      </p>
    </form>
  );
}
