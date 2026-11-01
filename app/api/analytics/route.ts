import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getClientIp, isSameOrigin } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * First-party analytics sink (enabled client-side with NEXT_PUBLIC_ANALYTICS=beacon).
 * Validates the event against an allow-list and logs it as structured JSON — forward these logs
 * to your platform's log drain, or replace `console.info` with a write to your own store.
 * No cookies, no IPs, no user identifiers are recorded.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req) || !rateLimit(`an:${getClientIp(req)}`, 120, 60_000).ok) {
    return new Response(null, { status: 204 });
  }
  try {
    const body = (await req.json()) as { event?: string; props?: Record<string, unknown>; path?: string };
    if (!body.event || !(ANALYTICS_EVENTS as readonly string[]).includes(body.event)) {
      return new Response(null, { status: 204 });
    }
    const props: Record<string, string | number | boolean> = {};
    for (const [k, v] of Object.entries(body.props ?? {}).slice(0, 8)) {
      if (typeof v === "string") props[k.slice(0, 32)] = v.slice(0, 80);
      else if (typeof v === "number" || typeof v === "boolean") props[k.slice(0, 32)] = v;
    }
    console.info(JSON.stringify({ type: "analytics", event: body.event, props, path: String(body.path ?? "").slice(0, 120) }));
  } catch {
    /* ignore malformed beacons */
  }
  return new Response(null, { status: 204 });
}
