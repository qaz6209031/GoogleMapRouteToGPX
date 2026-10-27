import { ImageResponse } from "next/og";

export const alt = "Google Maps Route to GPX File";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.2,
          }}
        >
          Google Maps Route → GPX File
        </div>
        <div
          style={{
            fontSize: 32,
            marginTop: 32,
            opacity: 0.85,
          }}
        >
          maptogpx.com
        </div>
      </div>
    ),
    { ...size }
  );
}
