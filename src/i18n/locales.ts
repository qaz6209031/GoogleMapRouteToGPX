export type Locale = "en" | "id" | "es" | "ja";

export const LOCALES: Locale[] = ["en", "id", "es", "ja"];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as string[]).includes(value);
}

/** BCP 47 / og:locale tags, used for openGraph.locale and alternateLocale. */
export const OG_LOCALE_MAP: Record<Locale, string> = {
  en: "en_US",
  id: "id_ID",
  es: "es_ES",
  ja: "ja_JP",
};

/** Native-language labels for the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  es: "Español",
  ja: "日本語",
};
