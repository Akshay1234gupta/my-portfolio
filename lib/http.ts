import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site";

export function json(data: unknown, status = 200, headers?: Record<string, string>) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export function errorResponse(message: string, status = 400, headers?: Record<string, string>) {
  return json({ ok: false, error: message }, status, headers);
}

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Basic CSRF/abuse guard for browser-facing POST routes: if the browser says where the request came
 * from, it must be this site. Non-browser clients (no Origin / Sec-Fetch-Site) are allowed through —
 * they are covered by rate limiting and validation, and can't ride a visitor's cookies anyway.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const site = req.headers.get("sec-fetch-site");
  if (origin) {
    try {
      const o = new URL(origin);
      const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
      return o.host === host || o.host === new URL(siteConfig.url).host;
    } catch {
      return false;
    }
  }
  if (site) return site === "same-origin" || site === "none";
  return true;
}

export async function readJson<T>(req: Request, maxBytes = 8_000): Promise<T | null> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) return null;
  const raw = await req.text();
  if (raw.length > maxBytes) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
