import type { Metadata } from "next";
import Link from "next/link";
import ConverterForm from "@/components/ConverterForm";
import { en } from "@/i18n/dictionaries/en";
import { LANDING_PAGES, type LandingPageContent } from "@/lib/landing-pages";
import { SITE_NAME, SITE_URL, SOCIAL_IMAGE } from "@/lib/site";

export function landingMetadata(page: LandingPageContent): Metadata {
  const url = `${SITE_URL}/${page.slug}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      images: [SOCIAL_IMAGE],
      type: "website",
      siteName: SITE_NAME,
      url,
      title: page.title,
      description: page.description,
      locale: "en_US",
    },
    twitter: {
      images: [SOCIAL_IMAGE],
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export default function DeviceLandingPage({ page }: { page: LandingPageContent }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
  const others = LANDING_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-zinc-900 text-lg hover:text-blue-600 transition-colors">
            {SITE_NAME}
          </Link>
          <Link href="/faq" className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100">
            {en.nav.faq}
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-3 text-center">{page.h1}</h1>
        <p className="text-zinc-500 mb-8 text-center max-w-2xl mx-auto">{page.intro}</p>

        <ConverterForm dict={en.converterForm} donate={en.donate} donateLinks={en.donateLinks} />

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">{page.stepsHeading}</h2>
          <ol className="list-decimal pl-5 space-y-2 text-zinc-700 leading-relaxed">
            {page.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">{page.device} GPX FAQ</h2>
          <div className="space-y-6">
            {page.faq.map((entry) => (
              <div key={entry.question}>
                <h3 className="font-semibold text-zinc-900 mb-1">{entry.question}</h3>
                <p className="text-zinc-600 leading-relaxed">{entry.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <nav className="mt-14 text-sm text-zinc-500">
          Also see:{" "}
          {others.map((p, i) => (
            <span key={p.slug}>
              <Link href={`/${p.slug}`} className="text-blue-600 hover:underline">
                Google Maps to {p.device}
              </Link>
              {i < others.length - 1 ? " · " : ""}
            </span>
          ))}
        </nav>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-zinc-500">
          {SITE_NAME} ·{" "}
          <Link href="/privacy" className="hover:text-zinc-900">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
