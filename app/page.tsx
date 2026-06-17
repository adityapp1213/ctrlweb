import { Hero } from "@/components/hero";
import { Section2 } from "@/app/section-2/page";
import { Section3 } from "@/app/section-3/page";
import { Section4 } from "@/app/section-4/page";
import { Section5 } from "@/app/section-5/page";
import { Section6 } from "@/app/section-6/page";
import { Section7 } from "@/app/section-7/page";

export default function Home() {
  return (
    <>
      <Hero />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
    </>
  );
}
