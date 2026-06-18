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
    "Ctrl is the natural-language home for atom's thought-grounded multimodal models, memory systems, and research companion experience.",
  applicationName: "Ctrl",
  keywords: [
    "Ctrl",
    "atom",
    "multimodal AI",
    "thought-grounded models",
    "AI research",
    "Cloudy",
  ],
  authors: [{ name: "Aditya Prasad Panigrahi" }],
  creator: "Aditya Prasad Panigrahi",
  publisher: "atom",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Ctrl by atom",
    title: "Ctrl by atom",
    description:
      "A calm interface for thought-grounded multimodal intelligence, memory, research, and natural language interaction.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ctrl by atom",
    description:
      "A calm interface for thought-grounded multimodal intelligence, memory, research, and natural language interaction.",
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
