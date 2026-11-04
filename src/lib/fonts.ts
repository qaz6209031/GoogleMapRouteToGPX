import { Barlow, Barlow_Condensed, Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Map lettering: condensed caps for display, labels, and controls on the map sheet. */
export const mapLettering = Barlow_Condensed({
  variable: "--font-map-lettering",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
});

/** Reading text on the map sheet. */
export const mapText = Barlow({
  variable: "--font-map-text",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});
