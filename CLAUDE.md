# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — production build (also the main type check; there is no separate `tsc` script)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, extends `eslint-config-next`)

There is no test suite. `.env.local` needs `GOOGLE_MAPS_API_KEY` (for `/api/convert`) and `SUPABASE_URL` + `SUPABASE_SECRET_KEY` (for `/api/feedback`).

The repo is linked to the `maptogpx` Supabase project (ref `njzrhztlmvhcpjglnuut`). Add schema changes with `supabase migration new <name>` and apply them with `supabase db push`.

## Architecture

MapsToGPX (maptogpx.com) is a Next.js 16 App Router app (React 19, Tailwind v4) deployed on Vercel. It turns a pasted Google Maps directions URL into a downloadable GPX 1.1 track.

### Request flow

1. `src/components/ConverterForm.tsx` (client component) validates the URL. If it's a short link (`goo.gl` / `maps.app.goo.gl`), it first calls `POST /api/resolve-url`, which follows redirects server-side and returns the expanded `google.com/maps` URL.
2. The client then calls `POST /api/convert` with the full URL. Requests whose `Origin` header doesn't match the site get a 403, so curl/scripts must send a matching `Origin`.
3. `/api/convert` runs the pipeline in `src/lib`:
   - `url-parser.ts` → `parseGoogleMapsUrl()` produces `{ waypoints, routeIndex, travelMode }` from one of three URL shapes (`?api=1&origin=&destination=&waypoints=`, legacy `?saddr=&daddr=...+to:...`, or path-based `/maps/dir/A/B/C/@...`).
   - `resolveWaypoints()` geocodes any address-only waypoints via Nominatim (with fallbacks that strip business-name prefixes).
   - `google-directions-client.ts` → `getRoute()` calls the Google Directions API and decodes **step-level** polylines (not `overview_polyline`, which is simplified) via `polyline.ts`.
   - `gpx-generator.ts` emits the GPX XML string (track points only, no elevation).
4. The response is `{ gpx, stats: { distanceKm, waypointCount } }`; the client builds the download blob.

### Google Maps `data=` parameter decoding

Path-based URLs carry extra info in the protobuf-like `data=` segment. `url-parser.ts` parses it structurally (`!<field><type><value>`, where `m` is a nested message whose value is its token count) and reads the directions message at `!4m..!4m..`:
- `!1m<n>` — one block per path segment, in order (`!1m0` for a dropped-pin segment).
  - `!2m2!1d<lng>!2d<lat>` — coordinates for a named place; used instead of geocoding the segment's address.
  - `!3m4!1m2!1d<lng>!2d<lat>!3s<id>` — a point dragged onto the leg that *starts* at this waypoint (repeated per drag). Sent to the Directions API as `via:` waypoints so they shape the route without becoming stops.
- `!2m<n>!1b1!2b1!3b1` — avoid highways / tolls / ferries (Directions `avoid=`).
- `!3e<N>` — travel mode (0 driving, 1 bicycling, 2 walking, 3 transit); `travelmode=` query param takes precedence. Default is driving.
- `!5i<N>` — selected alternative route index (triggers `alternatives=true` in the Directions request).

Note the `lng`-before-`lat` ordering in these patterns.

### Feedback

`FeedbackForm.tsx` posts to `/api/feedback`, which validates the input (rating 1–5 and/or a message, optional email), drops honeypot (`website` field) submissions, and inserts into `public.feedback` through Supabase's REST API with a plain `fetch` (no `supabase-js`). The table has RLS enabled and no policies, so only the server-side secret key can access it. Never call Supabase from client code. Validation limits in the route mirror the `check` constraints in `supabase/migrations/`; keep them in sync.

### Other notes

- Both `/api/convert` and `/api/feedback` reject requests whose `Origin` doesn't match the site (`src/lib/same-origin.ts`).
- `src/lib/osrm-client.ts` is an older OSRM-based router that is no longer imported anywhere.

## Analytics

`src/lib/analytics.ts` holds the GA4 ID and host allowlist. `trackEvent()` only fires in production on `maptogpx.com` / `www.maptogpx.com`, and only sends `route_conversion`, `gpx_download`, and `feedback_submit`. Never include URLs, coordinates, route data, feedback content, or error messages in analytics events. Vercel Analytics and Speed Insights are also mounted in `layout.tsx`.
