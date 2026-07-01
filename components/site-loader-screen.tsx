"use client";

import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/butterfly/flapping-butterfly";

function Spin() {
  return (
    <div className="relative aspect-square w-[65px]">
      <span className="site-loader-spin absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100" />
      <span className="site-loader-spin site-loader-spin-delay absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100" />
    </div>
  );
}

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
        <Spin />

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
      </div>
    </div>
  );
}
