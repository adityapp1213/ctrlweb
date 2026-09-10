import type { Metadata } from "next";

export const SITE_URL = "https://atomctrl.com";
export const CONTACT_URL = "https://form.typeform.com/to/lmRUeiyH";
export const SITE_NAME = "atom ctrl";
export const SITE_DESCRIPTION =
  "atom ctrl is an AI robotics lab building world thinking machines that learn to predict, act, and complete long-horizon tasks.";
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

export function createPageMetadata({
  path,
  title,
  description,
  image = "/opengraph-image",
}: {
  path: `/${string}`;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

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
