import type { Dictionary } from "../dictionary";
import { FAQ_ENTRIES } from "@/lib/faq";

export const en: Dictionary = {
  nav: {
    howItWorks: "How It Works",
    feedback: "Feedback",
    faq: "FAQ",
  },
  hero: {
    badge: "Loved by 2K+ users in 50+ countries",
    titleLine1: "Google Maps Route",
    titleLine2: "to GPX File",
    subtitle:
      "Convert any Google Maps directions URL into a GPX file for your GPS device — driving, cycling, or walking.",
    subtitleBold: "No sign-up. No email. Just paste and go.",
  },
  announcement: {
    badge: "Fixed",
    text:
      "Routes you reshape by dragging on Google Maps are now kept in the GPX, along with “avoid highways / tolls / ferries” options. Thanks for the feedback!",
  },
  trustBadges: {
    gpxStandard: "GPX 1.1 Standard",
    exactRoute: "Exact Google Maps route",
    allModes: "All travel modes",
    noSignup: "No sign-up required",
  },
  features: {
    heading: "Why MapsToGPX?",
    subheading:
      "Everything you need to get your Google Maps routes into a GPX file.",
    items: [
      {
        title: "No Account Needed",
        description:
          "Unlike other tools, we don't ask for your email or make you create an account. Just paste a URL and download your GPX — instantly.",
      },
      {
        title: "Exact Google Maps Routes",
        description:
          "Routes match exactly what Google Maps shows — driving, cycling, or walking. Same roads, paths, and turns.",
      },
      {
        title: "All Travel Modes",
        description:
          "Works with driving, cycling, walking, and transit routes. The travel mode is detected automatically from your URL.",
      },
      {
        title: "Universal Compatibility",
        description:
          "Standard GPX 1.1 format works with Garmin, Bryton, Wahoo, and any device that reads GPX.",
      },
      {
        title: "Trusted by Thousands",
        description:
          "Used by 2,000+ users worldwide. No sign-up, no hidden costs — just GPX files.",
      },
      {
        title: "All URL Formats",
        description:
          "Supports long URLs, short links (goo.gl), addresses, coordinates, and multi-stop routes.",
      },
    ],
  },
  howItWorks: {
    heading: "How It Works",
    subheading: "Three simple steps from Google Maps to GPX.",
    steps: [
      {
        step: "1",
        title: "Plan your route",
        description:
          "Open Google Maps, create a directions route, and copy the URL from your browser's address bar.",
      },
      {
        step: "2",
        title: "Convert to GPX",
        description:
          "Paste the URL above and click Convert. We'll generate a GPX file with the exact same route from Google Maps.",
      },
      {
        step: "3",
        title: "Ride!",
        description:
          "Download the GPX file and import it into Garmin Connect, Bryton Active, Wahoo app, or any compatible device.",
      },
    ],
  },
  feedbackSection: {
    heading: "Share Your Feedback",
    subheading: "Found a bug or have an idea? Let us know.",
  },
  donate: {
    heading: "Enjoy MapsToGPX? Buy me a coffee!",
    description:
      "MapsToGPX is free. Donations help cover Google Maps API costs.",
  },
  donateLinks: { venmo: "Venmo", paypal: "PayPal" },
  footer: {
    builtBy: "Built by",
    faqLink: "FAQ",
    privacyLink: "Privacy Policy",
    tagline: "Free forever. Trusted by users worldwide.",
  },
  converterForm: {
    placeholder: "Paste your Google Maps directions URL here...",
    convertButton: "Convert to GPX",
    convertingButton: "Converting...",
    stepLabels: {
      idle: "",
      resolving: "Resolving short URL...",
      routing: "Converting route — this may take a few seconds...",
      done: "Done!",
      error: "Error",
    },
    invalidUrlError: "Please enter a valid Google Maps URL",
    networkError: "Network error. Please try again.",
    nonJsonError: "Conversion failed. Please try again.",
    conversionFailedFallback: "Conversion failed",
    successBanner: "Route converted successfully!",
    distanceLabel: "Distance",
    waypointsLabel: "Waypoints",
    downloadButton: "Download GPX",
    newButton: "New",
  },
  feedbackForm: {
    ratingQuestion: "How was your experience?",
    optionalHint: "(optional)",
    ratingLabels: ["Poor", "Fair", "Good", "Great", "Excellent"],
    starAriaLabelOne: "{n} star",
    starAriaLabelMany: "{n} stars",
    messageLabel: "What could be better?",
    messageHint: "(bugs, routes that didn't convert, feature ideas)",
    messagePlaceholder: "Tell us what you think...",
    emailLabel: "Email",
    emailHint: "(optional, only if you'd like a reply)",
    emailPlaceholder: "you@example.com",
    sendButton: "Send Feedback",
    sendingButton: "Sending...",
    sendMoreButton: "Send more feedback",
    thanksHeading: "Thanks for your feedback!",
    thanksSubtext:
      "Every message is read and helps make MapsToGPX better.",
    errorFallback: "Could not send feedback",
  },
  homeMeta: {
    title: "Map to GPX – Convert Google Maps Route to GPX (Free)",
    description:
      "Convert Google Maps directions URLs into GPX files. Supports driving, cycling, and walking routes. Free, no sign-up needed.",
  },
  faqMeta: {
    title: "FAQ",
    description:
      "Answers to common questions about converting Google Maps routes to GPX files: supported URL formats, travel modes, GPX contents, device compatibility, limits, and privacy.",
  },
  faqPage: {
    heading: "Frequently Asked Questions",
    introPrefix: "Can't find your answer here? ",
    sendFeedbackLink: "Send us feedback",
    introSuffix: ".",
    privacyNotePrefix: "See the ",
    privacyLinkText: "privacy policy",
    privacyNoteSuffix: " for details on what data is processed.",
    backButton: "← Back to the converter",
    entries: FAQ_ENTRIES,
  },
  languageSwitcherLabel: "Language",
};
