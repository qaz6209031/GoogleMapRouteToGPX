export interface GuideSource {
  label: string;
  url: string;
}

export interface GuideStep {
  name: string;
  text: string;
}

export interface GuideMethod {
  /** Short machine-friendly id, e.g. "phone-app" or "web". */
  id: string;
  title: string;
  steps: GuideStep[];
}

export interface DeviceGuide {
  slug: string;
  /** Display name used in running text and FAQ links, e.g. "Hammerhead Karoo". */
  device: string;
  title: string;
  description: string;
  intro: string;
  methods: GuideMethod[];
  tips: string[];
  sources: GuideSource[];
  lastReviewed: string;
}

const CONVERT_STEP: GuideStep = {
  name: "Convert the route on MapsToGPX",
  text: "Copy the Google Maps directions link, paste it into MapsToGPX, and download the .gpx file it generates.",
};

const LAST_REVIEWED = "2026-10-27";

export const DEVICE_GUIDES: DeviceGuide[] = [
  {
    slug: "bryton",
    device: "Bryton",
    title: "How to load a Google Maps route onto a Bryton bike computer",
    description:
      "Step-by-step instructions for getting a Google Maps route onto a Bryton Rider (e.g. the Rider S510) via the Bryton Active app.",
    intro:
      "Bryton bike computers such as the Rider S510 don't accept a GPX file directly — you import it into the Bryton Active app on your phone first, then send it to the device from there.",
    methods: [
      {
        id: "phone-app",
        title: "Import via the Bryton Active app",
        steps: [
          CONVERT_STEP,
          {
            name: "Open the GPX file with Bryton Active",
            text: 'On iOS, use "Open in Active" (or long-press the GPX file and share it to the Bryton Active App). On Android, use "Open files with Bryton Active App" or choose "Open with" Bryton Active App.',
          },
          {
            name: "Download the route to your device",
            text: 'In the Bryton Active app, go to Course > My Route(s), select the route, tap the "..." button (or the settings button) at the top right, and choose "Download to Device". Your phone needs to be paired with your Bryton device in the app for this to work.',
          },
          {
            name: "Start navigation on the device",
            text: "On the Bryton device, go to Main Menu > Navigation > Route, then select the route to start navigating it.",
          },
        ],
      },
    ],
    tips: [
      "Make sure the Bryton Active app is updated to the latest version.",
      "Keep your phone paired and synced with the device in the app.",
      "If the GPX file doesn't appear as an option, re-share it from your phone's Files app.",
      "Long routes can take a while to transfer to the device — give it a moment.",
    ],
    sources: [
      {
        label: "Rider S510 user manual (PDF)",
        url: "https://www.brytonsport.cz/user/documents/upload/UM_S510_EN_compressed_2.pdf",
      },
      {
        label: "Bryton: Three easy ways to import and plan cycling routes",
        url: "https://www.brytonsport.com.tw/en/blogs/article/bike-computer-classroom-three-easy-ways-to-import-and-plan-cycling-routes",
      },
    ],
    lastReviewed: LAST_REVIEWED,
  },
  {
    slug: "wahoo",
    device: "Wahoo",
    title: "How to load a Google Maps route onto a Wahoo ELEMNT",
    description:
      "How to get a Google Maps route onto a Wahoo ELEMNT ACE, BOLT 3, or ROAM 3 (and older ELEMNT/BOLT/ROAM models) by importing a GPX file.",
    intro:
      "The Wahoo app doesn't have its own route builder, so importing a GPX file — like the one MapsToGPX generates from your Google Maps route — is the way to get a custom route onto an ELEMNT.",
    methods: [
      {
        id: "phone-app",
        title: "Import via the Wahoo app (ELEMNT ACE, BOLT 3, ROAM 3)",
        steps: [
          CONVERT_STEP,
          {
            name: "Import the GPX into the Wahoo app",
            text: 'Open or share the downloaded .gpx file with the Wahoo app. When prompted "Import file into Wahoo Fitness app?", tap Yes, then Close. You can also import from inside the app via "+ Add" > "Import a file".',
          },
          {
            name: "Send the route to your device",
            text: 'Go to the Explore tab > My Collection > My Routes (on ELEMNT ACE, this is under the Plan tab > My Routes instead), open the route, and tap "Send to ELEMNT". Your computer needs to be paired and connected, and your phone needs a data connection.',
          },
        ],
      },
      {
        id: "older-app",
        title: "Older ELEMNT / BOLT / ROAM (ELEMNT companion app)",
        steps: [
          CONVERT_STEP,
          {
            name: "Open the file with the ELEMNT app",
            text: "Open the downloaded GPX file with the ELEMNT companion app to import it as a route.",
          },
        ],
      },
    ],
    tips: [
      "Your bike computer needs to be paired and connected to the Wahoo app, and your phone needs a data connection, for the route to transfer.",
    ],
    sources: [
      {
        label: "Wahoo Support: Importing Routes & Workouts Into the Wahoo App",
        url: "https://support.wahoofitness.com/hc/en-us/articles/25936827245970",
      },
      {
        label: "Wahoo Support: Using the ELEMNT App (older ELEMNT/BOLT/ROAM)",
        url: "https://support.wahoofitness.com/hc/en-us/articles/20582927265042",
      },
      {
        label: "Wahoo Support: Creating Routes & Workouts",
        url: "https://support.wahoofitness.com/hc/en-us/articles/22710659712658",
      },
    ],
    lastReviewed: LAST_REVIEWED,
  },
  {
    slug: "garmin",
    device: "Garmin",
    title: "How to load a Google Maps route onto a Garmin Edge or watch",
    description:
      "How to import a Google Maps route as a Course in Garmin Connect and send it to a compatible Edge device or watch.",
    intro:
      'Garmin Connect can import a GPX file from another site or app — such as MapsToGPX — as a Course, which you then send to a compatible device. Make sure you import it as a Course, not an Activity; those are handled differently in Garmin Connect. Check the linked Garmin support article for the exact menu names on your model.',
    methods: [
      {
        id: "web",
        title: "Garmin Connect on the web",
        steps: [
          CONVERT_STEP,
          {
            name: "Import the course",
            text: "In Garmin Connect on the web, go to Training & Planning > Courses and choose Import…, then select the downloaded .gpx file.",
          },
          {
            name: "Pick a course type and save",
            text: "Choose a course type (e.g. cycling) and save the course.",
          },
          {
            name: "Send it to your device",
            text: 'Open the course and choose "Send to Device". It transfers to your Edge device or watch on its next sync.',
          },
        ],
      },
      {
        id: "phone-app",
        title: "Garmin Connect mobile app",
        steps: [
          CONVERT_STEP,
          {
            name: "Import the course",
            text: "Open or share the downloaded .gpx file with the Garmin Connect app to import it as a course.",
          },
          {
            name: "Send it to your device",
            text: "From the app, send the course to your paired Garmin device.",
          },
        ],
      },
    ],
    tips: [
      "Import the GPX as a Course, not an Activity — Garmin Connect treats the two differently.",
      "Menu names vary slightly by device model; check the linked Garmin support article if yours differs.",
    ],
    sources: [
      {
        label: "Garmin Support: Importing a Third-Party Course into Garmin Connect",
        url: "https://support.garmin.com/en-US/?faq=wKuZXCaZRP4mWPX5aRz5h5",
      },
    ],
    lastReviewed: LAST_REVIEWED,
  },
  {
    slug: "karoo",
    device: "Hammerhead Karoo",
    title: "How to load a Google Maps route onto a Hammerhead Karoo",
    description:
      "How to import a Google Maps route into the Hammerhead Dashboard or Companion App and sync it to a Karoo bike computer.",
    intro:
      "A GPX route can be imported into your Hammerhead account from the web dashboard or the Companion App, then pulled onto the Karoo itself with a sync.",
    methods: [
      {
        id: "web",
        title: "Hammerhead Dashboard (web)",
        steps: [
          CONVERT_STEP,
          {
            name: "Import the route",
            text: "In the Hammerhead Dashboard, go to Routes > New Route > Import, then upload or drag-and-drop the downloaded .gpx file.",
          },
          {
            name: "Sync the route to your Karoo",
            text: "On the Karoo, go to Apps > Routes > ●●● (more) and choose Sync to pull the new route onto the device.",
          },
        ],
      },
      {
        id: "phone-app",
        title: "Hammerhead Companion App",
        steps: [
          CONVERT_STEP,
          {
            name: "Share the file to the Companion App",
            text: "Share the downloaded .gpx file to the Hammerhead Companion App. Your phone needs an internet connection for the import to complete.",
          },
          {
            name: "Sync the route to your Karoo",
            text: "On the Karoo, go to Apps > Routes > ●●● (more) and choose Sync to pull the new route onto the device.",
          },
        ],
      },
    ],
    tips: [
      "The phone needs an internet connection to import a route through the Companion App.",
      "The route won't appear on the Karoo until you sync it from Apps > Routes > ●●● (more) > Sync.",
    ],
    sources: [
      {
        label: "Hammerhead Support: Importing Routes on the Dashboard",
        url: "https://support.hammerhead.io/hc/en-us/articles/360004171654",
      },
      {
        label: "Hammerhead Support: Importing Routes on the Companion App",
        url: "https://support.hammerhead.io/hc/en-us/articles/25476943333275",
      },
      {
        label: "Hammerhead Support: Syncing Routes to Karoo",
        url: "https://support.hammerhead.io/hc/en-us/articles/25656541387035",
      },
    ],
    lastReviewed: LAST_REVIEWED,
  },
  {
    slug: "coros",
    device: "COROS",
    title: "How to load a Google Maps route onto a COROS watch",
    description:
      "How to import a Google Maps route into the COROS app and send it to a COROS watch for navigation.",
    intro:
      "The COROS app saves imported GPX files to your route library (My Collection), from where you can push a route to a paired COROS watch.",
    methods: [
      {
        id: "phone-app",
        title: "Import via the COROS app",
        steps: [
          CONVERT_STEP,
          {
            name: "Open the GPX file with the COROS app",
            text: "Open the downloaded .gpx file with the COROS app and tap Save. It's added to your route library (My Collection).",
          },
          {
            name: "Send the route to your watch",
            text: "In the app, go to Profile > your device > My Routes > + and pick the route from your library to send it to the watch.",
          },
          {
            name: "Start the route on the watch",
            text: "On the watch, find the route under Navigation (long-press the back button > Toolbox > Navigation).",
          },
        ],
      },
    ],
    tips: [
      "The imported file must be a standard GPX, KML, or FIT file.",
      "Supported watch models and route limits vary — see the COROS navigation support article linked below for your model.",
    ],
    sources: [
      {
        label: "COROS Support: Importing a Route",
        url: "https://support.coros.com/hc/en-us/articles/24181489692436",
      },
      {
        label: "COROS Support: Route Import Troubleshooting",
        url: "https://support.coros.com/hc/en-us/articles/360040243352",
      },
      {
        label: "COROS Support: Navigation & Routes",
        url: "https://support.coros.com/hc/en-us/articles/360040258231",
      },
    ],
    lastReviewed: LAST_REVIEWED,
  },
];

export const GUIDE_SLUGS: string[] = DEVICE_GUIDES.map((guide) => guide.slug);

export function getGuide(slug: string): DeviceGuide | undefined {
  return DEVICE_GUIDES.find((guide) => guide.slug === slug);
}
