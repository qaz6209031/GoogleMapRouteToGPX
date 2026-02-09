# MapsToGPX

Convert Google Maps directions URLs into GPX files for Garmin, Bryton, and Wahoo bike computers. No sign-up required — just paste and go.

**Live site:** [maps-to-gpx-five.vercel.app](https://maps-to-gpx-five.vercel.app)

## Features

- **No account needed** — paste a URL, download a GPX file. No email, no sign-up.
- **Cycling-optimized routes** — uses OSRM's bicycle profile for bike-friendly roads and paths.
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
- **OSRM** — free public API for bicycle routing
- **Open-Meteo** — free elevation data
- **Nominatim** — free geocoding for address-based waypoints
- **Vercel** — deployment and hosting

## Getting Started

```bash
npm install
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
│   ├── osrm-client.ts          # OSRM bicycle routing
│   ├── elevation-client.ts     # Open-Meteo elevation lookup
│   ├── gpx-generator.ts        # GPX 1.1 XML generation
│   └── polyline.ts             # Google encoded polyline decoder
└── components/
    └── ConverterForm.tsx        # Main UI (client component)
```

## Supported Google Maps URL Formats

- **Path-based:** `google.com/maps/dir/Origin/Destination/@viewport`
- **Query-based:** `google.com/maps/dir/?api=1&origin=A&destination=B&waypoints=C|D`
- **Legacy:** `google.com/maps?saddr=A&daddr=B+to:C`
- **Short URLs:** `maps.app.goo.gl/XXX`
- **Coordinates:** `47.6228,-122.3353`
- **Addresses:** `7405 168th Ave NE, Redmond, WA`
