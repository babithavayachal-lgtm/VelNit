import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/constants/site";

export const runtime = "edge";
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
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
          background: "linear-gradient(135deg, #0e4749 0%, #123f3f 60%, #0a2f30 100%)",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#faf7f2",
            textAlign: "center",
            display: "flex",
          }}
        >
          VelNit Life
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "#d4b26a",
            textAlign: "center",
            display: "flex",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
