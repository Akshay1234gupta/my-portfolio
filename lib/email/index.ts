import nodemailer, { type Transporter } from "nodemailer";

/**
 * Provider-independent transactional email.
 *
 * `sendEmail()` is the only thing the rest of the app calls.
 * Supported providers:
 *  1. Resend (if RESEND_API_KEY is provided)
 *  2. SMTP / Gmail (if SMTP_USER and SMTP_PASS or SMTP_HOST is provided)
 *  3. Console logging (dev / fallback)
 */

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface EmailProvider {
  name: string;
  send(message: EmailMessage): Promise<void>;
}

const DEFAULT_FROM = process.env.EMAIL_FROM ?? "Akshay Gupta <akshayguptaa444@gmail.com>";

const resendProvider = (apiKey: string): EmailProvider => ({
  name: "resend",
  async send(m) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: DEFAULT_FROM,
        to: m.to,
        subject: m.subject,
        html: m.html,
        text: m.text,
        reply_to: m.replyTo,
        headers: m.headers,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  },
});

let cachedTransporter: Transporter | null = null;

function getSmtpTransporter(): Transporter {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host === "smtp.gmail.com" || (!process.env.SMTP_HOST && user?.endsWith("@gmail.com"))) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
  } else {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
  }

  return cachedTransporter;
}

const nodemailerProvider: EmailProvider = {
  name: "nodemailer",
  async send(m) {
    const transporter = getSmtpTransporter();
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER || DEFAULT_FROM;
    await transporter.sendMail({
      from,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      replyTo: m.replyTo,
      headers: m.headers,
    });
  },
};

const consoleProvider: EmailProvider = {
  name: "console",
  async send(m) {
    console.info(`[email:console] to=${Array.isArray(m.to) ? m.to.join(",") : m.to} subject="${m.subject}"\n${m.text}`);
  },
};

export function emailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY ||
    (process.env.SMTP_USER && process.env.SMTP_PASS)
  );
}

function getProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY) {
    return resendProvider(process.env.RESEND_API_KEY);
  }
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailerProvider;
  }
  return consoleProvider;
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  await getProvider().send(message);
}

/** Send many emails with small concurrency; returns counts instead of throwing. */
export async function sendMany(messages: EmailMessage[], concurrency = 5): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < messages.length; i += concurrency) {
    const results = await Promise.allSettled(messages.slice(i, i + concurrency).map((m) => sendEmail(m)));
    for (const r of results) {
      if (r.status === "fulfilled") sent++;
      else {
        failed++;
        console.error("[email] send failed:", r.reason);
      }
    }
  }
  return { sent, failed };
}
