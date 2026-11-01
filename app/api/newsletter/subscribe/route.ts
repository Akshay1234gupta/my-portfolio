import { timingSafeEqual } from "node:crypto";
import { siteConfig } from "@/data/site";
import { getSubscriberStore, StoreNotConfiguredError } from "@/lib/db/subscribers";
import { emailConfigured, sendEmail } from "@/lib/email";
import { subscriberAlertEmail, welcomeEmail } from "@/lib/email/templates";
import { errorResponse, getClientIp, isSameOrigin, json, readJson } from "@/lib/http";
import { newsletterConfigured, unsubscribeUrl } from "@/lib/newsletter/token";
import { rateLimit } from "@/lib/rate-limit";
import { normalizeEmail } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return errorResponse("Forbidden", 403);

  const limit = rateLimit(`sub:${getClientIp(req)}`, 5, 60 * 60_000);
  if (!limit.ok) {
    return errorResponse("Too many attempts — please try again later.", 429, { "Retry-After": String(limit.retryAfterSeconds) });
  }

  const body = await readJson<{ email?: unknown; source?: unknown; company?: unknown }>(req, 2_000);
  if (!body) return errorResponse("Invalid request.");

  // honeypot: real visitors never see or fill this field. Pretend success so bots learn nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") return json({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return errorResponse("Please enter a valid email address.", 422);
  if (!newsletterConfigured()) return errorResponse("Newsletter is not configured yet.", 503);

  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "site";

  try {
    const result = await getSubscriberStore().subscribe(email, source);
    if (result !== "exists" && emailConfigured()) {
      // 1. Welcome email to subscriber
      try {
        await sendEmail(welcomeEmail(email, unsubscribeUrl(email)));
      } catch (err) {
        console.error("[newsletter] Welcome email dispatch failed:", err);
      }

      // 2. Alert email to Akshay
      const to = process.env.CONTACT_TO_EMAIL || siteConfig.contact.email;
      try {
        await sendEmail(subscriberAlertEmail(to, email, source));
      } catch (err) {
        console.error("[newsletter] Admin subscriber alert failed:", err);
      }
    }
    // identical response for new and existing subscribers → no email enumeration
    return json({ ok: true });
  } catch (err) {
    if (err instanceof StoreNotConfiguredError) return errorResponse("Newsletter storage is not configured yet.", 503);
    console.error("[newsletter] subscribe failed:", err);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
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

/** Admin query to view active subscribers from MongoDB */
export async function GET(req: Request) {
  if (!authorised(req)) return errorResponse("Unauthorized", 401);
  try {
    const store = getSubscriberStore();
    const active = await store.listActive();
    return json({ ok: true, count: active.length, subscribers: active });
  } catch (err) {
    console.error("[newsletter:get] Error listing subscribers:", err);
    return errorResponse("Failed to list subscribers", 500);
  }
}
