import { createHmac, timingSafeEqual } from "node:crypto";
import { absoluteUrl } from "@/data/site";

/**
 * Stateless unsubscribe tokens: HMAC-SHA256(email) with a server secret. Nothing to store,
 * nothing guessable, and links keep working forever.
 */
function secret(): string {
  const s = process.env.NEWSLETTER_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV !== "production") return "dev-only-newsletter-secret";
  throw new Error("NEWSLETTER_SECRET is not set");
}

export function signEmail(email: string): string {
  return createHmac("sha256", secret()).update(email.toLowerCase()).digest("base64url");
}

export function verifyEmailToken(email: string, token: string): boolean {
  try {
    const expected = Buffer.from(signEmail(email));
    const actual = Buffer.from(token);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function unsubscribeUrl(email: string): string {
  return absoluteUrl(`/unsubscribe?e=${encodeURIComponent(email)}&t=${signEmail(email)}`);
}

export function newsletterConfigured(): boolean {
  return Boolean(process.env.NEWSLETTER_SECRET) || process.env.NODE_ENV !== "production";
}
