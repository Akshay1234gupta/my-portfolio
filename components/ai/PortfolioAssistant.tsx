"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FOCUS_AI_EVENT } from "@/components/navigation/goToSection";
import { track } from "@/lib/analytics";
import { useReducedMotion } from "@/lib/prefs";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  mock?: boolean;
  error?: boolean;
}

const SUGGESTIONS = [
  "What projects has Akshay built?",
  "What technologies does he use?",
  "What has he built with AI?",
  "Tell me about his experience.",
];

const MAX_INPUT = 500;

export function PortfolioAssistant() {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingId, setTypingId] = useState<number | null>(null);
  const [shown, setShown] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const inputId = useId();

  useEffect(() => {
    const focus = () => inputRef.current?.focus({ preventScroll: true });
    window.addEventListener(FOCUS_AI_EVENT, focus);
    return () => window.removeEventListener(FOCUS_AI_EVENT, focus);
  }, []);

  // typewriter for the newest answer
  useEffect(() => {
    if (typingId === null || reduced) return;
    const msg = messages.find((m) => m.id === typingId);
    if (!msg) return;
    let raf = 0;
    let n = 0;
    const step = () => {
      n = Math.min(msg.content.length, n + 4);
      setShown(n);
      if (n < msg.content.length) raf = requestAnimationFrame(step);
      else setTypingId(null);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [typingId, messages, reduced]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, loading, shown, reduced]);

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim().slice(0, MAX_INPUT);
      if (!q || loading) return;
      const userMsg: Message = { id: ++idRef.current, role: "user", content: q };
      const history = [...messages.filter((m) => !m.error), userMsg]
        .slice(-6)
        .map(({ role, content }) => ({ role, content }));
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setLoading(true);
      track("ai_assistant_used");

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });
        const data = (await res.json()) as { ok?: boolean; answer?: string; error?: string; mock?: boolean };
        if (!res.ok || !data.answer) throw new Error(data.error ?? "Something went wrong.");
        const reply: Message = { id: ++idRef.current, role: "assistant", content: data.answer, mock: data.mock };
        setMessages((m) => [...m, reply]);
        setShown(0);
        setTypingId(reply.id);
      } catch (err) {
        const reply: Message = {
          id: ++idRef.current,
          role: "assistant",
          content: err instanceof Error ? err.message : "Something went wrong.",
          error: true,
        };
        setMessages((m) => [...m, reply]);
        setShown(reply.content.length);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  const lastMock = [...messages].reverse().find((m) => m.role === "assistant" && !m.error)?.mock;

  return (
    <section id="playground" data-section="playground" aria-labelledby="playground-title" className="section">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              index="07"
              eyebrow="AI playground"
              lines={[
                <span key="a" id="playground-title">
                  Ask my
                </span>,
                <span key="b" className="serif text-gradient pr-[0.08em]">
                  portfolio.
                </span>,
              ]}
              lead="An assistant that knows only what's on this site — projects, technologies, experience, writing. Ask it anything about my work."
            />
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted">
              It answers strictly from my portfolio content and says so when it doesn&rsquo;t know. Nothing you type is stored.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="panel overflow-hidden">
              <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
                <span aria-hidden className="pulse-dot h-2 w-2 rounded-full bg-emerald" />
                <span className="font-mono text-xs tracking-wide text-fg-soft">ask-my-portfolio</span>
                {lastMock && (
                  <span className="chip ml-auto" title="No LLM API key is configured, so answers are retrieved directly from the portfolio data.">
                    demo mode
                  </span>
                )}
              </div>

              <div
                ref={logRef}
                role="log"
                aria-live="polite"
                aria-label="Conversation"
                data-lenis-prevent
                className="h-[22rem] space-y-5 overflow-y-auto px-5 py-6 sm:h-[26rem]"
              >
                {messages.length === 0 && (
                  <div>
                    <p className="text-sm text-muted">Try one of these:</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {SUGGESTIONS.map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onClick={() => void ask(s)}
                            className="rounded-full border border-line px-4 py-2 text-left text-sm text-fg-soft transition-colors hover:border-cyan hover:text-fg"
                            data-cursor="link"
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {messages.map((m) => {
                  const animating = m.id === typingId && !reduced;
                  const text = animating ? m.content.slice(0, shown) : m.content;
                  return (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <p
                        className={cn(
                          "max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[0.94rem] leading-relaxed",
                          m.role === "user" && "rounded-br-md bg-fg text-bg",
                          m.role === "assistant" && !m.error && "rounded-bl-md border border-line bg-bg-3 text-fg-soft",
                          m.error && "rounded-bl-md border border-red-400/40 bg-red-500/10 text-red-300",
                        )}
                      >
                        <span className="sr-only">{m.role === "user" ? "You: " : "Assistant: "}</span>
                        {text}
                        {animating && <span aria-hidden className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-cyan" />}
                      </p>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex" role="status" aria-label="Assistant is thinking">
                    <span className="flex gap-1.5 rounded-2xl rounded-bl-md border border-line bg-bg-3 px-4 py-3.5" aria-hidden>
                      {[0, 1, 2].map((i) => (
                        <i key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-turquoise" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={onSubmit} className="flex items-stretch gap-3 border-t border-white/10 bg-white/[0.015] p-3.5 sm:p-4">
                <label htmlFor={inputId} className="sr-only">
                  Ask a question about Akshay&rsquo;s portfolio
                </label>

                {/* Animated Aurora Glow Input Wrapper */}
                <div className="ai-input-glow group/input flex-1">
                  <div className="ai-input-inner flex h-full items-center gap-2.5 px-3.5 py-2">
                    {/* Animated AI Star/Sparkle Icon */}
                    <div
                      aria-hidden
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-all duration-300 group-focus-within/input:scale-110 group-focus-within/input:bg-cyan/20 group-focus-within/input:shadow-[0_0_18px_rgba(34,211,238,0.4)]"
                    >
                      <svg className="h-4 w-4 transition-transform duration-500 group-focus-within/input:rotate-45" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                      </svg>
                    </div>

                    <textarea
                      id={inputId}
                      ref={inputRef}
                      value={input}
                      rows={1}
                      maxLength={MAX_INPUT}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void ask(input);
                        }
                      }}
                      placeholder="Ask about projects, tech stack, experience…"
                      className="custom-scrollbar max-h-32 min-h-6 w-full resize-none bg-transparent px-1.5 py-1 text-[0.94rem] leading-relaxed text-fg outline-none placeholder:text-muted/50 focus:outline-none focus:ring-0"
                    />

                    {/* Animated shortcut badge when text is entered */}
                    {input.trim() && (
                      <span className="hidden shrink-0 items-center gap-1 rounded-md border border-cyan/30 bg-cyan/10 px-1.5 py-0.5 text-[0.65rem] font-medium tracking-wide text-cyan sm:inline-flex shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                        ↵ Enter
                      </span>
                    )}
                  </div>
                </div>

                {/* Animated AI Ask Button matching exact height & radius */}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="ai-ask-btn group flex shrink-0 items-center justify-center gap-2.5 px-6 text-[0.94rem] font-semibold"
                  aria-label="Send question"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                      <span className="hidden sm:inline">Thinking…</span>
                    </>
                  ) : (
                    <>
                      <span>Ask</span>
                      <span
                        aria-hidden
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/15 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 13V3M3 8l5-5 5 5" />
                        </svg>
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
