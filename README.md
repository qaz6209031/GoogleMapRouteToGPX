# MapsToGPX

Convert Google Maps directions URLs into GPX files for Garmin, Bryton, and Wahoo bike computers. No sign-up required — just paste and go.

**Live site:** [maptogpx.com](https://maptogpx.com)

## Features

- **No account needed** — paste a URL, download a GPX file. No email, no sign-up.
- **Exact Google Maps routes** — uses the Google Directions API so the GPX matches exactly what Google Maps shows.
- **Elevation data included** — automatic elevation profiles so your bike computer shows climbs and descents.
- **Universal compatibility** — GPX 1.1 format works with Garmin, Bryton, Wahoo, and any device that reads GPX.
- **All URL formats** — supports long URLs, short links (goo.gl), addresses, coordinates, and multi-stop routes.

## How It Works

1. Open Google Maps and create a directions route
2. Copy the URL from your browser's address bar
3. Paste it on the site and click "Convert to GPX"
4. Download the GPX file and import it into your bike computer

## Tech Stack

- **Next.js 15** with TypeScript and Tailwind CSS (App Router)
- **Google Directions API** — exact route matching with Google Maps
- **Open-Meteo** — free elevation data
- **Nominatim** — free geocoding for address-based waypoints
- **Vercel** — deployment and hosting

## Getting Started

```bash
npm install
```

Create a `.env.local` file with your Google Maps API key:

```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

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
│       └── resolve-url/route.ts # Short URL expander
├── lib/
│   ├── types.ts                # Shared interfaces
│   ├── url-parser.ts           # Parse Google Maps URLs → coordinates
│   ├── google-directions-client.ts # Google Directions API routing
│   ├── elevation-client.ts     # Open-Meteo elevation lookup
│   ├── gpx-generator.ts        # GPX 1.1 XML generation
│   └── polyline.ts             # Google encoded polyline decoder
└── components/
    └── ConverterForm.tsx        # Main UI (client component)
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

Custom events contain no pasted Maps URLs, coordinates, route data, or error messages.
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
