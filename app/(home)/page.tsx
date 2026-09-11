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
    absolute: "mahir malik.",
  },
  description:
    "Mahir Malik is an AI engineer building intelligent systems, ML products, and production-grade software — LLM agents, RAG pipelines, and full-stack AI applications.",
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
