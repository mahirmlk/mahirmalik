import type { Metadata } from "next";
import { ArticlesImplementationsTransition } from "@/components/sections/ArticlesImplementationsTransition";
import { ContactSection } from "@/components/sections/ContactSection";
import { GitHubCommitsSection } from "@/components/sections/GitHubCommitsSection";
import { HeroAboutTransition } from "@/components/sections/HeroAboutTransition";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JsonLd, homeGraph } from "@/lib/schema";
import { getAllWritingPosts } from "@/lib/writing";
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
  const posts = getAllWritingPosts();

  return (
    <>
      <JsonLd data={homeGraph()} />
      <HeroAboutTransition />
      <ProjectsSection />
      <ArticlesImplementationsTransition posts={posts} />
      <SkillsSection />
      <GitHubCommitsSection />
      <ContactSection />
    </>
  );
}
