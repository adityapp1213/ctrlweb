import { Hero } from "@/components/hero";
import { DescriptionSection } from "@/app/description/page";
import { FeaturesSection } from "@/app/features/page";
import { WhyCtrlSection } from "@/app/why-ctrl/page";
import { ResearchSection } from "@/app/research/page";
import { AboutUsSection } from "@/app/about-us/page";
import { FaqSection } from "@/app/faq/page";
import { FooterSection } from "@/app/footer/page";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        Atom Ctrl, an AI research lab building Thinking Machines
      </h1>
      <Hero />
      <DescriptionSection />
      <FeaturesSection />
      <WhyCtrlSection />
      <ResearchSection />
      <AboutUsSection />
      <FaqSection />
      <FooterSection />
    </>
  );
}
