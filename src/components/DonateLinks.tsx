"use client";

import { trackEvent } from "@/lib/analytics";

export default function DonateLinks() {
  return (
    <>
      <a
        href="https://venmo.com/KaiChin-Huang"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("donate_click", { site: "maptogpx", link: "venmo" })}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008CFF] hover:bg-[#0074D4] text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/20"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.5 3.5c.8 1.3 1.2 2.7 1.2 4.3 0 5.3-4.5 12.2-8.2 17H6.2L3.3 3.9l5.6-.5 1.6 12.8c1.5-2.4 3.3-6.2 3.3-8.8 0-1.5-.3-2.5-.6-3.3l6.3-.6z" />
        </svg>
        Venmo
      </a>
      <a
        href="https://www.paypal.com/donate/?business=9B232DHXN8ME4&no_recurring=0&currency_code=USD&item_name=MapsToGPX"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("donate_click", { site: "maptogpx", link: "paypal" })}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002060] text-white font-semibold text-sm transition-colors shadow-md shadow-blue-900/20"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 2.56A.859.859 0 015.79 1.84h6.436c2.022 0 3.615.49 4.55 1.595.438.518.729 1.104.868 1.744.145.66.132 1.447-.04 2.405l-.01.061v.463l.36.204c.305.164.55.357.738.578.316.372.52.838.607 1.388.09.567.06 1.226-.09 1.96-.172.844-.453 1.579-.836 2.184a4.61 4.61 0 01-1.313 1.39c-.524.364-1.147.634-1.85.804-.684.164-1.46.247-2.308.247h-.548a1.15 1.15 0 00-1.135.97l-.028.16-.47 2.982-.021.115a.143.143 0 01-.141.12H7.076z" />
        </svg>
        PayPal
      </a>
    </>
  );
}
