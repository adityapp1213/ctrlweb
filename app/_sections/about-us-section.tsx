import Image from "next/image";
import { AboutUsGallery } from "@/app/_sections/about-us-gallery";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-4 pb-0 pt-0 sm:px-6 sm:pb-20 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full bg-[url('/assets/mobilecloud1.png')] bg-[length:175%_auto] bg-top bg-no-repeat sm:hidden"
      />
      <Image
        src="/assets/cloud5.2.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none hidden object-cover sm:block"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <AboutUsGallery />
      </div>
    </section>
  );
}
