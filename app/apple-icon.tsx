import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f2ea",
          borderRadius: "34px",
        }}
      >
        <svg
          width="112"
          height="112"
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
            strokeWidth="3.4"
            strokeLinecap="round"
            transform="rotate(45 32 32)"
          />
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="10"
            stroke="#111111"
            strokeWidth="3.4"
            strokeLinecap="round"
            transform="rotate(-45 32 32)"
          />
        </svg>
      </div>
    ),
    size
  );
}
