"use client";

import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/butterfly/flapping-butterfly";
import { Spin } from "@/components/site-preloader";

export function SiteLoaderScreen({
  visible = true,
}: {
  progress?: number;
  visible?: boolean;
}) {
  return (
    <div
      className={[
        "fixed inset-0 z-[200] flex items-center justify-center bg-[#f7f2ea] px-6 transition-opacity duration-500 ease-out",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-live="polite"
      aria-busy={visible}
    >
      <div className="relative flex items-center justify-center">
        <span className="site-loader-butterfly-left absolute -left-16 -top-12">
          <FlappingButterfly
            className="size-20 rotate-[-14deg] opacity-80"
            frameDelay={80}
          />
        </span>

        <span className="site-loader-butterfly-right absolute -right-16 top-10">
          <InvertedFlappingButterfly
            className="size-20 rotate-[10deg] opacity-75"
            frameDelay={180}
          />
        </span>

        <Spin />
      </div>
    </div>
  );
}
