export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  layout: "feature" | "standard";
  previewImage?: {
    url: string;
    width: number;
    height: number;
    type: string;
    alt: string;
  };
  body?: string[];
};

export const blogPosts: BlogPost[] = [
  // Cleared 2026-09-09: previous "efficiency-era-of-ai" post removed.
  // Add new posts here as { slug, title, description, excerpt, date, readTime, category, tags, layout: "standard" }.
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
