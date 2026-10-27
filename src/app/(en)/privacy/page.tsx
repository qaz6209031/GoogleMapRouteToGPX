import type { Metadata } from "next";
import Link from "next/link";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What MapsToGPX collects when you convert a route, submit feedback, or visit the site — and what it doesn't.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
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

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 prose-sm">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-zinc-400 mb-10">Last updated: October 27, 2026</p>

        <div className="space-y-10 text-zinc-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Overview</h2>
            <p>
              MapsToGPX converts a Google Maps directions URL into a GPX file.
              There are no user accounts, no sign-up, and no login — you paste a
              URL and get a file back. This page explains exactly what data is
              processed to make that happen, and what we deliberately don&apos;t
              collect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              Converting a route
            </h2>
            <p className="mb-3">
              When you paste a URL and click Convert:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If you pasted a short link (<code>goo.gl</code> or{" "}
                <code>maps.app.goo.gl</code>), our server follows the redirect
                to expand it to a full Google Maps URL before doing anything
                else. That request goes to Google&apos;s redirect servers.
              </li>
              <li>
                The URL is parsed on our server to extract the stops, travel
                mode, and route options it encodes. Any stop that&apos;s a
                place name or address (rather than a pin with coordinates) is
                looked up using{" "}
                <a
                  href="https://nominatim.openstreetmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  OpenStreetMap Nominatim
                </a>
                , a free geocoding service, to turn it into coordinates.
              </li>
              <li>
                The resulting coordinates are sent to the Google Directions
                API to calculate the exact route (roads, turns, distance) —
                the same routing engine Google Maps itself uses.
              </li>
              <li>
                The GPX file is generated from that route and returned
                directly to your browser. We don&apos;t store your routes,
                URLs, or addresses in a database.
              </li>
            </ul>
            <p className="mt-3">
              We do temporarily cache Google Directions responses (up to 24
              hours) and geocoding results (up to 7 days) so that converting
              the same route twice doesn&apos;t burn through Google&apos;s or
              Nominatim&apos;s request quotas. Cache entries are keyed by a
              one-way SHA-256 hash of the rounded coordinates, travel mode,
              and route options (or the normalized address text, for
              geocoding) — not by anything that identifies you — and expire
              automatically. This cache lives in Vercel&apos;s shared Runtime
              Cache plus a small, bounded in-memory cache on the server.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              Rate limiting
            </h2>
            <p>
              To keep the service available for everyone, requests to convert
              a route or resolve a short link are limited per IP address (10
              per minute). Your IP address is read from standard proxy
              headers and held only in the server&apos;s memory to count
              requests in the current window — it&apos;s never written to a
              database, and the counter resets automatically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Feedback</h2>
            <p>
              The optional feedback form lets you submit a star rating
              (1–5), a message, and/or an email address — all optional,
              though at least a rating or a message is required to submit.
              If you submit feedback, exactly those fields (rating, message,
              email) are stored in our database (Supabase/Postgres). Row-level
              security is enabled on that table with no public access
              policies, so only our server, using a private key, can read or
              write it. We don&apos;t attach your IP address or any other
              metadata to feedback submissions. A hidden field on the form
              helps us silently discard automated/bot submissions without
              storing them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Analytics</h2>
            <p className="mb-3">
              We use Google Analytics 4 (measurement ID{" "}
              <code>{GA_MEASUREMENT_ID}</code>) to understand overall usage.
              It only loads when the site is visited at{" "}
              <code>maptogpx.com</code> or <code>www.maptogpx.com</code> in
              production — not in local development or preview deployments.
              Google Signals and ads personalization are turned off. We only
              send a small, fixed set of events: a route was converted, a GPX
              file was downloaded, feedback was submitted, a donate link was
              clicked (with which link), and — if a conversion fails — a
              short error-category code (e.g. &ldquo;rate limited&rdquo; or
              &ldquo;location not found&rdquo;). We never send the URL you
              pasted, any address or coordinate, your feedback text, or raw
              error messages to analytics. Google Analytics sets first-party
              cookies on <code>maptogpx.com</code> (such as{" "}
              <code>_ga</code>) to distinguish visitors; see Google&apos;s{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                partner sites policy
              </a>{" "}
              for how that data is used, or install the{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Analytics opt-out browser add-on
              </a>{" "}
              to opt out.
            </p>
            <p>
              We also use Vercel Web Analytics and Speed Insights, which are
              cookieless and report aggregated traffic and page-performance
              metrics without identifying individual visitors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              No accounts
            </h2>
            <p>
              MapsToGPX doesn&apos;t have user accounts, logins, or
              passwords. The only cookies set on the production site are
              those set by Google Analytics (such as <code>_ga</code>) —
              see the Analytics section above for details. Vercel Web
              Analytics and Speed Insights are cookieless.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              Donations
            </h2>
            <p>
              The donate links on the home page go to PayPal and Venmo,
              third-party payment processors. If you choose to donate,
              your payment is handled entirely by them under their own
              privacy policies — we only see that a donate link was clicked,
              not any payment or personal details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">
              Changes to this policy
            </h2>
            <p>
              If how this site handles data changes, we&apos;ll update this
              page and the &ldquo;last updated&rdquo; date above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-3">Contact</h2>
            <p>
              Questions about this policy? Use the{" "}
              <Link href="/#feedback" className="text-blue-600 hover:underline">
                feedback form
              </Link>{" "}
              on the home page.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            ← Back to the converter
          </Link>
        </div>
      </main>
    </div>
  );
}
