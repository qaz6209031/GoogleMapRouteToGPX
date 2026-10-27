import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localizedPath } from "@/i18n/paths";

export default function FaqPage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.faqPage.entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href={localizedPath(locale, "/")}
            className="font-semibold text-zinc-900 text-lg hover:text-blue-600 transition-colors"
          >
            MapsToGPX
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          {dict.faqPage.heading}
        </h1>
        <p className="text-sm text-zinc-500 mb-10">
          {dict.faqPage.introPrefix}
          <Link href={`${localizedPath(locale, "/")}#feedback`} className="text-blue-600 hover:underline">
            {dict.faqPage.sendFeedbackLink}
          </Link>
          {dict.faqPage.introSuffix}
        </p>

        <div className="space-y-8">
          {dict.faqPage.entries.map((entry) => (
            <div key={entry.question}>
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                {entry.question}
              </h2>
              <p className="text-zinc-600 leading-relaxed">{entry.answer}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-zinc-500">
          {dict.faqPage.privacyNotePrefix}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            {dict.faqPage.privacyLinkText}
          </Link>
          {dict.faqPage.privacyNoteSuffix}
        </p>

        <div className="mt-12">
          <Link
            href={localizedPath(locale, "/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            {dict.faqPage.backButton}
          </Link>
        </div>

      </main>
      <footer className="border-t border-zinc-200 px-4 py-8">
        <LanguageSwitcher currentLocale={locale} page="/faq" label={dict.languageSwitcherLabel} />
      </footer>
    </div>
  );
}
