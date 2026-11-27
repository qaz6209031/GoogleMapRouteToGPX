/** Google AdSense site-ownership / loader snippet, rendered inside <head>. */
export const ADSENSE_CLIENT = "ca-pub-3570668644518301";

export default function AdSenseScript() {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
