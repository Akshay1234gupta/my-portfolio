/**
 * Provider-independent analytics. Components call `track()`; providers decide what happens.
 *
 * - Nothing is sent unless a provider is active. By default: console logging in development, and a
 *   first-party beacon to /api/analytics only when NEXT_PUBLIC_ANALYTICS=beacon.
 * - Respects Do Not Track. No cookies, no fingerprinting, no personal data in event props.
 * - To use Plausible / PostHog / GA, call `registerAnalyticsProvider()` once (e.g. in a client provider).
 */

export const ANALYTICS_EVENTS = [
  "project_clicked",
  "case_study_opened",
  "blog_opened",
  "newsletter_subscribed",
  "contact_submitted",
  "ai_assistant_used",
  "resume_clicked",
  "skill_selected",
  "command_palette_opened",
  "peacock_mode",
] as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[number];
export type AnalyticsProps = Record<string, string | number | boolean>;

export interface AnalyticsProvider {
  name: string;
  track(event: AnalyticsEventName, props?: AnalyticsProps): void;
}

const consoleProvider: AnalyticsProvider = {
  name: "console",
  track: (event, props) => console.debug("[analytics]", event, props ?? {}),
};

const beaconProvider: AnalyticsProvider = {
  name: "beacon",
  track: (event, props) => {
    const body = JSON.stringify({ event, props, path: window.location.pathname });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    else void fetch("/api/analytics", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
  },
};

const providers: AnalyticsProvider[] = [];
if (process.env.NODE_ENV === "development") providers.push(consoleProvider);
if (process.env.NEXT_PUBLIC_ANALYTICS === "beacon") providers.push(beaconProvider);

export function registerAnalyticsProvider(provider: AnalyticsProvider) {
  if (!providers.some((p) => p.name === provider.name)) providers.push(provider);
}

export function track(event: AnalyticsEventName, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  if (navigator.doNotTrack === "1") return;
  for (const p of providers) {
    try {
      p.track(event, props);
    } catch {
      /* analytics must never break the UI */
    }
  }
}
