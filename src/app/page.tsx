import ConverterForm from "@/components/ConverterForm";

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "No Account Needed",
    description: "Unlike other tools, we don't ask for your email or make you create an account. Just paste a URL and download your GPX — instantly.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: "Cycling-Optimized Routes",
    description: "Routes are generated using OSRM's bicycle profile for roads and paths suited to cycling.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: "Elevation Data Included",
    description: "Automatic elevation profiles from Open-Meteo so your bike computer shows climbs and descents.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Universal Compatibility",
    description: "Standard GPX 1.1 format works with Garmin, Bryton, Wahoo, and any device that reads GPX.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Trusted by Thousands",
    description: "Used by 2,000+ cyclists worldwide. No sign-up, no tracking, no hidden costs — just GPX files.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "All URL Formats",
    description: "Supports long URLs, short links (goo.gl), addresses, coordinates, and multi-stop routes.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
              </svg>
            </div>
            <span className="font-semibold text-zinc-900 text-lg">
              MapsToGPX
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <a
              href="#how-it-works"
              className="px-3 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors rounded-lg hover:bg-zinc-100"
            >
              How It Works
            </a>
          </nav>
        </div>
      </header>

      {/* Hero + Converter */}
      <section className="hero-gradient flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-24">
          {/* Hero text */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium mb-6">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/women/90.jpg" alt="" className="w-6 h-6 rounded-full border-2 border-white" />
              </div>
              <span>Loved by 2K+ cyclists in 50+ countries</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-4 leading-[1.1]">
              Google Maps Route
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                to GPX File
              </span>
            </h1>
            <p className="text-lg text-zinc-500 max-w-lg mx-auto leading-relaxed">
              Convert any Google Maps directions URL into a GPX file
              ready for your Garmin, Bryton, or Wahoo bike computer.
              <span className="block mt-2 text-base font-medium text-zinc-700">
                No sign-up. No email. Just paste and go.
              </span>
            </p>
          </div>

          {/* Converter */}
          <ConverterForm />

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              GPX 1.1 Standard
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Bicycle-optimized routing
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Elevation data included
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No sign-up required
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-zinc-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">
                Why MapsToGPX?
              </h2>
              <p className="text-zinc-500 max-w-lg mx-auto">
                Everything you need to get your Google Maps routes onto your bike computer.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="border-t border-zinc-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3">
                How It Works
              </h2>
              <p className="text-zinc-500 max-w-lg mx-auto">
                Three simple steps from Google Maps to your bike computer.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Plan your route",
                  description: "Open Google Maps, create a directions route, and copy the URL from your browser's address bar.",
                },
                {
                  step: "2",
                  title: "Convert to GPX",
                  description: "Paste the URL above and click Convert. We'll generate a cycling-optimized GPX file with elevation data.",
                },
                {
                  step: "3",
                  title: "Ride!",
                  description: "Download the GPX file and import it into Garmin Connect, Bryton Active, Wahoo app, or any compatible device.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-zinc-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Donate banner */}
      <div className="border-t border-zinc-200 bg-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            Enjoy MapsToGPX? Buy me a coffee!
          </h3>
          <p className="text-sm text-zinc-500 mb-4 max-w-md mx-auto">
            Built by a fellow cyclist who got tired of complicated tools. This app is free and always will be. If it saved you time, consider supporting its development.
          </p>
          <a
            href="https://venmo.com/KaiChin-Huang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#0074D4] text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 3.5c.8 1.3 1.2 2.7 1.2 4.3 0 5.3-4.5 12.2-8.2 17H6.2L3.3 3.9l5.6-.5 1.6 12.8c1.5-2.4 3.3-6.2 3.3-8.8 0-1.5-.3-2.5-.6-3.3l6.3-.6z" />
            </svg>
            Donate via Venmo
          </a>
          <p className="mt-2 text-xs text-zinc-400">@KaiChin-Huang on Venmo</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col items-center gap-5">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-600">MapsToGPX</span>
            </div>

            {/* Creator info */}
            <p className="text-sm text-zinc-500">
              Built by cyclist &amp; developer{" "}
              <a
                href="https://kaichin.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-700 hover:text-blue-600 underline underline-offset-2 transition-colors"
              >
                Kai-Chin Huang
              </a>
            </p>

            {/* Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://kaichin.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                kaichin.dev
              </a>
              <a
                href="https://www.linkedin.com/in/kai-chin-huang-6938b2170/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>

            <p className="text-xs text-zinc-400">
              Free forever. Trusted by cyclists worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
