import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import FaqPage from "@/components/FaqPage";
import HomePage from "@/components/HomePage";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { DICTIONARIES } from "../dictionaries";
import { LOCALES } from "../locales";
import { localizedPath } from "../paths";

for (const locale of LOCALES) {
  const dict = DICTIONARIES[locale];
  it(`${locale} FAQ structured data matches the rendered questions and answers`, () => {
    const html = renderToStaticMarkup(createElement(FaqPage, { locale, dict }));
    const json = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)![1]);
    expect(json.mainEntity.map((entry: { name: string; acceptedAnswer: { text: string } }) => ({ question: entry.name, answer: entry.acceptedAnswer.text }))).toEqual(dict.faqPage.entries);
    for (const entry of dict.faqPage.entries) {
      for (const text of [entry.question, entry.answer]) {
        const escaped = renderToStaticMarkup(createElement("span", null, text)).slice(6, -7);
        expect(html).toContain(`>${escaped}</`);
      }
    }
    expect(html).toContain('href="/privacy"');
    expect(html).toContain(`href="${localizedPath(locale, "/")}#feedback"`);
  });
  it(`${locale} home renders dictionary strings in client forms and localized FAQ links`, () => {
    const html = renderToStaticMarkup(createElement(HomePage, { locale, dict }));
    expect(html).toContain(`href="${localizedPath(locale, "/faq")}"`);
    expect(html).toContain(`placeholder="${dict.converterForm.placeholder}"`);
    expect(html).toContain(dict.converterForm.convertButton);
    expect(html).toContain(dict.feedbackForm.sendButton);
    expect(html).toContain(dict.donate.description);
  });
  for (const page of ["/", "/faq"] as const) {
    it(`${locale} ${page} switcher links to every equivalent page`, () => {
      const html = renderToStaticMarkup(createElement(LanguageSwitcher, { currentLocale: locale, page, label: dict.languageSwitcherLabel }));
      for (const lang of LOCALES) {
        expect(html).toContain(`href="${localizedPath(lang, page)}"`);
        expect(html).toContain(`hrefLang="${lang}"`);
      }
      expect(html.match(/aria-current="page"/g)).toHaveLength(1);
    });
  }
}
