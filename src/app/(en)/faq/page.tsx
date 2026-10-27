import type { Metadata } from "next";
import FaqPage from "@/components/FaqPage";
import { en } from "@/i18n/dictionaries/en";
import { localizedAlternates, localizedOpenGraph } from "@/i18n/metadata";
import { SITE_NAME, SOCIAL_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: en.faqMeta.title,
  description: en.faqMeta.description,
  alternates: localizedAlternates("/faq", "en"),
  openGraph: {
    images: [SOCIAL_IMAGE],
    type: "website",
    siteName: SITE_NAME,
    url: "/faq",
    title: en.faqMeta.title,
    description: en.faqMeta.description,
    ...localizedOpenGraph("en"),
  },
  twitter: {
    images: [SOCIAL_IMAGE],
    card: "summary_large_image",
    title: en.faqMeta.title,
    description: en.faqMeta.description,
  },
};

export default function Faq() {
  return <FaqPage locale="en" dict={en} />;
}
