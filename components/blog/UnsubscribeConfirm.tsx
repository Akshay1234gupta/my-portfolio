"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

/** Unsubscribing needs a deliberate click, so mail-client link prefetchers can't unsubscribe people. */
export function UnsubscribeConfirm({ email, token }: { email: string; token: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const confirm = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p role="status" className="text-emerald">
        You&rsquo;ve been unsubscribed. Sorry to see you go — you won&rsquo;t receive any more emails.
      </p>
    );
  }

  return (
    <div>
      <p className="text-fg-soft">
        Stop sending emails to <strong className="text-fg">{email}</strong>?
      </p>
      <button type="button" onClick={confirm} disabled={status === "loading"} className="btn btn-primary mt-6">
        {status === "loading" ? "Unsubscribing…" : "Yes, unsubscribe me"}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
