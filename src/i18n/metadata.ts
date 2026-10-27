import { DEFAULT_LOCALE, LOCALES, Locale, OG_LOCALE_MAP } from "./locales";
import { LocalizablePath, localizedPath } from "./paths";

/**
 * alternates.canonical + alternates.languages (incl. x-default) for a given
 * localizable page, relative to metadataBase. Used by both the home page
 * and the FAQ page in every locale.
 */
export function localizedAlternates(path: LocalizablePath, locale: Locale) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = localizedPath(l, path);
  }
  languages["x-default"] = localizedPath(DEFAULT_LOCALE, path);

  return {
    canonical: localizedPath(locale, path),
    languages,
  };
}

/** openGraph.locale + openGraph.alternateLocale for a given locale. */
export function localizedOpenGraph(locale: Locale) {
  return {
    locale: OG_LOCALE_MAP[locale],
    alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE_MAP[l]),
  };
}
