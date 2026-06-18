import { Hero } from "@/components/hero";
import { DescriptionSection } from "@/app/description/page";
import { FeaturesSection } from "@/app/features/page";
import { WhyCtrlSection } from "@/app/why-ctrl/page";
import { ResearchSection } from "@/app/research/page";
import { AboutUsSection } from "@/app/about-us/page";
import { FooterSection } from "@/app/footer/page";

export default function Home() {
  return (
    <>
      <Hero />
      <DescriptionSection />
      <FeaturesSection />
      <WhyCtrlSection />
      <ResearchSection />
      <AboutUsSection />
      <FooterSection />
    </>
  );
}
