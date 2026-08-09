import type { Metadata } from "next";

export const SITE_URL = "https://atomctrl.com";
export const SITE_NAME = "atom ctrl";
export const SITE_DESCRIPTION =
  "atom ctrl is an ai research lab building thinking machines that can understand, reason, and learn from the world.";
export const FOUNDER_NAME = "aditya prasad panigrahi";

export type ArticleSeo = {
  path: `/${string}`;
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  keywords: string[];
};

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function createArticleMetadata(article: ArticleSeo): Metadata {
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: article.path,
    },
    openGraph: {
      type: "article",
      url: article.path,
      siteName: SITE_NAME,
      title: article.title,
      description: article.description,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified ?? article.datePublished,
      authors: [FOUNDER_NAME],
      images: [
        {
          url: article.image,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  };
}

export function createArticleJsonLd(article: ArticleSeo) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${absoluteUrl(article.path)}#article`,
    headline: article.title,
    description: article.description,
    url: absoluteUrl(article.path),
    mainEntityOfPage: absoluteUrl(article.path),
    image: absoluteUrl(article.image),
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Person",
      name: FOUNDER_NAME,
      url: `${SITE_URL}/#about-us`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    about: article.keywords,
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}
