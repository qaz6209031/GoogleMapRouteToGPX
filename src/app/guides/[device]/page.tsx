import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDE_SLUGS, getGuide } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_SLUGS.map((device) => ({ device }));
}

type Props = {
  params: Promise<{ device: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { device } = await params;
  const guide = getGuide(device);
  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      url: `/guides/${guide.slug}`,
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function DeviceGuidePage({ params }: Props) {
  const { device } = await params;
  const guide = getGuide(device);
  if (!guide) {
    notFound();
  }

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    step: guide.methods.map((method) => ({
      "@type": "HowToSection",
      name: method.title,
      itemListElement: method.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Device Guides", item: `${SITE_URL}/guides` },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.device,
        item: `${SITE_URL}/guides/${guide.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Link
            href="/"
            className="font-semibold text-zinc-900 text-lg hover:text-blue-600 transition-colors"
          >
            MapsToGPX
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <nav className="text-sm text-zinc-500 mb-6">
          <Link href="/guides" className="hover:text-blue-600 transition-colors">
            Device Guides
          </Link>{" "}
          / {guide.device}
        </nav>

        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{guide.title}</h1>
        <p className="text-sm text-zinc-400 mb-6">
          Last reviewed: {guide.lastReviewed}
        </p>
        <p className="text-zinc-600 leading-relaxed mb-8">{guide.intro}</p>

        <div className="mb-10 p-5 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900 leading-relaxed mb-3">
            Don&apos;t have a GPX file yet? Convert your Google Maps route
            first.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Convert your Google Maps route to GPX
          </Link>
        </div>

        <div className="space-y-10">
          {guide.methods.map((method) => (
            <section key={method.id}>
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">
                {method.title}
              </h2>
              <ol className="space-y-4 list-decimal list-outside pl-5">
                {method.steps.map((step) => (
                  <li key={step.name} className="text-zinc-600 leading-relaxed">
                    <span className="font-medium text-zinc-900">{step.name}:</span>{" "}
                    {step.text}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        {guide.tips.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Tips &amp; Troubleshooting
            </h2>
            <ul className="list-disc list-outside pl-5 space-y-2">
              {guide.tips.map((tip) => (
                <li key={tip} className="text-zinc-600 leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-sm text-zinc-500 italic">
          Menus can change with firmware/app updates — check the linked
          official guide if something looks different.
        </p>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Sources</h2>
          <ul className="list-disc list-outside pl-5 space-y-2">
            {guide.sources.map((source) => (
              <li key={source.url} className="text-sm">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            ← All device guides
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            Back to the converter
          </Link>
        </div>
      </main>
    </div>
  );
}
