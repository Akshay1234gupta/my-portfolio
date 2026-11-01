const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Returns the normalised email, or null when invalid. Shared by client forms and API routes. */
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  return EMAIL_RE.test(email) ? email : null;
}

export function cleanText(value: unknown, min: number, max: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/\r\n/g, "\n").trim();
  return text.length >= min && text.length <= max ? text : null;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const CONTACT_INTENTS = [
  { id: "hire", label: "I'm looking for a developer" },
  { id: "project", label: "I have a project idea" },
  { id: "collab", label: "I want to collaborate" },
  { id: "hello", label: "I just want to say hello" },
] as const;

export type ContactIntent = (typeof CONTACT_INTENTS)[number]["id"];

export function isContactIntent(value: unknown): value is ContactIntent {
  return CONTACT_INTENTS.some((i) => i.id === value);
}
