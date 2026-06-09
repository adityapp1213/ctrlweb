import type { Metadata } from "next";
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
    <html lang="en" className="h-full bg-white antialiased">
      <body className="min-h-full bg-white text-black">{children}</body>
    </html>
  );
}
