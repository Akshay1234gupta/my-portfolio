import { absoluteUrl, siteConfig } from "@/data/site";
import { escapeHtml } from "@/lib/validation";
import type { EmailMessage } from "./index";

function layout(title: string, bodyHtml: string, unsubscribe?: string): string {
  return `<!doctype html><html><body style="margin:0;background:#050608;padding:32px 16px;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#eef1f5">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#0b0d12;border:1px solid #1c2029;border-radius:20px;padding:36px" cellspacing="0" cellpadding="0"><tr><td>
<p style="margin:0 0 24px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#2dd4bf">${escapeHtml(siteConfig.name)}</p>
<h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;letter-spacing:-.02em">${escapeHtml(title)}</h1>
${bodyHtml}
${unsubscribe ? `<p style="margin:32px 0 0;font-size:12px;color:#8b93a3">You're receiving this because you subscribed at ${escapeHtml(siteConfig.url)}. <a href="${escapeHtml(unsubscribe)}" style="color:#8b93a3">Unsubscribe</a></p>` : ""}
</td></tr></table></td></tr></table></body></html>`;
}

function unsubscribeHeaders(unsubscribe: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribe}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

export function welcomeEmail(to: string, unsubscribe: string): EmailMessage {
  const blog = absoluteUrl("/blog");
  return {
    to,
    subject: `You're in — welcome to ${siteConfig.name}'s build notes`,
    text: `Thanks for subscribing.\n\nI write about ${siteConfig.blogTopics.join(", ")}. You'll get an email when a new article goes live.\n\nRead the blog: ${blog}\n\nUnsubscribe: ${unsubscribe}`,
    html: layout(
      "You're in.",
      `<p style="margin:0 0 16px;line-height:1.7;color:#c4cad6">Thanks for subscribing. I write about ${escapeHtml(siteConfig.blogTopics.join(", "))}. You'll get an email when a new article goes live — nothing else.</p>
<p style="margin:24px 0 0"><a href="${escapeHtml(blog)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#eef1f5;color:#050608;text-decoration:none;font-weight:600">Read the blog</a></p>`,
      unsubscribe,
    ),
    headers: unsubscribeHeaders(unsubscribe),
  };
}

export function newPostEmail(
  to: string,
  post: { title: string; description: string; url: string },
  unsubscribe: string,
): EmailMessage {
  return {
    to,
    subject: `New: ${post.title}`,
    text: `${post.title}\n\n${post.description}\n\nRead it: ${post.url}\n\nUnsubscribe: ${unsubscribe}`,
    html: layout(
      post.title,
      `<p style="margin:0 0 16px;line-height:1.7;color:#c4cad6">${escapeHtml(post.description)}</p>
<p style="margin:24px 0 0"><a href="${escapeHtml(post.url)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#eef1f5;color:#050608;text-decoration:none;font-weight:600">Read the article</a></p>`,
      unsubscribe,
    ),
    headers: unsubscribeHeaders(unsubscribe),
  };
}

export function contactEmail(
  to: string,
  data: { intent: string; name: string; email: string; message: string },
): EmailMessage {
  return {
    to,
    replyTo: data.email,
    subject: `[Portfolio] ${data.intent} — ${data.name}`,
    text: `Intent: ${data.intent}\nName: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    html: layout(
      `New message from ${data.name}`,
      `<p style="margin:0 0 6px;font-size:13px;color:#8b93a3">${escapeHtml(data.intent)}</p>
<p style="margin:0 0 20px;color:#c4cad6"><a href="mailto:${escapeHtml(data.email)}" style="color:#2dd4bf">${escapeHtml(data.email)}</a></p>
<p style="margin:0;line-height:1.7;color:#eef1f5;white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    ),
  };
}

export function subscriberAlertEmail(to: string, subscriberEmail: string, source: string): EmailMessage {
  return {
    to,
    subject: `[Portfolio] New Subscriber: ${subscriberEmail}`,
    text: `You have a new newsletter subscriber!\n\nEmail: ${subscriberEmail}\nSource: ${source}\nDate: ${new Date().toISOString()}`,
    html: layout(
      "New Newsletter Subscriber",
      `<p style="margin:0 0 12px;font-size:15px;color:#c4cad6">Someone just subscribed to your newsletter!</p>
<table style="width:100%;margin:16px 0;border-collapse:collapse;font-size:14px">
  <tr><td style="padding:8px 0;color:#8b93a3;width:80px">Email:</td><td style="padding:8px 0;color:#2dd4bf"><strong>${escapeHtml(subscriberEmail)}</strong></td></tr>
  <tr><td style="padding:8px 0;color:#8b93a3">Source:</td><td style="padding:8px 0;color:#eef1f5">${escapeHtml(source)}</td></tr>
  <tr><td style="padding:8px 0;color:#8b93a3">Time:</td><td style="padding:8px 0;color:#eef1f5">${escapeHtml(new Date().toLocaleString())}</td></tr>
</table>
<p style="margin:20px 0 0;font-size:13px;color:#8b93a3">This record is saved in your MongoDB <code>newsletter_subscribers</code> collection.</p>`,
    ),
  };
}
