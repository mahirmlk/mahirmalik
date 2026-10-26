import type { MetadataRoute } from "next";
import { getAllWritingPosts } from "@/lib/writing";
import { projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl },
    { url: `${siteUrl}/about` },
    { url: `${siteUrl}/work` },
    { url: `${siteUrl}/writing` },
  ];

  // Coming-soon cards (e.g. Helion) have no case-study page — never list a 404.
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((project) => !project.comingSoon)
    .map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
    }));

  const writingRoutes: MetadataRoute.Sitemap = getAllWritingPosts().map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    ...(post.updated !== post.date ? { lastModified: new Date(post.updated) } : {}),
  }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
