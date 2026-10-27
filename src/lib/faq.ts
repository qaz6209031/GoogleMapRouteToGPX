export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * FAQ content, kept as plain data so it can be rendered into both the page
 * body and FAQPage JSON-LD, unit-tested, and used as the English dictionary’s source.
 */
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    question: "What Google Maps URL formats does MapsToGPX support?",
    answer:
      "Long directions URLs copied from the address bar, short links (goo.gl and maps.app.goo.gl — these are expanded automatically), URLs built from addresses or place names, URLs with raw latitude/longitude coordinates, and multi-stop routes with several waypoints.",
  },
  {
    question: "How does it know which travel mode (driving, cycling, walking) to use?",
    answer:
      "It reads the travel mode Google Maps already encoded in your URL — either the travelmode parameter or the mode embedded when you picked driving, cycling, walking, or transit in Maps. If neither is present, it defaults to driving.",
  },
  {
    question: "What exactly is in the downloaded GPX file?",
    answer:
      "A single GPX 1.1 track made of track points following the exact path Google Directions returns, decoded at step level for full detail (not Google's simplified overview line). It's a track, not a route or a list of waypoints, and it doesn't include elevation data.",
  },
  {
    question: "Which devices and apps can use the GPX file?",
    answer:
      "Any app or GPS device that imports standard GPX 1.1 tracks — this includes Garmin, Wahoo, Bryton, Hammerhead Karoo, and COROS devices, among others. Just import or copy the downloaded .gpx file the same way you would any other GPX track.",
  },
  {
    question: "Is MapsToGPX free? Do I need to create an account?",
    answer:
      "Yes, it's completely free, with no account, sign-up, or login required. Paste a URL and download your GPX file.",
  },
  {
    question: "Does it handle multi-stop routes and routes I've reshaped by dragging?",
    answer:
      "Yes. Intermediate stops in your URL are routed through in order — the track passes through them rather than being added as separate waypoint markers — and points you've dragged onto the route in Google Maps are kept as via points that shape the path without being added as separate stops. \"Avoid highways/tolls/ferries\" options you set in Maps also carry over.",
  },
  {
    question: "Why might the converted route differ slightly from what Google Maps showed me?",
    answer:
      "The route is recomputed by the Google Directions API — the same routing engine behind Google Maps — using your waypoints, so Google may return a slightly different path if road data or routing changed since you copied the link, or if the URL encoded an alternate route that can't be requested together with intermediate stops. If your URL pointed to a specific alternate route and your trip has intermediate stops, Google's Directions API can't return alternatives in that case, so the main route is used instead and a warning is shown.",
  },
  {
    question: "Are there any limits on route size or how often I can convert?",
    answer:
      "Google's Directions API allows at most 25 intermediate waypoints; routes with more stops than that can't be converted. If you have fewer stops but many dragged via points, the via points are thinned out evenly to fit the limit while every real stop is kept. Conversions and short-link lookups are also limited to 10 requests per minute per IP address to keep the service available for everyone.",
  },
  {
    question: "My conversion failed — what went wrong?",
    answer:
      "The most common causes are: the pasted link isn't a Google Maps directions URL, an address in the route couldn't be geocoded, Google's Directions API couldn't find a route between the given points, you've hit the per-minute rate limit, or a temporary network issue. Try re-copying the link from Google Maps, simplifying the route, or waiting a minute before retrying.",
  },
  {
    question: "How do I report a bug or suggest a feature?",
    answer:
      "Use the feedback form on the home page — you can leave a star rating, a message, or both, and optionally an email address if you'd like a reply.",
  },
  {
    question: "Does MapsToGPX store my routes or personal data?",
    answer:
      "No — routes, URLs, and addresses aren't stored in a database; only short-lived caches are used to avoid repeat lookups. See the privacy policy for the full details of what is and isn't collected.",
  },
];
