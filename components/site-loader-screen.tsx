"use client";

function Spin() {
  return (
    <div className="relative aspect-square w-[65px]">
      <span className="site-loader-spin absolute rounded-[50px]" />
      <span className="site-loader-spin site-loader-spin-delay absolute rounded-[50px]" />
    </div>
  );
}

export function SiteLoaderScreen({
  visible = true,
}: {
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
      <Spin />
    </div>
  );
}
