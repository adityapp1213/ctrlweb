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
        <span className="absolute -left-16 -top-12 [animation:loader-butterfly-drift_2.8s_ease-in-out_infinite]">
          <FlappingButterfly
            className="size-20 rotate-[-14deg] opacity-80"
            frameDelay={80}
          />
        </span>

        <span className="absolute -right-16 top-10 [animation:loader-butterfly-drift_3.2s_ease-in-out_infinite_180ms]">
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