import type { Metadata } from "next";
import { FaqAccordion } from "./faq-accordion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions about Ctrl by atom, Monarch, thought-grounded models, memory, research, and early access.",
  alternates: {
    canonical: "/faq",
  },
};

const faqItems = [
  {
    id: "item-1",
    question: "What is Ctrl by atom?",
    answer:
      "Atom Ctrl is an AI research lab building Thinking Machines that can understand, reason, and learn from the world.",
  },
  {
    id: "item-2",
    question: "What is Monarch?",
    answer:
      "Monarch is atom's thought-grounded models family. We believe future AI systems should reason through problems instead of relying solely on pattern matching. Thought-grounded intelligence combines multimodal understanding, and world knowledge to enable more reliable and adaptable AI.",
  },
  {
    id: "item-3",
    question: "What makes Ctrl different from a normal chatbot?",
    answer:
      "Many AI systems are just next word predictors, which can be unreliable and struggle with complex tasks. Ctrl's thought-grounded models are designed to reason through problems, understand context, and learn from interactions, making them more useful for real-world applications.",
  },
  {
    id: "item-4",
    question: "What is the long-term vision for Atom Ctrl?",
    answer:
      "Our mission is to build thinking machines that can learn continuously, adapt to new environments, and collaborate naturally with people across research, work, and everyday life. ",
    
  },
  {
    id: "item-5",
    question: "How can I request access?",
    answer:
      "You can join the waitlist or request access from the site. Early access is focused on people interested in research, productivity, and natural-language AI workflows.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
          
          <h2 className="max-w-3xl text-4xl font-medium leading-tight text-black sm:text-5xl lg:text-6xl">
            Got questions about Ctrl?
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
