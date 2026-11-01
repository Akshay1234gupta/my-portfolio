import { getSubscriberStore, StoreNotConfiguredError } from "@/lib/db/subscribers";
import { errorResponse, isSameOrigin, json } from "@/lib/http";
import { verifyEmailToken } from "@/lib/newsletter/token";
import { normalizeEmail } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Accepts:
 *  - the /unsubscribe page confirming (JSON body {email, token})
 *  - one-click unsubscribe from mail clients (RFC 8058): POST to the List-Unsubscribe URL,
 *    which carries ?e=…&t=… in the query string.
 * Every request must carry a valid HMAC token for the email — no token, no unsubscribe.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return errorResponse("Forbidden", 403);

  const url = new URL(req.url);
  let rawEmail: unknown = url.searchParams.get("e");
  let token: unknown = url.searchParams.get("t");

  if (!rawEmail || !token) {
    try {
      const body = (await req.json()) as { email?: unknown; token?: unknown };
      rawEmail = body.email;
      token = body.token;
    } catch {
      return errorResponse("Invalid request.");
    }
  }

  const email = normalizeEmail(rawEmail);
  if (!email || typeof token !== "string" || !verifyEmailToken(email, token)) {
    return errorResponse("This unsubscribe link is invalid or has expired.", 400);
  }

  try {
    await getSubscriberStore().unsubscribe(email);
    return json({ ok: true });
  } catch (err) {
    if (err instanceof StoreNotConfiguredError) return errorResponse("Newsletter storage is not configured.", 503);
    console.error("[newsletter] unsubscribe failed:", err);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}
