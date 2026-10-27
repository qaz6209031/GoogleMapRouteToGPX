import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { en } from "@/i18n/dictionaries/en";
import { localizedAlternates, localizedOpenGraph } from "@/i18n/metadata";
import { SITE_NAME, SOCIAL_IMAGE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: en.homeMeta.title },
  description: en.homeMeta.description,
  alternates: localizedAlternates("/", "en"),
  openGraph: {
    images: [SOCIAL_IMAGE],
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: en.homeMeta.title,
    description: en.homeMeta.description,
    ...localizedOpenGraph("en"),
  },
  twitter: {
    images: [SOCIAL_IMAGE],
    card: "summary_large_image",
    title: en.homeMeta.title,
    description: en.homeMeta.description,
  },
};

export default function Home() {
  return <HomePage locale="en" dict={en} />;
}
