import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { geistSans, geistMono } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Convert Google Maps directions URLs into GPX files. Supports driving, cycling, and walking routes. Free, no sign-up needed.";

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: DESCRIPTION,
};

/**
 * Shared <body> contents for every root layout (one per locale route
 * group) — keeps fonts, analytics, and the WebApplication JSON-LD in one
 * place instead of duplicating them per layout.
 */
export default function RootBody({ children }: { children: ReactNode }) {
  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      {children}
      <GoogleAnalytics />
      <Analytics />
      <SpeedInsights />
    </body>
  );
}
