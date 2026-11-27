import type { Metadata } from "next";
import AdSenseScript from "@/components/AdSenseScript";
import RootBody from "@/components/RootBody";
import { baseMetadata } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <AdSenseScript />
      </head>
      <RootBody>{children}</RootBody>
    </html>
  );
}
