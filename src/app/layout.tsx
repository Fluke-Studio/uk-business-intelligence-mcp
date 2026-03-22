import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "UK Business Intelligence API | Verify & Enrich UK Companies | 60x Cheaper Than Endole",
  description:
    "Verify and enrich any UK business in seconds. Companies House records, Google reviews, website health, and social media in one API call. Free tier, no contract. Built for compliance, agencies, and developers.",
  keywords: [
    "UK business API",
    "Companies House API",
    "business verification",
    "KYB compliance",
    "Endole alternative",
    "UK company data API",
    "business enrichment",
    "MCP server",
  ],
  openGraph: {
    title: "UK Business Intelligence API — Verify & Enrich UK Companies",
    description:
      "Company records, Google reviews, website health, and social media for any UK business. One API call. 60x cheaper than Endole.",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Business Intelligence API",
    description:
      "Four data sources. One API call. One JSON response. Free to start.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: 'https://ukbusinessintel.com' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          async
          src="https://plausible.io/js/pa-Ut4sqePw840kvGi--hc6b.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </body>
    </html>
  );
}
