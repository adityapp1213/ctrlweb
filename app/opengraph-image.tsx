import { ImageResponse } from "next/og";

export const alt = "atom ctrl";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const siteDescription =
  "Ctrl is atom's natural-language interface for thought-grounded multimodal intelligence, memory systems, and research.";

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
          background: "#f8f4ed",
          color: "#111111",
          position: "relative",
          overflow: "hidden",
          padding: "54px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(226,104,125,0.2), transparent 28%), radial-gradient(circle at 86% 80%, rgba(226,104,125,0.14), transparent 30%)",
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "54px",
            borderRadius: "34px",
            border: "1px solid rgba(17,17,17,0.09)",
            background: "rgba(255,255,255,0.72)",
            padding: "58px 66px",
            position: "relative",
          }}
        >
          <svg
            width="150"
            height="150"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ flexShrink: 0 }}
          >
            <ellipse
              cx="32"
              cy="32"
              rx="22"
              ry="10"
              stroke="rgba(17,17,17,0.62)"
              strokeWidth="3"
              strokeLinecap="round"
              transform="rotate(45 32 32)"
            />
            <ellipse
              cx="32"
              cy="32"
              rx="22"
              ry="10"
              stroke="#111111"
              strokeWidth="3"
              strokeLinecap="round"
              transform="rotate(-45 32 32)"
            />
          </svg>

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
                fontSize: 94,
                lineHeight: 0.95,
                letterSpacing: "-0.055em",
              }}
            >
              atom ctrl
            </div>
            <div
              style={{
                maxWidth: "760px",
                fontSize: 34,
                lineHeight: 1.32,
                color: "rgba(17,17,17,0.64)",
              }}
            >
              {siteDescription}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
