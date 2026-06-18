"use client";

import { AtomLogo } from "@/components/logo";
import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/flapping-butterfly";

export function SiteLoaderScreen({
  progress,
  visible = true,
}: {
  progress?: number;
  visible?: boolean;
}) {
  const clampedProgress =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, Math.round(progress)))
      : undefined;

  return (
    <div
      className={[
        "fixed inset-0 z-[200] flex items-center justify-center bg-[#f7f2ea] px-6 transition-opacity duration-500 ease-out",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-live="polite"
      aria-busy={visible}
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="relative flex items-center gap-3 text-black sm:gap-4">
          <span className="absolute -left-14 -top-9 [animation:loader-butterfly-drift_2.8s_ease-in-out_infinite]">
            <FlappingButterfly
              className="size-20 rotate-[-14deg] opacity-80"
              frameDelay={80}
            />
          </span>
          <span className="absolute -right-12 top-8 [animation:loader-butterfly-drift_3.2s_ease-in-out_infinite_180ms]">
            <InvertedFlappingButterfly
              className="size-20 rotate-[10deg] opacity-75"
              frameDelay={180}
            />
          </span>
          <span className="[animation:loader-logo-sway_2.6s_ease-in-out_infinite]">
            <AtomLogo
              size={56}
              title="Ctrl atom logo"
              className="shrink-0 text-black sm:size-[64px]"
            />
          </span>
          <span className="shadows-into-light-regular text-[2.7rem] leading-none tracking-[0.04em] sm:text-[3.2rem]">
            Ctrl
          </span>
        </div>

        <div className="mt-10 w-full max-w-[16rem]">
          <div className="h-1.5 overflow-hidden rounded-full bg-black/8">
            <div
              className="h-full rounded-full bg-black transition-[width] duration-300 ease-out"
              style={{ width: `${clampedProgress ?? 18}%` }}
            />
          </div>
          <div className="mt-3 text-[0.82rem] tracking-[0.18em] text-black/35 uppercase">
            Loading
          </div>
        </div>
      </div>
    </div>
  );
}
