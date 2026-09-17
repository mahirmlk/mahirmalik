import { permanentRedirect } from "next/navigation";
import { getWritingPost } from "@/lib/writing";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Canonical route moved to /writing/:slug. Old /blog/:slug links keep working.
// 308 (permanent) passes link equity from old /blog backlinks.
export default async function BlogPostRedirect({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getWritingPost(slug);

  permanentRedirect(post ? `/writing/${post.slug}` : "/writing");
}
