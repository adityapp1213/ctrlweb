import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE_DESCRIPTION } from "@/lib/seo";

export const alt = "atom ctrl, ai research lab";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const logoMarkUrl = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public", "logo-mark.png"),
).toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#111111",
          position: "relative",
          overflow: "hidden",
          padding: "54px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
            borderRadius: "34px",
            border: "1px solid rgba(17,17,17,0.09)",
            background: "rgba(255,255,255,0.72)",
            padding: "54px 60px",
            position: "relative",
          }}
        >
          <img
            src={logoMarkUrl}
            alt="atom ctrl logo mark"
            width={150}
            height={150}
            style={{
              width: 150,
              height: 150,
              flexShrink: 0,
              borderRadius: 34,
              objectFit: "contain",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "22px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: 76,
                lineHeight: 0.95,
                letterSpacing: "-0.055em",
              }}
            >
              atom ctrl - world thinking machines
            </div>
            <div
              style={{
                maxWidth: "760px",
                fontSize: 30,
                lineHeight: 1.32,
                color: "rgba(17,17,17,0.64)",
              }}
            >
              {SITE_DESCRIPTION}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
