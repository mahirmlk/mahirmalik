import type { MetadataRoute } from "next";
import { getAllWritingPosts } from "@/lib/writing";
import { projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Stable last-modified dates: static routes change rarely, so use a fixed
// date instead of `new Date()` (which busts cache and signals false freshness).
// Update SITE_LAST_MODIFIED when static page copy meaningfully changes.
const SITE_LAST_MODIFIED = new Date("2026-09-13");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/writing`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Coming-soon cards (e.g. Helion) have no case-study page — never list a 404.
  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((project) => !project.comingSoon)
    .map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: new Date(`${project.year}-12-31`),
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  const writingRoutes: MetadataRoute.Sitemap = getAllWritingPosts().map((post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
