import type { Metadata } from "next";
import Link from "next/link";
import { DEVICE_GUIDES } from "@/lib/guides";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Step-by-step guides for loading a Google Maps route (converted to GPX by MapsToGPX) onto a Bryton, Wahoo, Garmin, Hammerhead Karoo, or COROS device.";

export const metadata: Metadata = {
  title: "Device Guides",
  description: DESCRIPTION,
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    url: "/guides",
    title: `Device Guides | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Device Guides", item: `${SITE_URL}/guides` },
  ],
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/"
            className="font-semibold text-zinc-900 text-lg hover:text-blue-600 transition-colors"
          >
            MapsToGPX
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Device Guides</h1>
        <p className="text-zinc-500 mb-10 leading-relaxed">
          Already have a GPX file from MapsToGPX? Here&apos;s how to get it onto
          your device.
        </p>

        <div className="space-y-4">
          {DEVICE_GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block glass-card rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-zinc-900 mb-1.5">{guide.device}</h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {guide.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            ← Back to the converter
          </Link>
        </div>
      </main>
    </div>
  );
}
