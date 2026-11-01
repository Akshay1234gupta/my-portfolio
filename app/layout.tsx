import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { FeatherStage } from "@/components/animations/FeatherStage";
import { Footer } from "@/components/footer/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { ClientLayers } from "@/components/shared/ClientLayers";
import { Providers } from "@/components/shared/Providers";
import { siteConfig } from "@/data/site";
import { prefsBootScript } from "@/lib/prefs";
import { safeJsonLd } from "@/lib/utils";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Frontend Engineer, Creative Developer & AI Explorer`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — I build interfaces that feel alive`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — I build interfaces that feel alive`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050608" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6f9" },
  ],
  colorScheme: "dark light",
};

const sameAs = Object.values({ github: siteConfig.links.github, linkedin: siteConfig.links.linkedin }).filter(
  (u) => !u.includes("your-username"),
);

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Frontend Engineer",
  description: siteConfig.description,
  knowsAbout: ["React", "Next.js", "TypeScript", "Frontend Engineering", "Creative Development", "Artificial Intelligence"],
  ...(sameAs.length ? { sameAs } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-motion="full"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefsBootScript }} />
        {/* If JS is unavailable, never leave scroll-reveal content hidden. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}.feather-mover{opacity:.9!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }} />
      </head>
      <body className="min-h-full">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <div className="ambient" aria-hidden="true" />
          <FeatherStage />
          <Navbar />
          <div className="page-content flex min-h-screen flex-col">
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ClientLayers />
          <div className="grain" aria-hidden="true" />
        </Providers>
      </body>
    </html>
  );
}
