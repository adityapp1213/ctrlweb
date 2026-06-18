import type { Metadata } from "next";
import { SitePreloader } from "@/components/site-preloader";
import { palatino } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ctrl",
  description: "Hero navigation landing page",
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
