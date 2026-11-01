import { timingSafeEqual } from "node:crypto";
import { absoluteUrl } from "@/data/site";
import { getPost } from "@/lib/blog";
import { getSubscriberStore, StoreNotConfiguredError } from "@/lib/db/subscribers";
import { emailConfigured, sendMany } from "@/lib/email";
import { newPostEmail } from "@/lib/email/templates";
import { errorResponse, json, readJson } from "@/lib/http";
import { unsubscribeUrl } from "@/lib/newsletter/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorised(req: Request): boolean {
  const expected = process.env.NEWSLETTER_ADMIN_TOKEN;
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Announce a published blog post to active subscribers.
 *   curl -X POST $SITE/api/newsletter/notify \
 *        -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN" -H "Content-Type: application/json" \
 *        -d '{"slug":"my-new-post"}'
 * A post is only ever announced once unless `"force": true` is passed.
 */
export async function POST(req: Request) {
  if (!authorised(req)) return errorResponse("Unauthorized", 401);
  if (!emailConfigured()) return errorResponse("Email provider is not configured (RESEND_API_KEY).", 503);

  const body = await readJson<{ slug?: unknown; force?: unknown }>(req, 1_000);
  if (!body || typeof body.slug !== "string") return errorResponse("Provide a post slug.");

  const post = await getPost(body.slug);
  if (!post || post.meta.draft) return errorResponse("Post not found (or still a draft).", 404);

  try {
    const store = getSubscriberStore();
    if (!body.force && (await store.hasNotified(post.meta.slug))) {
      return errorResponse("This post has already been announced. Pass force:true to send again.", 409);
    }
    const recipients = await store.listActive();
    const info = { title: post.meta.title, description: post.meta.description, url: absoluteUrl(`/blog/${post.meta.slug}`) };
    const { sent, failed } = await sendMany(recipients.map((to) => newPostEmail(to, info, unsubscribeUrl(to))));
    if (sent > 0) await store.recordNotified(post.meta.slug, sent);
    return json({ ok: true, recipients: recipients.length, sent, failed });
  } catch (err) {
    if (err instanceof StoreNotConfiguredError) return errorResponse("Newsletter storage is not configured.", 503);
    console.error("[newsletter] notify failed:", err);
    return errorResponse("Failed to send notifications.", 500);
  }
}
