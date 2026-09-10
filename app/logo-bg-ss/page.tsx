import type { Metadata } from "next";
import { GeistPixelCircle } from "geist/font/pixel";

export const metadata: Metadata = {
  title: "Logo preview",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LogoBackgroundPreviewPage() {
  return (
    <main className="logo-bg-ss-page">
      <div className="logo-bg-ss-inner">
        <div className={`logo-bg-ss-wordmark ${GeistPixelCircle.className}`}>a</div>
      </div>
    </main>
  );
}
