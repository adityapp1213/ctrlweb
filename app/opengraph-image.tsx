import { ImageResponse } from "next/og";

export const alt = "Ctrl by atom";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f2ea",
          color: "#111111",
          position: "relative",
          overflow: "hidden",
          padding: "58px 68px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "36px",
            borderRadius: "30px",
            border: "1px solid rgba(17,17,17,0.08)",
            background: "rgba(255,255,255,0.68)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <svg
              width="62"
              height="62"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse
                cx="32"
                cy="32"
                rx="22"
                ry="10"
                stroke="#111111"
                strokeWidth="3.3"
                strokeLinecap="round"
                transform="rotate(45 32 32)"
              />
              <ellipse
                cx="32"
                cy="32"
                rx="22"
                ry="10"
                stroke="#111111"
                strokeWidth="3.3"
                strokeLinecap="round"
                transform="rotate(-45 32 32)"
              />
            </svg>
            <div
              style={{
                fontSize: 54,
                letterSpacing: "0.08em",
              }}
            >
              Ctrl
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "860px",
            }}
          >
            <div
              style={{
                fontSize: 92,
                lineHeight: 1.02,
                letterSpacing: "-0.055em",
              }}
            >
              Thought-grounded multimodal intelligence, shaped for natural
              language.
            </div>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.4,
                color: "rgba(17,17,17,0.62)",
                maxWidth: "760px",
              }}
            >
              Ctrl brings together research, memory, and a calm companion layer
              so advanced models feel readable, steady, and human to work with.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 24,
              color: "rgba(17,17,17,0.54)",
            }}
          >
            <div>atomctrl.com</div>
            <div>Cloudy • Monarch • Research</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
