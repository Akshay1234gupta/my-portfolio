"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { CONTACT_INTENTS, cleanText, normalizeEmail, type ContactIntent } from "@/lib/validation";

type Status = "idle" | "sending" | "sent";
type Errors = Partial<Record<"name" | "email" | "message" | "form", string>>;

const PROMPTS: Record<ContactIntent, { title: string; placeholder: string }> = {
  hire: { title: "Great — tell me about the role.", placeholder: "What are you building, and what would the role involve?" },
  project: { title: "Nice. What's the idea?", placeholder: "Describe the idea, who it's for, and where you're at." },
  collab: { title: "Let's make something together.", placeholder: "What do you have in mind? What would you bring?" },
  hello: { title: "Hello back — what's on your mind?", placeholder: "Say anything. I read every message." },
};

const INTENT_ICONS: Record<ContactIntent, React.ReactNode> = {
  hire: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  project: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-turquoise">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  collab: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  hello: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const },
};

export function ContactForm() {
  const [intent, setIntent] = useState<ContactIntent | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!intent) return;
    const fd = new FormData(e.currentTarget);
    const name = cleanText(fd.get("name"), 1, 100);
    const email = normalizeEmail(fd.get("email"));
    const message = cleanText(fd.get("message"), 10, 4000);

    const next: Errors = {};
    if (!name) next.name = "Please tell me your name.";
    if (!email) next.email = "Please enter a valid email address.";
    if (!message) next.message = "A few more words, please (at least 10 characters).";
    setErrors(next);
    if (next.name || next.email || next.message) {
      const first = (["name", "email", "message"] as const).find((k) => next[k]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ intent, name, email, message, website: fd.get("website") ?? "" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      track("contact_submitted", { intent });
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setErrors({ form: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#090b10]/90 p-6 sm:p-10 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-cyan/40 before:to-transparent" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div key="sent" {...slide} className="py-10 text-center">
            <p aria-hidden className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald/50 bg-emerald/10 text-3xl text-emerald shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
              ✓
            </p>
            <h3 className="h-title mt-6">Message received & stored!</h3>
            <p className="mx-auto mt-3 max-w-sm text-muted">Thanks for reaching out, Akshay will get back to you as soon as possible.</p>
          </motion.div>
        ) : !intent ? (
          <motion.div key="intent" {...slide}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
              <p className="eyebrow text-xs tracking-wider uppercase text-cyan">Start a conversation</p>
            </div>
            <h3 id={`${uid}-q`} className="h-title mt-2">
              What brings you here?
            </h3>
            <div role="radiogroup" aria-labelledby={`${uid}-q`} className="mt-7 grid gap-3.5 sm:grid-cols-2">
              {CONTACT_INTENTS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  role="radio"
                  aria-checked={false}
                  onClick={() => setIntent(i.id)}
                  className="group relative flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-left text-[0.98rem] transition-all duration-300 hover:border-cyan/50 hover:bg-white/[0.05] hover:shadow-[0_8px_30px_-5px_rgba(34,211,238,0.22)] hover:-translate-y-0.5"
                  data-cursor="link"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-colors group-hover:border-cyan/30 group-hover:bg-cyan/10">
                      {INTENT_ICONS[i.id]}
                    </span>
                    <span className="font-medium text-fg">{i.label}</span>
                  </div>
                  <span aria-hidden className="text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:text-cyan">
                    →
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" ref={formRef} onSubmit={onSubmit} noValidate {...slide}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="h-title">{PROMPTS[intent].title}</h3>
                <p className="mt-1 text-xs text-muted">Fill in your details below and your message will be delivered immediately.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIntent(null);
                  setErrors({});
                }}
                className="chip transition-all duration-200 hover:border-cyan hover:text-fg hover:shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]"
              >
                ← {CONTACT_INTENTS.find((i) => i.id === intent)?.label}
              </button>
            </div>

            {/* honeypot */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor={`${uid}-name`} className="eyebrow mb-2.5 flex items-center gap-2 text-xs text-fg-soft">
                  <span>Your Name</span>
                  <span className="text-cyan">*</span>
                </label>
                <div className="animated-input-wrap flex items-center px-4 py-1" data-invalid={Boolean(errors.name)}>
                  <span className="flex h-5 w-5 items-center justify-center text-muted/60">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id={`${uid}-name`}
                    name="name"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                    className="h-13 w-full bg-transparent px-3 text-[0.98rem] text-fg outline-none placeholder:text-muted/50 focus:outline-none focus:ring-0"
                    placeholder="Ada Lovelace"
                  />
                </div>
                {errors.name && (
                  <p id={`${uid}-name-err`} role="alert" className="mt-2 text-xs font-medium text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor={`${uid}-email`} className="eyebrow mb-2.5 flex items-center gap-2 text-xs text-fg-soft">
                  <span>Email Address</span>
                  <span className="text-cyan">*</span>
                </label>
                <div className="animated-input-wrap flex items-center px-4 py-1" data-invalid={Boolean(errors.email)}>
                  <span className="flex h-5 w-5 items-center justify-center text-muted/60">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${uid}-email-err` : undefined}
                    className="h-13 w-full bg-transparent px-3 text-[0.98rem] text-fg outline-none placeholder:text-muted/50 focus:outline-none focus:ring-0"
                    placeholder="you@email.com"
                  />
                </div>
                {errors.email && (
                  <p id={`${uid}-email-err`} role="alert" className="mt-2 text-xs font-medium text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={`${uid}-message`} className="eyebrow mb-2.5 flex items-center justify-between text-xs text-fg-soft">
                  <span className="flex items-center gap-2">
                    <span>Message</span>
                    <span className="text-cyan">*</span>
                  </span>
                  <span className="text-[0.7rem] text-muted font-mono">Markdown supported</span>
                </label>
                <div className="animated-input-wrap p-4" data-invalid={Boolean(errors.message)}>
                  <textarea
                    id={`${uid}-message`}
                    name="message"
                    rows={5}
                    maxLength={4000}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${uid}-message-err` : undefined}
                    className="custom-scrollbar w-full resize-y bg-transparent text-[0.98rem] leading-relaxed text-fg outline-none placeholder:text-muted/50 focus:outline-none focus:ring-0"
                    placeholder={PROMPTS[intent].placeholder}
                  />
                </div>
                {errors.message && (
                  <p id={`${uid}-message-err`} role="alert" className="mt-2 text-xs font-medium text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
            </div>

            {errors.form && (
              <p role="alert" className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errors.form}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-xs text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                Data stored securely in MongoDB & forwarded directly.
              </p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn btn-primary shadow-[0_0_25px_-5px_rgba(34,211,238,0.35)] transition-all duration-300 hover:shadow-[0_0_35px_-2px_rgba(34,211,238,0.5)]"
                data-cursor="link"
              >
                {status === "sending" ? "Sending…" : "Send message"} <span aria-hidden>→</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
