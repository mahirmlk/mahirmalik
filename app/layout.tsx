import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Navbar } from "@/components/nav/Navbar";
import { inter, jetbrainsMono, sora, playfairDisplay, montserrat, spaceGrotesk, gochiHand, pixelMono, schoolbell } from "@/lib/fonts";
import "@/app/globals.css";
import "@/app/mobile.css";
import { cn } from "@/lib/utils";
import { JsonLd, homeGraph } from "@/lib/schema";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const siteUrl = "https://www.mahirmalik.in";
const siteTitle = "Mahir Malik";
const siteDescription =
  "Portfolio of Mahir Malik building intelligent systems, ML products, and production-grade software.";
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
  keywords: [
    "Mahir Malik",
    "AI Engineer",
    "Machine Learning",
    "LLM agents",
    "RAG systems",
    "Next.js",
    "FastAPI",
    "PyTorch",
    "production ML systems",
  ],
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
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: siteTitle,
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
  const themeScript = `
    (() => {
      try {
        const storedTheme = localStorage.getItem("theme");
        const theme = storedTheme === "dark" ? "dark" : "light";
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.style.colorScheme = theme;
      } catch {}
    })();
  `;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(inter.variable, jetbrainsMono.variable, sora.variable, playfairDisplay.variable, montserrat.variable, spaceGrotesk.variable, gochiHand.variable, pixelMono.variable, schoolbell.variable, "font-sans")}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <link rel="alternate" type="application/rss+xml" title="Mahir Malik — Writing RSS" href="/feed.xml" />
        <link rel="llms" href="/llms.txt" />
        <JsonLd data={homeGraph()} />
      </head>
      <body suppressHydrationWarning className="page-shell min-h-screen overflow-x-hidden antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="relative z-10 pt-24 md:pt-28">{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
