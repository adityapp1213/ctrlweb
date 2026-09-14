export type FaqItem = {
  id: string;
  slug: string;
  question: string;
  answer: string;
  title: string;
  description: string;
};

export const faqItems: FaqItem[] = [
  {
    id: "1",
    slug: "what-is-atom-ctrl",
    question: "What is Atom ctrl?",
    title: "What is Atom Ctrl building?",
    description: "Learn what Atom Ctrl is building: thinking machines that understand the world, predict what may happen next, and take useful actions in physical environments.",
    answer: "Atom ctrl is a physical ai lab which is building thinking machines that can understand, reason, and learn from the world around them and take actions after detering the outcome of it.",
  },
  {
    id: "2",
    slug: "what-is-a-world-action-model",
    question: "What is a World Action Model( WAM )?",
    title: "What is a World Action Model?",
    description: "A clear introduction to World Action Models, a class of JEPA models focused on action, control, and predicting how actions change the world.",
    answer: "A World Action Model is a class of JEPA models focused on action and control. It learns how actions change the world so systems can plan, predict outcomes, and complete longer tasks.",
  },
  {
    id: "3",
    slug: "where-to-read-the-research",
    question: "Where can I read the research?",
    title: "Where can I read the Atom Ctrl research?",
    description: "Find Atom Ctrl research notes on world models, interaction systems, Project Monarch, Godel models, and synthetic data.",
    answer: "Our research notes and technical writing are collected on the research page, including work on Project Monarch, interaction systems, Godel models, and synthetic data.",
  },
  {
    id: "4",
    slug: "how-to-get-in-touch",
    question: "How can I get in touch?",
    title: "How to get in touch with Atom Ctrl",
    description: "Learn how to contact Atom Ctrl about the work, research, or opportunities to collaborate.",
    answer: "Use the contact form below to reach us about the work, research, or opportunities to collaborate.",
  },
];

export function getFaqItem(slug: string) {
  return faqItems.find((item) => item.slug === slug);
}
