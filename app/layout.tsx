import type { Metadata } from "next";
import { SitePreloader } from "@/components/site-preloader";
import {
  FOUNDER_NAME,
  serializeJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { instrumentSerif, monaSans, shadowsIntoLight } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "atom ctrl - world thinking machines",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "atom ctrl",
    "AI robotics lab",
    "world thinking machines",
    "world action models",
    "JEPA",
    "H-JEPA",
    "robot learning",
    "simulated robot control",
    "long-horizon tasks",
    "multimodal intelligence",
    "predictive world models",
    "Project Monarch",
  ],
  authors: [{ name: FOUNDER_NAME, url: `${SITE_URL}/#about-us` }],
  creator: FOUNDER_NAME,
  publisher: SITE_NAME,
  category: "ai research",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
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
    title: "atom ctrl - world thinking machines",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "atom ctrl - world thinking machines",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "atom ctrl - world thinking machines",
    description: SITE_DESCRIPTION,
    creator: "@adityapp1213",
    images: ["/twitter-image"],
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
      logo: `${SITE_URL}/favicon.ico`,
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
        "AI robotics",
        "world action models",
        "JEPA",
        "H-JEPA",
        "robot control",
        "long-horizon task planning",
        "multimodal intelligence",
        "predictive world models",
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
      className={`${monaSans.variable} ${instrumentSerif.variable} ${shadowsIntoLight.variable} ${monaSans.className} h-full bg-white antialiased`}
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
