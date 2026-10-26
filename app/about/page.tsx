import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JsonLd, profilePageSchema } from "@/lib/schema";
import { personDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: personDescription,
  authors: [{ name: siteName, url: siteUrl }],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "About | Mahir Malik",
    description: personDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 675,
        alt: "Mahir Malik — AI Engineer profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Mahir Malik",
    description: personDescription,
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={profilePageSchema()} />
      <AboutSection standalone />
      <SkillsSection />
      <ContactSection />
    </>
  );
}
