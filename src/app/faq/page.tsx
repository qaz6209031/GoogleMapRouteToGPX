import type { Metadata } from "next";
import Link from "next/link";
import { FAQ_ENTRIES } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about converting Google Maps routes to GPX files: supported URL formats, travel modes, GPX contents, device compatibility, limits, and privacy.",
  alternates: {
    canonical: "/faq",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ENTRIES.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: entry.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          Can&apos;t find your answer here?{" "}
          <Link href="/#feedback" className="text-blue-600 hover:underline">
            Send us feedback
          </Link>
          .
        </p>

        <div className="space-y-8">
          {FAQ_ENTRIES.map((entry) => (
            <div key={entry.question}>
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                {entry.question}
              </h2>
              <p className="text-zinc-600 leading-relaxed">{entry.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-zinc-500">
          See the{" "}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            privacy policy
          </Link>{" "}
          for details on what data is processed.
        </p>

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
