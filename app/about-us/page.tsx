import { AboutUsGallery } from "@/app/about-us/about-us-gallery";
import { BlankRouteShell } from "@/components/blank-route-shell";

export function AboutUsSection() {
  return (
    <section
      id="about-us"
      className="relative z-10 scroll-mt-28 overflow-x-clip bg-white px-4 pb-20 pt-0 sm:px-6 lg:pb-28"
    >
      <AboutUsGallery />
    </section>
  );
}

export default function AboutUsPage() {
  return <BlankRouteShell />;
}
