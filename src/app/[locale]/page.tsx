import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
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
    title: { absolute: dict.homeMeta.title },
    description: dict.homeMeta.description,
    alternates: localizedAlternates("/", locale),
    openGraph: {
    images: [SOCIAL_IMAGE],
      type: "website",
      siteName: SITE_NAME,
      url: localizedPath(locale, "/"),
      title: dict.homeMeta.title,
      description: dict.homeMeta.description,
      ...localizedOpenGraph(locale),
    },
    twitter: {
    images: [SOCIAL_IMAGE],
      card: "summary_large_image",
      title: dict.homeMeta.title,
      description: dict.homeMeta.description,
    },
  };
}

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  return <HomePage locale={locale} dict={getDictionary(locale)} />;
}
