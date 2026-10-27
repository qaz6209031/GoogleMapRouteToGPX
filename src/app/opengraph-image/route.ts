import OpenGraphImage from "@/components/OpenGraphImage";

// One stable URL shared by every locale's explicit social-image metadata.
export const dynamic = "force-static";

export function GET() {
  return OpenGraphImage();
}
