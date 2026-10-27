import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FaqPage from "@/components/FaqPage";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/locales";
import { localizedAlternates, localizedOpenGraph } from "@/i18n/metadata";
import { localizedPath } from "@/i18n/paths";
import { SITE_NAME, SOCIAL_IMAGE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  const dict = getDictionary(locale);
  return {
    title: dict.faqMeta.title,
    description: dict.faqMeta.description,
    alternates: localizedAlternates("/faq", locale),
    openGraph: {
    images: [SOCIAL_IMAGE],
      type: "website",
      siteName: SITE_NAME,
      url: localizedPath(locale, "/faq"),
      title: dict.faqMeta.title,
      description: dict.faqMeta.description,
      ...localizedOpenGraph(locale),
    },
    twitter: {
    images: [SOCIAL_IMAGE],
      card: "summary_large_image",
      title: dict.faqMeta.title,
      description: dict.faqMeta.description,
    },
  };
}

export default async function LocaleFaq({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  return <FaqPage locale={locale} dict={getDictionary(locale)} />;
}
