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
  title: "UK Business Intelligence API | Companies House + Google Places + DNS + Social",
  description:
    "Unified API for enriching UK business data. Get Companies House records, Google Places ratings, website status, and social media links in one call. Free tier available.",
  keywords: [
    "UK business API",
    "Companies House API",
    "business intelligence",
    "Google Places API",
    "MCP server",
    "business enrichment",
  ],
  openGraph: {
    title: "UK Business Intelligence API",
    description:
      "Companies House + Google Places + DNS + Social Media in one API call. Free tier, developer-friendly pricing.",
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
