import DeviceLandingPage, { landingMetadata } from "@/components/DeviceLandingPage";
import { getLandingPage } from "@/lib/landing-pages";

const page = getLandingPage("google-maps-to-bryton");

export const metadata = landingMetadata(page);

export default function Page() {
  return <DeviceLandingPage page={page} />;
}
