import { WritingSection } from "@/components/sections/WritingSection";
import { TheorySection } from "@/components/sections/TheorySection";
import type { WritingPost } from "@/lib/writing";

export function ArticlesImplementationsTransition({ posts }: { posts: WritingPost[] }) {
  return (
    <div className="articles-implementations-transition">
      <WritingSection posts={posts} />
      <TheorySection />
    </div>
  );
}
