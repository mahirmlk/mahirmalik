import { getAllWritingPosts } from "@/lib/writing";
import { WritingParallax } from "@/components/sections/WritingParallax";

export function BlogsSection() {
  return <WritingParallax posts={getAllWritingPosts()} />;
}
