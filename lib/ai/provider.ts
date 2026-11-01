import type { KnowledgeChunk } from "./knowledge";

/**
 * LLM abstraction. The chat route depends only on `ChatProvider`; adapters below implement it.
 * Add a new vendor by writing one more adapter and selecting it in `getChatProvider()`.
 * API keys are read from process.env on the server only — never sent to the browser.
 */

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CompletionInput {
  system: string;
  messages: ChatMessage[];
  /** knowledge chunks — used by the mock provider's retrieval, ignored by real LLMs */
  chunks: KnowledgeChunk[];
}

export interface ChatProvider {
  name: string;
  mock: boolean;
  complete(input: CompletionInput): Promise<string>;
}

const TIMEOUT_MS = 25_000;

// ───────────── Anthropic ─────────────

function anthropicProvider(apiKey: string): ChatProvider {
  return {
    name: "anthropic",
    mock: false,
    async complete({ system, messages }) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "claude-haiku-4-5-20251001",
          max_tokens: 600,
          system,
          messages,
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
      return (data.content ?? []).filter((b) => b.type === "text").map((b) => b.text ?? "").join("").trim();
    },
  };
}

// ───────────── OpenAI-compatible (OpenAI, Groq, OpenRouter, Ollama, …) ─────────────

function openAiProvider(apiKey: string): ChatProvider {
  const base = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  return {
    name: "openai-compatible",
    mock: false,
    async complete({ system, messages }) {
      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({
          model: process.env.AI_MODEL || "gpt-4o-mini",
          max_tokens: 600,
          temperature: 0.2,
          messages: [{ role: "system", content: system }, ...messages],
        }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`OpenAI-compatible ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      return (data.choices?.[0]?.message?.content ?? "").trim();
    },
  };
}

// ───────────── Mock (no API key): retrieval over the portfolio data ─────────────

const STOP = new Set(
  "a an and are as at be by can did do does for from has have he her his how i in is it its me my of on or she tell that the their them they this to was what when where which who whom why will with you your about akshay gupta".split(" "),
);

const INTENTS: Array<{ test: RegExp; kinds: KnowledgeChunk["kind"][] }> = [
  { test: /project|built|build|made|portfolio work|case stud/i, kinds: ["project"] },
  { test: /technolog|stack|tool|skill|framework|language|use\b|uses\b/i, kinds: ["skills"] },
  { test: /experience|company|companies|job|role|career|employ|worked|work history/i, kinds: ["experience"] },
  { test: /\bai\b|llm|machine learning|gpt|model/i, kinds: ["project", "skills", "blog"] },
  { test: /blog|write|writing|article|post/i, kinds: ["blog"] },
  { test: /now|currently|working on|building now|right now/i, kinds: ["building", "now"] },
  { test: /contact|hire|available|email|reach|work with/i, kinds: ["contact"] },
  { test: /who|about|background|yourself|introduc/i, kinds: ["profile"] },
  { test: /journey|timeline|year|history/i, kinds: ["journey"] },
];

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function firstSentences(text: string, max = 260): string {
  const clean = text.replace(/\s+/g, " ").replace(/\(placeholder[^)]*\)/g, "").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > 80 ? cut.slice(0, end + 1) : cut.trimEnd() + "…").trim();
}

const mockProvider: ChatProvider = {
  name: "mock",
  mock: true,
  async complete({ messages, chunks }) {
    const question = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const q = tokens(question);
    const wanted = new Set(INTENTS.filter((i) => i.test.test(question)).flatMap((i) => i.kinds));

    const scored = chunks
      .map((c) => {
        const hay = new Set(tokens(`${c.title} ${c.text}`));
        const titleTokens = new Set(tokens(c.title));
        let score = wanted.has(c.kind) ? 3 : 0;
        for (const t of q) {
          if (hay.has(t)) score += 1;
          if (titleTokens.has(t)) score += 2;
        }
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
      return "I can only answer from what's in this portfolio, and I couldn't find anything about that. Try asking about projects, technologies, experience, blog posts or what Akshay is building now — or use the contact form to ask directly.";
    }

    // when the intent is "list of projects/posts", show several; otherwise the best few
    const listy = wanted.has("project") || wanted.has("blog") || wanted.has("experience");
    const top = scored.slice(0, listy ? 4 : 2).map((x) => x.c);
    const lines = top.map((c) => `• ${c.title.replace(/^(Project|Experience|Article): /, "")} — ${firstSentences(c.text)}`);
    return `Here's what the portfolio says:\n\n${lines.join("\n\n")}`;
  },
};

// ───────────── Selection ─────────────

export function getChatProvider(): ChatProvider {
  const wanted = (process.env.AI_PROVIDER || "").toLowerCase();
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (wanted === "mock") return mockProvider;
  if ((wanted === "anthropic" || !wanted) && anthropicKey) return anthropicProvider(anthropicKey);
  if ((wanted === "openai" || !wanted) && openAiKey) return openAiProvider(openAiKey);
  return mockProvider;
}
