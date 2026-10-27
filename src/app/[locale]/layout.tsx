import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RootBody from "@/components/RootBody";
import { baseMetadata } from "@/lib/site";
import { LOCALES, isLocale } from "@/i18n/locales";
import "../globals.css";

export const metadata: Metadata = baseMetadata;

// English lives at app/(en) with no prefix; this segment only ever serves
// id/es/ja. Any other value (e.g. /fr) must 404 instead of being rendered.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  return (
    <html lang={locale}>
      <RootBody>{children}</RootBody>
    </html>
  );
}
