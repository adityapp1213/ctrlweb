import type { Metadata } from "next";
import Link from "next/link";
import { PixelHoverMark } from "@/components/pixel-hover-mark";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="not-found-page flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-[#0b0b0b] px-6 text-[#f7f7f5]">
      <PixelHoverMark
        text="404"
        as="h1"
        ariaLabel="404, page not found"
        className="not-found-mark relative text-[clamp(6rem,20vw,12rem)] leading-none"
      />
      <p className="not-found-message">This page could not be found.</p>
      <Link className="not-found-home-link text-sm underline underline-offset-4 transition-colors" href="/">
        ← back to home
      </Link>
    </main>
  );
}
