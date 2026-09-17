import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JsonLd, profilePageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: "Extended background, working principles, and technical profile for Mahir Malik.",
  keywords: ["Mahir Malik", "AI Engineer", "about", "working principles", "ML profile"],
  authors: [{ name: "Mahir Malik", url: "https://www.mahirmalik.in" }],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "profile",
    url: "/about",
    title: "About | Mahir Malik",
    description: "Extended background, working principles, and technical profile for Mahir Malik.",
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
    description: "Extended background, working principles, and technical profile for Mahir Malik.",
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
