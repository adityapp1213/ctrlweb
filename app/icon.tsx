import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
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
        }}
      >
        <svg
          width="44"
          height="44"
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
