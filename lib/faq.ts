export type FaqItem = {
  id: string;
  slug: string;
  question: string;
  answer: string;
  title: string;
  description: string;
  keywords: string[];
};

export const faqItems: FaqItem[] = [
  {
    id: "1",
    slug: "what-is-atom-ctrl-and-what-is-it-building",
    question: "What is Atom Ctrl and what is it building?",
    title: "What is Atom Ctrl and what is it building?",
    description: "Learn what Atom Ctrl is building: an AI robotics lab focused on world thinking machines that understand environments, predict outcomes, and take useful actions.",
    keywords: ["Atom Ctrl", "AI robotics lab", "world thinking machines", "physical AI"],
    answer: "Atom Ctrl is an AI robotics lab building world thinking machines. Our systems are designed to understand the world around them, reason about what may happen next, and take actions after predicting the likely outcome.",
  },
  {
    id: "2",
    slug: "what-is-a-world-action-model-wam",
    question: "What is a World Action Model (WAM)?",
    title: "What is a World Action Model (WAM)?",
    description: "A detailed introduction to World Action Models, or WAMs, a class of JEPA models focused on action, control, prediction, and longer-horizon robot tasks.",
    keywords: ["World Action Model", "WAM", "JEPA", "robot control", "action prediction"],
    answer: "A World Action Model, or WAM, is a class of JEPA models for action and control. Instead of only representing what is visible, it learns how actions can change the world. This gives a robot a way to compare possible outcomes, plan across longer horizons, and choose useful actions in a changing environment.",
  },
  {
    id: "4",
    slug: "what-is-project-monarch",
    question: "What is Project Monarch?",
    title: "What is Project Monarch?",
    description: "Learn about Project Monarch, the earlier Atom Ctrl model and research direction that informed the move toward World Action Models for robotics and automation.",
    keywords: ["Project Monarch", "Atom Ctrl Monarch", "robotics research", "world models"],
    answer: "Project Monarch was the internal name for an earlier Atom Ctrl model and research direction. Its work on representation, prediction, and longer tasks helped inform our current focus on World Action Models for robotics and automation.",
  },
  {
    id: "6",
    slug: "where-to-read-the-atom-ctrl-research",
    question: "Where can I read the Atom Ctrl research?",
    title: "Where can I read the Atom Ctrl research?",
    description: "Find Atom Ctrl research notes on world models, interaction systems, Project Monarch, Godel models, and synthetic data.",
    keywords: ["Atom Ctrl research", "AI research", "robotics research", "machine learning papers"],
    answer: "Our research notes and technical writing are collected on the research page. They include work on Project Monarch, interaction systems, Godel models, scaling synthetic data, and the ideas that lead toward World Action Models.",
  },
  {
    id: "7",
    slug: "how-to-get-in-touch-with-atom-ctrl",
    question: "How can I get in touch with Atom Ctrl?",
    title: "How to get in touch with Atom Ctrl",
    description: "Learn how to contact Atom Ctrl about its AI robotics research, World Action Models, collaboration, and future opportunities.",
    keywords: ["contact Atom Ctrl", "Atom Ctrl collaboration", "AI robotics opportunities"],
    answer: "Use the contact form below to reach us about the work, research, collaboration, or opportunities to contribute to Atom Ctrl.",
  },
];

export function getFaqItem(slug: string) {
  return faqItems.find((item) => item.slug === slug);
}
