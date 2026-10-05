import type { Metadata, Viewport } from "next";
import { site } from "@/content/site";
import { display, inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.brand} · ${site.tagline}`, template: `%s · ${site.brand}` },
  description: site.description,
  applicationName: site.brand,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: site.brand,
    type: "website",
    title: `${site.brand} · ${site.tagline}`,
    description: site.description,
    images: [{ url: "/images/og-cover.jpg", alt: site.tagline }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#faf6f0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${display.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">{children}</body>
    </html>
  );
}
