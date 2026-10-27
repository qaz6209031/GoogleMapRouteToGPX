import type { Metadata } from "next";
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
      <RootBody>{children}</RootBody>
    </html>
  );
}
