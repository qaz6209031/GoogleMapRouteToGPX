import Link from "next/link";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/locales";
import { type LocalizablePath, localizedPath } from "@/i18n/paths";

/** Plain links to the equivalent page in every locale — no JS-based detection. */
export default function LanguageSwitcher({
  currentLocale,
  page,
  label,
  tone = "default",
}: {
  currentLocale: Locale;
  page: LocalizablePath;
  label: string;
  /** "sheet" sets the links in map lettering for the map-sheet home page. */
  tone?: "default" | "sheet";
}) {
  const sheet = tone === "sheet";
  return (
    <nav
      aria-label={label}
      className={
        sheet
          ? "flex flex-wrap items-center gap-x-2 gap-y-1 font-lettering text-[14px] font-semibold uppercase tracking-[0.1em] text-ink-soft"
          : "flex items-center justify-center gap-x-2 gap-y-1 flex-wrap text-xs text-zinc-400"
      }
    >
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true">·</span>}
          <Link
            href={localizedPath(locale, page)}
            hrefLang={locale}
            lang={locale}
            aria-current={locale === currentLocale ? "page" : undefined}
            className={
              sheet
                ? locale === currentLocale
                  ? "text-ink underline decoration-route decoration-2 underline-offset-4"
                  : "transition-colors hover:text-route"
                : locale === currentLocale
                  ? "text-zinc-600 font-medium"
                  : "hover:text-blue-600 transition-colors"
            }
          >
            {LOCALE_LABELS[locale]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
