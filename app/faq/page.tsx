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
    id: "item-0",
    question: "What is atom ctrl ?",
    answer:
      "Atom Ctrl is an AI research lab building Thinking Machines that can understand, reason, and learn from the world.",
  },
{
  id: "item-1",
  question: "What is atom ctrl?",
  answer:
    "Atom Ctrl is an AI research lab building thought-grounded AI systems that reason, learn, and understand the world instead of relying only on next-token prediction.",
},
{
  id: "item-2",
  question: "What is Project Monarch?",
  answer:
    "Monarch is Atom Ctrl's flagship research project and the name of our family of thought-grounded AI models. It explores new approaches to reasoning, memory, multimodal understanding, and world models to build more capable AI systems.",
},
{
  id: "item-3",
  question: "What are thought grounded AI?",
  answer:
    "Thought grounded ai models are designed to build internal representations before producing an answer. Project Monarch explores this approach to make AI more reliable, adaptable, and useful in real-world situations.",
},
{
  id: "item-4",
  question: "How can I use atom ctrl?",
  answer:
    "Atom Ctrl is currently in development. You can join the waitlist to receive updates and early access as new releases become available.",
},
{
  id: "item-5",
  question: "How can I get early access to Atom Ctrl?",
  answer:
    "Join the Atom Ctrl waitlist through our website. Early access is rolling out gradually to researchers, developers, students, and early adopters.",
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

      <div className="mx-auto w-full max-w-4xl px-2 sm:px-0">
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
