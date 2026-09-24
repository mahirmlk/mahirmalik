import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GitHubCommitsSection } from "@/components/sections/GitHubCommitsSection";
import { HeroSection } from "@/components/hero/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SnapshotSection } from "@/components/sections/SnapshotSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { TheorySection } from "@/components/sections/TheorySection";

export const metadata: Metadata = {
  title: {
    absolute: "Mahir Malik",
  },
  description:
    "Mahir Malik is an AI engineer working with machine learning, LLMs, agents, and model development, from early experiments to working systems.",
  keywords: [
    "Mahir Malik",
    "AI Engineer",
    "LLM agents",
    "RAG pipelines",
    "ML products",
    "portfolio",
  ],
  authors: [{ name: "Mahir Malik", url: "https://www.mahirmalik.in" }],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <BlogsSection />
      <TheorySection />
      <SkillsSection />
      <GitHubCommitsSection />
      <SnapshotSection />
      <ContactSection />
    </>
  );
}
