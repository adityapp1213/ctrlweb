"use client";

import InfiniteGallery from "@/components/ui/3d-gallery-photography";

const galleryImages = [
  { src: "/assets/main-component/1.png", alt: "" },
  { src: "/assets/main-component/2.png", alt: "" },
  { src: "/assets/main-component/3.png", alt: "" },
  { src: "/assets/main-component/4.png", alt: "" },
  { src: "/assets/main-component/5.png", alt: "" },
  { src: "/assets/main-component/6.png", alt: "" },
];

export function WorldThinkingModelsSection() {
  return (
    <section
      id="world-thinking-models"
      className="relative z-[70] h-[125vh] bg-white"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <h2
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center text-5xl leading-[0.9] tracking-normal text-white mix-blend-exclusion sm:text-6xl md:text-8xl"
        >
          world thinking models
        </h2>
        <InfiniteGallery images={galleryImages} className="h-full w-full" visibleCount={6} />
      </div>
    </section>
  );
}
