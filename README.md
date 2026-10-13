# MapsToGPX

Convert Google Maps directions URLs into GPX files for Garmin, Bryton, Wahoo, and other GPS devices. Works with driving, cycling, and walking routes. No sign-up required — just paste and go.

**Live site:** [maptogpx.com](https://maptogpx.com)

## Features

- **No account needed** — paste a URL, download a GPX file. No email, no sign-up.
- **Exact Google Maps routes** — uses the Google Directions API so the GPX matches exactly what Google Maps shows.
- **Travel mode detection** — uses the driving, cycling, walking, or transit mode selected in Google Maps, plus the alternative route you picked.
- **Universal compatibility** — GPX 1.1 format works with Garmin, Bryton, Wahoo, and any device that reads GPX.
- **All URL formats** — supports long URLs, short links (goo.gl), addresses, coordinates, and multi-stop routes.

## How It Works

1. Open Google Maps and create a directions route
2. Copy the URL from your browser's address bar
3. Paste it on the site and click "Convert to GPX"
4. Download the GPX file and import it into your GPS device or app

## Tech Stack

- **Next.js 16** (App Router) with React 19, TypeScript, and Tailwind CSS 4
- **Google Directions API** — exact route matching with Google Maps
- **Nominatim** — free geocoding for address-based waypoints
- **Supabase** — stores feedback submitted through the site
- **Vercel** — deployment, hosting, Analytics, and Speed Insights

## Getting Started

```bash
npm install
```

Create a `.env.local` file with your Google Maps API key and Supabase credentials:

```
GOOGLE_MAPS_API_KEY=your_api_key_here
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

The Supabase values are only needed for the feedback form. Get the secret key with
`supabase projects api-keys --project-ref <project-ref> --reveal`.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Home page
│   ├── globals.css             # Tailwind + custom styles
│   └── api/
│       ├── convert/route.ts    # Main conversion pipeline
│       ├── feedback/route.ts   # Validates and stores user feedback
│       └── resolve-url/route.ts # Short URL expander
├── lib/
│   ├── types.ts                # Shared interfaces
│   ├── analytics.ts            # GA4 config + event tracking
│   ├── feedback-store.ts       # Supabase REST insert for feedback
│   ├── same-origin.ts          # Same-origin check for API routes
│   ├── url-parser.ts           # Parse Google Maps URLs → coordinates
│   ├── google-directions-client.ts # Google Directions API routing
│   ├── gpx-generator.ts        # GPX 1.1 XML generation
│   └── polyline.ts             # Google encoded polyline decoder
└── components/
    ├── ConverterForm.tsx        # Main UI (client component)
    ├── FeedbackForm.tsx         # Rating + message + optional email form
    └── GoogleAnalytics.tsx      # GA4 tag loader
supabase/
└── migrations/                  # Database schema (feedback table)
```

## Feedback

The **Share Your Feedback** section on the home page collects a 1–5 star rating, a
message, and an optional email (at least a rating or a message is required). Submissions go
through `POST /api/feedback`, which only accepts same-origin requests, validates the input,
drops bot submissions caught by a hidden honeypot field, and inserts the row into the
`feedback` table in Supabase using the secret key.

The table has row-level security enabled with no policies, so the public (anon) key can't read
or write it. View submissions in the Supabase dashboard's Table Editor.

Schema changes live in `supabase/migrations/`. To apply new migrations:

```bash
supabase migration new <name>   # create a migration file
supabase db push                # apply it to the linked project
```

## Analytics

Google Analytics 4 uses measurement ID `G-E4P5HTG25D` for the **MapsToGPX** property
and **MapsToGPX Web** stream. No extra environment variable is required.

The tag loads after hydration in production builds. Collection is restricted to
`maptogpx.com` and `www.maptogpx.com`, excluding localhost and Vercel preview domains.
Existing Vercel Analytics and Speed Insights remain enabled.

Alongside automatic page views, scrolls, and outbound clicks, the app sends:

| Event | Trigger |
| --- | --- |
| `route_conversion` | A route conversion finishes successfully. |
| `gpx_download` | The user clicks to download the generated GPX file. |
| `feedback_submit` | The user successfully submits the feedback form. |

Custom events contain no pasted Maps URLs, coordinates, route data, feedback content, or error messages.
Google signals and ad personalization signals are disabled. The site's generated GPX
download uses an explicit event because it isn't a standard file link.

After deploying, open Google Analytics **Reports → Realtime**, visit the live site,
convert a route, and download its GPX file to verify the events.

## Supported Google Maps URL Formats

- **Path-based:** `google.com/maps/dir/Origin/Destination/@viewport`
- **Query-based:** `google.com/maps/dir/?api=1&origin=A&destination=B&waypoints=C|D`
- **Legacy:** `google.com/maps?saddr=A&daddr=B+to:C`
- **Short URLs:** `maps.app.goo.gl/XXX`
- **Coordinates:** `47.6228,-122.3353`
- **Addresses:** `7405 168th Ave NE, Redmond, WA`
