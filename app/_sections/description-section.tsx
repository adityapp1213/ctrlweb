import Image from "next/image";
import { ScrollProgressStory } from "@/components/ui/main/scroll-progress-story";

const descriptionStanzas = [
  "atom ctrl is an ai research lab building thinking machines that can understand, reason, and learn from the world.",
  "world models exist because llms were never actually built for that. they were built to imitate intelligence, not have it. trained to generate what a helpful answer looks like, not to understand it. good at sounding right, built to please, not to reason.",
  "monarch v-2 is built from the ground up to do the opposite. it connects concepts and ideas to form a thought, not just tokens, an internal rough draft it can reason with, learn from, and adapt before it speaks.",
  "we're not trying to make a better chatbot. we want to build machines that are built for thinking harder.",
];

export function DescriptionSection() {
  return (
    <section
      id="description"
      className="relative z-[80] -mt-24 min-h-screen scroll-mt-28 overflow-visible bg-white px-4 py-16 sm:px-6"
    >
      <Image
        src="/assets/cloud3.1.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover sm:hidden"
        aria-hidden="true"
      />
      <Image
        src="/assets/cloud1.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none hidden object-cover opacity-55 sm:block"
        aria-hidden="true"
      />
      <div className="relative z-[90]">
        <ScrollProgressStory
          stanzas={descriptionStanzas}
          dottedWords={{}}
          dottedPhrases={{ "monarch v-2": "/research" }}
        />
      </div>
    </section>
  );
}
