import type { Metadata } from "next";
import Link from "next/link";
import { geistSans, geistMono } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Page Not Found</h1>
          <p className="text-zinc-500 mb-6">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            ← Back to the converter
          </Link>
        </div>
      </body>
    </html>
  );
}
