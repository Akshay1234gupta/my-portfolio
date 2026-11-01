import { timingSafeEqual } from "node:crypto";
import { siteConfig } from "@/data/site";
import { listContactMessages, saveContactMessage, updateContactEmailStatus } from "@/lib/db/contact";
import { emailConfigured, sendEmail } from "@/lib/email";
import { contactEmail } from "@/lib/email/templates";
import { errorResponse, getClientIp, isSameOrigin, json, readJson } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { CONTACT_INTENTS, cleanText, isContactIntent, normalizeEmail } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return errorResponse("Forbidden", 403);

  const limit = rateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return errorResponse("Too many messages — please try again in a few minutes.", 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  const body = await readJson<Record<string, unknown>>(req, 8_000);
  if (!body) return errorResponse("Invalid request.");

  // honeypot
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });

  if (!isContactIntent(body.intent)) return errorResponse("Please choose what this is about.", 422);
  const name = cleanText(body.name, 1, 100);
  const email = normalizeEmail(body.email);
  const message = cleanText(body.message, 10, 4000);
  if (!name) return errorResponse("Please tell me your name.", 422);
  if (!email) return errorResponse("Please enter a valid email address.", 422);
  if (!message) return errorResponse("Your message should be at least 10 characters.", 422);

  const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
  const intentLabel = CONTACT_INTENTS.find((i) => i.id === body.intent)?.label ?? String(body.intent);

  // 1. Save directly into MongoDB so inquiries are never lost
  let savedId: string | null = null;
  try {
    savedId = await saveContactMessage({
      name,
      email,
      intent: intentLabel,
      message,
      ip: getClientIp(req),
      emailSent: false,
    });
  } catch (err) {
    console.error("[contact:db] MongoDB save error:", err);
  }

  // 2. Dispatch email notification to Akshay
  let emailDispatched = false;
  let emailErrMessage: string | undefined;

  if (emailConfigured() || process.env.NODE_ENV !== "production") {
    try {
      await sendEmail(contactEmail(to, { intent: intentLabel, name, email, message }));
      emailDispatched = true;
    } catch (err) {
      emailErrMessage = err instanceof Error ? err.message : String(err);
      console.error("[contact:email] Delivery failed:", emailErrMessage);
    }
  }

  // 3. Update MongoDB record with email dispatch outcome
  if (savedId) {
    await updateContactEmailStatus(savedId, emailDispatched, emailErrMessage);
  }

  // If saved in DB or email sent successfully, return success
  if (savedId || emailDispatched) {
    return json({ ok: true, stored: Boolean(savedId), emailDelivered: emailDispatched });
  }

  return errorResponse("Couldn't process your message. Please try again or email me directly.", 502);
}

function authorised(req: Request): boolean {
  const expected = process.env.NEWSLETTER_ADMIN_TOKEN;
  if (!expected) return false;

  const url = new URL(req.url);
  const queryToken = url.searchParams.get("token") ?? "";
  const header = req.headers.get("authorization") ?? "";
  const bearerToken = header.startsWith("Bearer ") ? header.slice(7) : "";
  const given = queryToken || bearerToken;

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Admin query to view stored contact messages from MongoDB */
export async function GET(req: Request) {
  if (!authorised(req)) return errorResponse("Unauthorized", 401);
  try {
    const messages = await listContactMessages();
    return json({ ok: true, count: messages.length, messages });
  } catch (err) {
    console.error("[contact:get] Error fetching contact messages:", err);
    return errorResponse("Failed to fetch messages from MongoDB", 500);
  }
}
