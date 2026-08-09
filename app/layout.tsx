import type { Metadata } from "next";
import { SitePreloader } from "@/components/site-preloader";
import {
  FOUNDER_NAME,
  serializeJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { instrumentSerif, shadowsIntoLight } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "atom ctrl",
    "ai research lab",
    "thinking machines",
    "thought-grounded intelligence",
    "thought-grounded models",
    "multimodal intelligence",
    "ai reasoning",
    "ai memory",
    "synthetic data research",
    "human ai interaction",
    "monarch models",
  ],
  authors: [{ name: FOUNDER_NAME, url: `${SITE_URL}/#about-us` }],
  creator: FOUNDER_NAME,
  publisher: SITE_NAME,
  category: "ai research",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@adityapp1213",
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon`,
      description: SITE_DESCRIPTION,
      founder: {
        "@type": "Person",
        name: FOUNDER_NAME,
        url: `${SITE_URL}/#about-us`,
      },
      sameAs: [
        "https://www.linkedin.com/in/aditya-prasad-panigrahi/",
        "https://github.com/adityapp1213",
        "https://www.instagram.com/why.adi_tya",
      ],
      knowsAbout: [
        "thought-grounded artificial intelligence",
        "multimodal intelligence",
        "machine reasoning",
        "ai memory systems",
        "synthetic training data",
        "human-ai interaction",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${shadowsIntoLight.variable} ${instrumentSerif.className} h-full bg-white antialiased`}
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="atom ctrl llm index" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
        />
      </head>
      <body className="min-h-full bg-white text-black">
        <SitePreloader>{children}</SitePreloader>
      </body>
    </html>
  );
}
