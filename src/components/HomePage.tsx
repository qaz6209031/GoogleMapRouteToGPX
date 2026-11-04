import Link from "next/link";
import ConverterForm from "@/components/ConverterForm";
import FeedbackForm from "@/components/FeedbackForm";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MapGround from "@/components/sheet/MapGround";
import {
  FEATURE_SYMBOLS,
  FinishFlag,
  SiteMark,
  StartRing,
  ViaPoint,
} from "@/components/sheet/symbols";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locales";
import { localizedPath } from "@/i18n/paths";

/** Decorative faces for the user-count badge (kept from the original design). */
const BADGE_FACES = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/90.jpg",
];

const STEP_MARKERS = [StartRing, ViaPoint, FinishFlag];

const navLink =
  "underline-offset-4 decoration-2 decoration-route transition-colors hover:text-route hover:underline";
const sectionTitle =
  "font-lettering text-[clamp(2rem,3.6vw,2.875rem)] font-extrabold uppercase leading-[0.95] tracking-[0.005em] text-balance";

export default function HomePage({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const faqHref = localizedPath(locale, "/faq");
  const homeHref = localizedPath(locale, "/");

  return (
    <div className="map-sheet relative min-h-screen p-2.5 sm:p-7">
      <div className="map-face relative border-[1.5px] border-ink">
        <div aria-hidden="true" className="map-fold left-1/3 hidden lg:block" />
        <div aria-hidden="true" className="map-fold left-2/3 hidden lg:block" />

        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b-[1.5px] border-ink bg-paper px-3.5 sm:px-7">
          <Link
            href={homeHref}
            className="flex items-center gap-2 font-lettering text-[19px] font-extrabold uppercase tracking-[0.04em] sm:gap-2.5 sm:text-[22px]"
          >
            <SiteMark className="h-6 w-6 sm:h-7 sm:w-7" />
            <span>
              Maps<span className="text-route">To</span>GPX
            </span>
          </Link>
          <nav className="flex items-center gap-3 font-lettering text-[13px] font-semibold uppercase tracking-[0.08em] sm:gap-7 sm:text-[15px] sm:tracking-[0.12em]">
            <a href="#how-it-works" className={navLink}>
              {dict.nav.howItWorks}
            </a>
            <a href="#feedback" className={navLink}>
              {dict.nav.feedback}
            </a>
            <Link href={faqHref} className={navLink}>
              {dict.nav.faq}
            </Link>
          </nav>
        </header>

        {/* Redesign notice: one quiet strip, pointing at the feedback form */}
        <p className="relative flex flex-wrap items-center gap-x-3 gap-y-1 border-b-[1.5px] border-ink bg-paper px-3.5 py-2 text-[14px] leading-snug sm:px-7">
          <span className="bg-route px-1.5 py-0.5 font-lettering text-[12px] font-bold uppercase tracking-[0.12em] text-white">
            {dict.announcement.badge}
          </span>
          <span>{dict.announcement.text}</span>
          <a
            href="#feedback"
            className="font-semibold underline decoration-route decoration-2 underline-offset-4 transition-colors hover:text-route"
          >
            {dict.announcement.link}
          </a>
        </p>

        {/* First viewport: the sheet, the converter in its legend box, the route */}
        <section className="relative overflow-hidden border-b-[1.5px] border-ink">
          <MapGround className="map-ground absolute inset-0 h-full w-full" />
          <div className="relative mx-auto max-w-[88rem] px-4 pb-8 pt-9 sm:px-10 sm:pt-12 lg:px-14 lg:pb-12 lg:pt-14">
            <ConverterForm
              dict={dict.converterForm}
              donate={dict.donate}
              donateLinks={dict.donateLinks}
            >
              <h1
                className={`font-lettering font-extrabold uppercase text-balance ${
                  locale === "ja"
                    ? "text-[clamp(2.125rem,4.4vw,3.5rem)] leading-[1.15]"
                    : "text-[clamp(2.75rem,6.2vw,4.75rem)] leading-[0.9] tracking-[-0.005em]"
                }`}
              >
                {dict.hero.titleLine1}{" "}
                <span className="block text-route">{dict.hero.titleLine2}</span>
              </h1>
              <p className="mt-5 max-w-[46ch] text-[18px] leading-relaxed sm:text-[19px]">
                {dict.hero.subtitle}
              </p>
              <p className="mt-2 text-[17px] font-semibold">{dict.hero.subtitleBold}</p>
              <div className="mt-5 inline-flex w-fit max-w-full self-start items-center gap-3 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
                <div className="flex shrink-0 -space-x-2">
                  {BADGE_FACES.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element -- tiny decorative avatars, same as the original badge
                    <img key={src} src={src} alt="" className="h-6 w-6 rounded-full border-2 border-white" />
                  ))}
                </div>
                <span>{dict.hero.badge}</span>
              </div>
            </ConverterForm>
          </div>
          <ul className="relative flex flex-wrap gap-x-6 gap-y-1.5 border-t-[1.5px] border-ink bg-paper px-4 py-2.5 font-lettering text-[13px] font-semibold uppercase tracking-[0.14em] sm:px-7">
            {[
              dict.trustBadges.gpxStandard,
              dict.trustBadges.exactRoute,
              dict.trustBadges.allModes,
              dict.trustBadges.noSignup,
            ].map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 bg-route" />
                {badge}
              </li>
            ))}
          </ul>
        </section>

        <div className="relative overflow-hidden">
        <MapGround variant="quiet" className="map-ground-quiet absolute inset-0 h-full w-full" />
        {/* The legend: why MapsToGPX */}
        <section aria-labelledby="features-title" className="relative px-4 py-20 sm:px-10 lg:px-14 lg:py-28">
          <div className="mx-auto max-w-[88rem] overflow-hidden border-[1.5px] border-ink bg-paper">
            <div className="gap-10 border-b-[1.5px] border-ink px-5 py-6 sm:px-8 sm:py-7 lg:flex lg:items-end lg:justify-between">
              <h2 id="features-title" className={sectionTitle}>
                {dict.features.heading}
              </h2>
              <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-ink-soft lg:mt-0">
                {dict.features.subheading}
              </p>
            </div>
            <ul className="divide-y divide-ink/25">
              {dict.features.items.map((feature, i) => {
                const Symbol = FEATURE_SYMBOLS[i];
                return (
                  <li
                    key={feature.title}
                    className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-1 px-5 py-5 sm:px-8 lg:grid-cols-[2.5rem_minmax(0,17rem)_minmax(0,1fr)] lg:gap-x-8"
                  >
                    {Symbol && <Symbol className="row-span-2 h-10 w-10 lg:row-span-1" />}
                    <h3 className="pt-1.5 font-lettering text-[20px] font-bold uppercase leading-tight tracking-[0.02em] lg:pt-2">
                      {feature.title}
                    </h3>
                    <p className="max-w-[62ch] text-[15px] leading-relaxed text-ink-soft lg:pt-1.5">
                      {feature.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        </div>

        {/* The itinerary: how it works. Plain sheet, no ground: its copy spans every column. */}
        <section
          id="how-it-works"
          aria-labelledby="how-title"
          className="relative scroll-mt-16 px-4 pb-20 sm:px-10 lg:px-14 lg:pb-28"
        >
          <div className="mx-auto max-w-[88rem]">
            <h2 id="how-title" className={sectionTitle}>
              {dict.howItWorks.heading}
            </h2>
            <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed text-ink-soft">
              {dict.howItWorks.subheading}
            </p>
            <ol className="relative mt-12 grid gap-10 md:grid-cols-3 md:gap-10">
              <span
                aria-hidden="true"
                className="absolute bottom-6 left-[13px] top-3 w-1.5 bg-route md:bottom-auto md:left-3.5 md:right-[30%] md:top-[13px] md:h-1.5 md:w-auto"
              />
              {dict.howItWorks.steps.map((item, i) => {
                const Marker = STEP_MARKERS[i] ?? ViaPoint;
                return (
                  <li key={item.step} className="relative pl-14 md:pl-0 md:pt-14">
                    <Marker className="absolute left-0 top-0 h-8 w-8" />
                    <h3 className="font-lettering text-[24px] font-bold uppercase leading-tight tracking-[0.02em]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[38ch] text-[16px] leading-relaxed text-ink-soft">{item.description}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Map corrections: feedback */}
        <div className="relative overflow-hidden">
        <MapGround variant="quiet" className="map-ground-quiet map-ground-quiet-stacked absolute inset-0 h-full w-full" />
        <section
          id="feedback"
          aria-labelledby="feedback-title"
          className="relative scroll-mt-16 px-4 pb-20 sm:px-10 lg:px-14 lg:pb-28"
        >
          <div className="mx-auto grid max-w-[88rem] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,38rem)] lg:items-start lg:gap-14">
            <div>
              <h2 id="feedback-title" className={sectionTitle}>
                {dict.feedbackSection.heading}
              </h2>
              <p className="mt-3 max-w-[40ch] text-[16px] leading-relaxed text-ink-soft">
                {dict.feedbackSection.subheading}
              </p>
            </div>
            <div className="border-[1.5px] border-ink bg-paper">
              <FeedbackForm dict={dict.feedbackForm} />
            </div>
          </div>
        </section>

        </div>

        {/* Imprint */}
        <footer className="relative border-t-[1.5px] border-ink bg-paper px-4 py-8 sm:px-7">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <p className="flex items-center gap-2 font-lettering text-[18px] font-extrabold uppercase tracking-[0.04em]">
                <SiteMark className="h-6 w-6" />
                <span>
                  Maps<span className="text-route">To</span>GPX
                </span>
              </p>
              <p className="text-[15px] text-ink-soft">
                {dict.footer.builtBy}{" "}
                <a
                  href="https://kaichin.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline decoration-route decoration-2 underline-offset-4 hover:text-route"
                >
                  Kai-Chin Huang
                </a>
              </p>
              <p className="flex gap-5 font-lettering text-[15px] font-semibold uppercase tracking-[0.1em]">
                <a href="https://kaichin.dev/" target="_blank" rel="noopener noreferrer" className={navLink}>
                  kaichin.dev
                </a>
                <a
                  href="https://www.linkedin.com/in/kai-chin-huang-6938b2170/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={navLink}
                >
                  LinkedIn
                </a>
              </p>
            </div>
            <div className="space-y-3 lg:text-right">
              <p className="flex gap-5 font-lettering text-[15px] font-semibold uppercase tracking-[0.1em] lg:justify-end">
                <Link href={faqHref} className={navLink}>
                  {dict.footer.faqLink}
                </Link>
                <Link href="/privacy" className={navLink}>
                  {dict.footer.privacyLink}
                </Link>
              </p>
              <div className="lg:flex lg:justify-end">
                <LanguageSwitcher
                  currentLocale={locale}
                  page="/"
                  label={dict.languageSwitcherLabel}
                  tone="sheet"
                />
              </div>
              <p className="text-[13px] text-ink-soft">{dict.footer.tagline}</p>
            </div>
          </div>
        </footer>
      </div>
      <p
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 hidden h-7 items-center justify-center font-lettering text-[12px] font-semibold uppercase tracking-[0.24em] sm:flex"
      >
        MapsToGPX &nbsp;·&nbsp; maptogpx.com
      </p>
    </div>
  );
}
