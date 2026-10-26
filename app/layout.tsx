import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { inter, jetbrainsMono, sora, playfairDisplay, montserrat, spaceGrotesk, pixelMono } from "@/lib/fonts";
import "@/app/globals.css";
import "@/app/mobile.css";
import { cn } from "@/lib/utils";
import { siteDescription, siteName, siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "lenis/dist/lenis.css";

const siteTitle = `${siteName} — AI Engineer`;
const previewImage = {
  url: "/og-image.jpg",
  width: 1200,
  height: 675,
  alt: "Mahir Malik — portfolio, AI Engineer",
  type: "image/jpeg"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090b0f" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | Mahir Malik",
    default: siteTitle
  },
  description: siteDescription,
  authors: [{ name: "Mahir Malik", url: siteUrl }],
  creator: "Mahir Malik",
  publisher: "Mahir Malik",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [previewImage]
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: previewImage.url,
        alt: previewImage.alt
      }
    ]
  },
  other: {
    "twitter:image:alt": previewImage.alt
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, jetbrainsMono.variable, sora.variable, playfairDisplay.variable, montserrat.variable, spaceGrotesk.variable, pixelMono.variable, "font-sans")}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Mahir Malik — Writing RSS" href="/feed.xml" />
      </head>
      <body suppressHydrationWarning className="page-shell min-h-screen antialiased">
        <SmoothScrollProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <main id="main" className="relative z-10 pt-24 md:pt-28">{children}</main>
          <Analytics />
          <SpeedInsights />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
