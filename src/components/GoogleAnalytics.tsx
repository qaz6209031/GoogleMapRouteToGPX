import Script from "next/script";
import { ANALYTICS_HOSTS, GA_MEASUREMENT_ID } from "@/lib/analytics";

export default function GoogleAnalytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
      >{`
        if (${JSON.stringify(ANALYTICS_HOSTS)}.includes(window.location.hostname)) {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () { window.dataLayer.push(arguments); };
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}', {
            allow_google_signals: false,
            allow_ad_personalization_signals: false
          });
        }
      `}</Script>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
