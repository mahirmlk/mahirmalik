import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GitHubCommitsSection } from "@/components/sections/GitHubCommitsSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { TheorySection } from "@/components/sections/TheorySection";
import { JsonLd, homeGraph } from "@/lib/schema";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: siteName,
  },
  description: siteDescription,
  authors: [{ name: siteName, url: siteUrl }],
  alternates: {
    canonical: "/",
  },
  other: {
    "msvalidate.01": "88D37C1E9624BCF16F4E755CEB7E1C1D",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeGraph()} />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogsSection />
      <TheorySection />
      <SkillsSection />
      <GitHubCommitsSection />
      <ContactSection />
    </>
  );
}
