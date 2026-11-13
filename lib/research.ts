import type { ArticleSeo } from "./seo";

export type BlogConfig = {
  sourceFile: string;
  label: string;
  summary: string;
  heroImageAlt: string;
  heroImageSrc: string;
  heroMetaClassName?: string;
  seo: ArticleSeo;
  highlights?: Array<{
    title: string;
    description: string;
    tone: "rose" | "blue" | "teal" | "amber";
  }>;
};

export const blogArticles = {
  monarch: {
    sourceFile: "monarch-source.html",
    label: "Monarch",
    summary: "A thought-grounded multimodal architecture for memory, reasoning, and persistent state.",
    heroImageSrc: "/assets/blog-cards/1.png",
    heroImageAlt: "Monarch research card",
    seo: {
      path: "/research/monarch",
      title: "monarch: thought-grounded multimodal intelligence",
      description:
        "monarch is atom ctrl's architecture for turning multimodal experience into structured thought, memory, specialist processing, reasoning, and output.",
      image: "/assets/blog-cards/1.png",
      datePublished: "2026-07-03",
      dateModified: "2026-07-04",
      keywords: [
        "monarch",
        "thought-grounded multimodal intelligence",
        "thoughtvector",
        "persistent ai memory",
        "specialist reasoning",
      ],
    },
    highlights: [
      {
        title: "multi-modal",
        description:
          "text, images, audio, video, and documents enter one shared semantic space.",
        tone: "rose",
      },
      {
        title: "thought formation",
        description:
          "raw experience becomes a structured thoughtvector before reasoning begins.",
        tone: "blue",
      },
      {
        title: "persistent memory",
        description:
          "semantic knowledge and prior episodes stay available across interactions.",
        tone: "teal",
      },
      {
        title: "specialist reasoning",
        description:
          "learned experts contribute context before a fixed-depth reasoning pass.",
        tone: "amber",
      },
    ],
  },
  "interaction-systems": {
    sourceFile: "interaction-systems-source.html",
    label: "Interaction system",
    summary: "A real-time voice architecture for conversations that understand while they unfold.",
    heroImageSrc: "/assets/blog-cards/2.2.png",
    heroImageAlt: "Interaction system research card",
    seo: {
      path: "/research/interaction-systems",
      title: "interaction systems: how voice becomes a real conversation",
      description:
        "atom ctrl's interaction architecture preserves turn state, forms partial understanding early, and begins shaping a response while a conversation is still active.",
      image: "/assets/blog-cards/2.2.png",
      datePublished: "2026-05-30",
      dateModified: "2026-07-04",
      keywords: [
        "voice interaction systems",
        "streaming speech ai",
        "turn state",
        "real-time ai conversation",
        "voice architecture",
      ],
    },
  },
  "godel-model": {
    sourceFile: "godel-source.html",
    label: "Godel model",
    summary: "A hybrid local-cloud language model architecture that routes work where it fits.",
    heroImageSrc: "/assets/blog-cards/3.png",
    heroImageAlt: "Godel model research card",
    seo: {
      path: "/research/godel-model",
      title: "godel 1.6: a hybrid local-cloud llm architecture",
      description:
        "godel 1.6 is an atom ctrl architecture that handles routine work locally and routes complex tasks to cloud specialists only when required.",
      image: "/assets/blog-cards/3.png",
      datePublished: "2025-08-20",
      dateModified: "2026-07-04",
      keywords: [
        "godel 1.6",
        "hybrid local-cloud ai",
        "local language model",
        "ai routing architecture",
        "private ai",
      ],
    },
  },
  "scaling-synthetic-data": {
    sourceFile: "scaling-source.html",
    label: "Scaling synthetic data",
    summary: "A practical study of turning raw web text into cleaner training data.",
    heroImageSrc: "/assets/blog-cards/4.png",
    heroImageAlt: "Scaling synthetic data research card",
    seo: {
      path: "/research/scaling-synthetic-data",
      title: "scaling synthetic data",
      description:
        "atom ctrl explores using llama-3 to turn raw web text into cleaner, structured synthetic training data for compact language models.",
      image: "/assets/blog-cards/4.png",
      datePublished: "2025-07-28",
      dateModified: "2026-07-04",
      keywords: [
        "synthetic training data",
        "llama-3 rephrasing",
        "compact language models",
        "data quality",
        "ai pretraining",
      ],
    },
  },
  "wam-0-1-dataset": {
    sourceFile: "wam-0-1-dataset-source.html",
    label: "WAM-0.1 dataset",
    summary: "A custom 150 GB robotics dataset built for training H-JEPA to predict action and change.",
    heroImageSrc: "/assets/blog-cards/5.2.png",
    heroImageAlt: "WAM-0.1 dataset research card",
    heroMetaClassName: "simple-blog-hero-meta-wam",
    seo: {
      path: "/research/wam-0-1-dataset",
      title: "WAM-0.1 Dataset: Action-Conditioned Robotics Data for H-JEPA",
      description:
        "WAM-0.1 is a 150 GB RoboSuite and RoboCasa dataset for H-JEPA research on action-conditioned prediction, robot learning, and world models.",
      image: "/assets/blog-cards/5.2.png",
      imageWidth: 1200,
      imageHeight: 675,
      datePublished: "2026-10-12",
      dateModified: "2026-10-25",
      keywords: [
        "WAM-0.1 dataset",
        "RoboSuite dataset",
        "RoboCasa dataset",
        "H-JEPA",
        "robot learning",
        "world action models",
      ],
    },
  },
} satisfies Record<string, BlogConfig>;

export type BlogSlug = keyof typeof blogArticles;

export function getBlogSlugs() {
  return Object.keys(blogArticles) as BlogSlug[];
}

export function getBlogConfig(slug: string) {
  return Object.hasOwn(blogArticles, slug) ? blogArticles[slug as BlogSlug] : undefined;
}

export const researchOrder: BlogSlug[] = [
  "wam-0-1-dataset", "monarch", "interaction-systems", "godel-model", "scaling-synthetic-data",
];
