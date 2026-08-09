import Image from "next/image";
import { serializeJsonLd } from "@/lib/seo";
import { FaqAccordion } from "@/app/_sections/faq-accordion";

const faqItems = [
  {
    id: "item-0",
    question: "what is atom ctrl?",
    answer:
      "atom ctrl is an ai research lab building thinking machines that can understand, reason, and learn from the world.",
  },
{
  id: "item-2",
  question: "what is monarch?",
  answer:
    "monarch is atom ctrl's family of thought-grounded multimodal models. the research explores structured thought, persistent state, explicit memory, specialist processing, and reasoning before output.",
},
{
  id: "item-3",
  question: "what are thought-grounded models?",
  answer:
    "thought-grounded models form an internal representation of meaning before producing an answer. atom ctrl studies whether this separation can make multimodal reasoning more reliable and adaptable.",
},
{
  id: "item-4",
  question: "what does atom ctrl research?",
  answer:
    "atom ctrl researches thought-grounded multimodal intelligence, memory and persistent state, hybrid local-cloud systems, real-time interaction, and synthetic training data.",
},
{
  id: "item-5",
  question: "how can i follow atom ctrl's work?",
  answer:
    "read the research briefs on this site or join the waitlist for updates and access as atom ctrl's work develops.",
},
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-4 pb-10 pt-0 sm:px-6 sm:pb-12 lg:pb-14 lg:pt-0"
    >
      <Image
        src="/assets/cloud3.1.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
        aria-hidden="true"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-2 sm:px-0">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          
          <h2 className="max-w-3xl text-4xl font-medium leading-tight text-black sm:text-5xl lg:text-6xl">
            got questions about atom ctrl?
            <br className="hidden sm:block" />
            we&apos;ve got answers.
          </h2>
          
        </div>

        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
}
