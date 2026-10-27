import { describe, expect, it } from "vitest";
import { DICTIONARIES } from "../dictionaries";
import { LOCALES, DEFAULT_LOCALE } from "../locales";
import { localizedPath } from "../paths";
import { localizedAlternates, localizedOpenGraph } from "../metadata";
import { PUBLIC_ROUTES, SITE_URL } from "@/lib/site";
import sitemap from "@/app/sitemap";

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, shape(child)]));
  }
  return typeof value;
}

describe("localized content and routes", () => {
  for (const locale of LOCALES) {
    it(`${locale} has the complete English dictionary shape and FAQ count`, () => {
      expect(shape(DICTIONARIES[locale])).toEqual(shape(DICTIONARIES.en));
      expect(DICTIONARIES[locale].faqPage.entries).toHaveLength(DICTIONARIES.en.faqPage.entries.length);
      expect(DICTIONARIES[locale].hero.badge).toContain("2K+");
      expect(DICTIONARIES[locale].hero.badge).toContain("50+");
      expect(DICTIONARIES[locale].features.items[4].description).toContain("2,000+");
    });
    for (const page of ["/", "/faq"] as const) {
      it(`${locale} ${page} has reciprocal metadata and sitemap alternates`, () => {
        const path = localizedPath(locale, page);
        const languages = Object.fromEntries([...LOCALES.map((lang) => [lang, `${SITE_URL}${localizedPath(lang, page)}`]), ["x-default", `${SITE_URL}${localizedPath(DEFAULT_LOCALE, page)}`]]);
        const route = PUBLIC_ROUTES.find((route) => route.path === path);
        expect(route?.languages).toEqual(languages);
        expect(sitemap().find((entry) => entry.url === `${SITE_URL}${path}`)?.alternates?.languages).toEqual(languages);
        const metadata = localizedAlternates(page, locale);
        expect(metadata.canonical).toBe(path);
        expect(Object.fromEntries(Object.entries(metadata.languages).map(([key, value]) => [key, `${SITE_URL}${value}`]))).toEqual(languages);
        expect(localizedOpenGraph(locale).alternateLocale).toHaveLength(3);
      });
    }
  }
  it("keeps privacy English-only and excludes device guides", () => {
    expect(PUBLIC_ROUTES.find((route) => route.path === "/privacy")?.languages).toBeUndefined();
    expect(PUBLIC_ROUTES).toHaveLength(9);
    expect(PUBLIC_ROUTES.some((route) => route.path.includes("guides"))).toBe(false);
  });
});
