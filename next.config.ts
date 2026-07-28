import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "lab.atomctrl.com",
          },
        ],
        destination: "/lab",
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "lab.atomctrl.com",
          },
        ],
        destination: "/lab/:path*",
      },
    ];
  },
};

export default nextConfig;
