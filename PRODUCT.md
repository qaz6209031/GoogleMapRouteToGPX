# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: cyclists who plan a ride in Google Maps (often reshaping it by dragging, adding stops, or avoiding highways) and need that exact route on a bike computer or companion app — Garmin, Wahoo, Bryton, Hammerhead Karoo, COROS. They usually arrive with a route already built and a URL in their clipboard; the job is to get a faithful GPX file onto the device before the ride, with no detours.

Secondary: anyone else exporting a Google Maps route as GPX (walking, driving, transit). The converter supports these modes, but product decisions favor the cyclist.

The audience is international: English plus Indonesian, Spanish, and Japanese locales ship today.

## Product Purpose

MapsToGPX (maptogpx.com) turns a pasted Google Maps directions URL into a downloadable GPX 1.1 track. Success means:

1. **Conversion fidelity.** Every URL a user pastes converts, and the track matches what Google Maps showed them: same roads, same stops, same dragged via points, same avoid options, same alternative route.
2. **A showcase of craft.** The site is a personal portfolio project for its builder (kaichin.dev), so its quality reflects on them.

## Positioning

It reads the route the user already built in Google Maps, including the parts encoded in the URL's `data=` segment (dragged via points, avoid options, travel mode, chosen alternative), and re-requests it from the Google Directions API with step-level polylines rather than the simplified overview line. That yields the same route at full detail, not an approximation re-routed by a different engine. No account, email, or upload step stands between paste and download.

## Operating Context

- Users plan in Google Maps (desktop or the mobile app), copy the address-bar URL or a `maps.app.goo.gl` share link, paste it, download the `.gpx`, then import it into Garmin Connect, Wahoo, Bryton Active, or similar, or copy it onto the device.
- Typical use is a one-shot task right before a ride; return visits are repeat conversions, not browsing.
- Mobile matters: share links come straight from the Google Maps phone app.

## Capabilities and Constraints

- Accepts long directions URLs, legacy `saddr/daddr` URLs, path-based `/maps/dir/...` URLs, and `goo.gl` / `maps.app.goo.gl` short links (expanded server-side).
- Supports multi-stop routes (max 25 intermediate stops; excess via points are downsampled), dragged via points, avoid highways/tolls/ferries, driving/cycling/walking/transit, and alternative-route selection.
- Output is a single GPX 1.1 track of track points. It has no elevation, no route/waypoint elements, and no turn-by-turn cues.
- Address-only stops are geocoded through OpenStreetMap Nominatim; routing is Google Directions API.
- Routes, URLs, and addresses are not stored. Directions responses are cached briefly to save quota. Feedback (rating, message, optional email) goes to Supabase.
- Per-IP rate limit of 10 requests/min; same-origin only.
- Errors shown to users are plain-language `UserInputError` messages or a generic fallback, never raw upstream text.
- Analytics events are limited to `route_conversion`, `gpx_download`, `feedback_submit`, `conversion_error` (fixed reason codes), and `donate_click`. They never carry URLs, coordinates, route data, feedback content, or error text.

## Brand Commitments

- Name: **MapsToGPX**. Domain: maptogpx.com. The home page title uses the search phrase "Map to GPX".
- **Free forever, no sign-up, no email, no login.** This is a core promise, not a launch tactic.
- **No ads.** Funding is voluntary donations only (Venmo, PayPal), framed as covering Google Maps API costs.
- Voice: direct, plain, friendly ("Just paste and go."); credits the builder by name in the footer.

## Evidence on Hand

- "10K+ users in 50+ countries" / "10,000+ users": backed by analytics, OK to cite. Update the figure from analytics rather than inflating it.
- A real feedback channel (Supabase `public.feedback`) and a changelog-style announcement banner for fixes driven by that feedback.
- FAQ content in `src/lib/faq.ts`; privacy policy at `/privacy`.
- Absent: testimonials, named customers, press, device-maker endorsements, and conversion-accuracy benchmarks. Do not fabricate any of them.

## Product Principles

1. **Fidelity over features.** A GPX that matches Google Maps exactly beats any added capability. When the route can't be reproduced faithfully, say so plainly.
2. **Paste to download, nothing in between.** No accounts, gates, upsells, or ads. Every added step must earn its place against that promise.
3. **Built for the rider at the bike computer.** Default to cyclist language and devices without breaking the other travel modes.
4. **Honest about limits.** Warnings (downsampled via points, unavailable alternatives) reach the user; claims on the site stay backed by real data.
5. **Respect the user's data.** Process routes without keeping them, and keep analytics free of anything personal or route-specific.

## Accessibility & Inclusion

Multilingual from the start (en, id, es, ja). Every new user-facing string goes through the i18n dictionaries. Open decision: no product-specific accessibility standard (e.g. a WCAG level) has been confirmed yet.
