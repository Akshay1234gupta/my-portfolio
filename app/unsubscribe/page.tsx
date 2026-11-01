import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeConfirm } from "@/components/blog/UnsubscribeConfirm";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: PageProps<"/unsubscribe">) {
  const sp = await searchParams;
  const email = typeof sp.e === "string" ? sp.e : "";
  const token = typeof sp.t === "string" ? sp.t : "";

  return (
    <div className="container-x pb-10 pt-40 md:pt-52">
      <div className="max-w-xl">
        <p className="eyebrow">Newsletter</p>
        <h1 className="h-section mt-5">Unsubscribe</h1>
        <div className="mt-8">
          {email && token ? (
            <UnsubscribeConfirm email={email} token={token} />
          ) : (
            <p className="text-fg-soft">This unsubscribe link is incomplete. Please use the link from the bottom of the email.</p>
          )}
        </div>
        <Link href="/" className="link-underline mt-12 inline-block text-sm" data-cursor="link">
          ← Back to the portfolio
        </Link>
      </div>
    </div>
  );
}
