import type { Metadata } from "next";
import { SitePreloader } from "@/components/site-preloader";
import { palatino } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://atomctrl.com"),
  title: {
    default: "Ctrl by atom",
    template: "%s | Ctrl by atom",
  },
  description:
    "Ctrl is atom's natural-language interface for thought-grounded multimodal intelligence, memory systems, and research.",
  applicationName: "Ctrl",
  keywords: [
    "Atom Ctrl",
    "atom ctrl",
    "ATOM CTRL",
    "AtomCtrl",
    "atomctrl",
    "atom.ctrl",
    "Atom CTRL",
    "atom Ctrl",
    "Atom ctrl",
    "Ctrl",
    "ctrl",
    "CTRL",
    "CTrl",
    "cTRL",
    "CtRL",
    "ctrl",
    "Atom",
    "atom",
    "ATOM",
    "AI research lab",
    "artificial intelligence research",
    "thinking machines",
    "machine intelligence",
    "advanced AI",
    "next generation AI",
    "future of AI",
    "thought-grounded intelligence",
    "thought-grounded models",
    "multimodal intelligence",
    "multimodal AI",
    "world models",
    "foundation models",
    "efficient foundation models",
    "memory architectures",
    "synthetic data",
    "AI reasoning",
    "AI cognition",
    "machine learning",
    "generative AI",
    "what are thinking machines",
    "how do AI models think",
    "how does AI reason",
    "how does AI learn",
    "how does AI understand the world",
    "what is multimodal AI",
    "what is thought-grounded intelligence",
    "what are world models in AI",
    "what are foundation models",
    "how does memory work in AI",
    "how can AI learn from experience",
    "how will AI evolve",
  ],
  authors: [{ name: "Aditya Prasad Panigrahi", url: "https://atomctrl.com" }],
  creator: "Aditya Prasad Panigrahi",
  publisher: "atom",
  category: "technology",
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
    siteName: "Ctrl by atom",
    title: "Ctrl by atom",
    description:
      "A calm natural-language interface for thought-grounded multimodal intelligence, memory, voice, and research.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ctrl by atom",
    description:
      "A calm natural-language interface for thought-grounded multimodal intelligence, memory, voice, and research.",
    creator: "@adityapp1213",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${palatino.variable} ${palatino.className} h-full bg-white antialiased`}
    >
      <body className="min-h-full bg-white text-black">
        <SitePreloader>{children}</SitePreloader>
      </body>
    </html>
  );
}
