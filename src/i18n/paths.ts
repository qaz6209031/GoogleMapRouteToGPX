import { DEFAULT_LOCALE, Locale } from "./locales";

/** The two localizable page paths: the home page and the FAQ page. */
export type LocalizablePath = "/" | "/faq";

/** English stays unprefixed; other locales get a /<locale> prefix. */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

export function localizedPath(locale: Locale, path: LocalizablePath): string {
  const prefix = localePrefix(locale);
  if (path === "/") return prefix || "/";
  return `${prefix}${path}`;
}
