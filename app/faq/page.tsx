import type { Metadata } from "next";
import { serializeJsonLd } from "@/lib/seo";
import { FaqAccordion } from "./faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about Atom Ctrl, Monarch, thought-grounded models, multimodal reasoning, memory, and research access.",
  alternates: {
    canonical: "/faq",
  },
};

const faqItems = [
  {
    id: "item-0",
    question: "What is Atom Ctrl?",
    answer:
      "Atom Ctrl is an AI research lab building Thinking Machines that can understand, reason, and learn from the world.",
  },
{
  id: "item-2",
  question: "What is Monarch?",
  answer:
    "Monarch is Atom Ctrl's family of thought-grounded multimodal models. The research explores structured thought, persistent state, explicit memory, specialist processing, and reasoning before output.",
},
{
  id: "item-3",
  question: "What are thought-grounded models?",
  answer:
    "Thought-grounded models form an internal representation of meaning before producing an answer. Atom Ctrl studies whether this separation can make multimodal reasoning more reliable and adaptable.",
},
{
  id: "item-4",
  question: "What does Atom Ctrl research?",
  answer:
    "Atom Ctrl researches thought-grounded multimodal intelligence, memory and persistent state, hybrid local-cloud systems, real-time interaction, and synthetic training data.",
},
{
  id: "item-5",
  question: "How can I follow Atom Ctrl's work?",
  answer:
    "Read the research briefs on this site or join the waitlist for updates and access as Atom Ctrl's work develops.",
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
      className="relative z-10 scroll-mt-28 bg-white px-4 pb-10 pt-0 sm:px-6 sm:pb-12 lg:pb-14 lg:pt-0"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
      />

      <div className="mx-auto w-full max-w-4xl px-2 sm:px-0">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          
          <h2 className="max-w-3xl text-4xl font-medium leading-tight text-black sm:text-5xl lg:text-6xl">
            Got questions about Atom Ctrl?
            <br className="hidden sm:block" />
            We&apos;ve got answers.
          </h2>
          
        </div>

        <FaqAccordion items={faqItems} />
      </div>
    </section>
  );
}

export default function FaqPage() {
  return <FaqSection />;
}
