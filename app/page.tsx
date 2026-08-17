import { Hero } from "@/components/hero";
import { DescriptionSection } from "@/app/_sections/description-section";
import { WhyCtrlSection } from "@/app/_sections/why-ctrl-section";
import { ResearchSection } from "@/app/_sections/research-section";
import { AboutUsSection } from "@/app/_sections/about-us-section";
import { FaqSection } from "@/app/_sections/faq-section";
import { FooterSection } from "@/components/footer-section";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        atom ctrl, an ai research lab building thinking machines
      </h1>
      <Hero />
      <DescriptionSection />
      <WhyCtrlSection />
      <ResearchSection />
      <AboutUsSection />
      <FaqSection />
      <FooterSection />
    </>
  );
}
