import Link from "next/link";
import type { WritingPost } from "@/lib/writing";
import { formatWritingDate } from "@/lib/writing";
import { FolderMark } from "@/components/writing/FolderMark";

export function WritingList({ posts }: { posts: WritingPost[] }) {
  if (posts.length === 0) {
    return <p className="w-empty">New essays are on the way. Check back soon.</p>;
  }

  return (
    <ul className="w-index-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/writing/${post.slug}`} className="w-row">
            <span className="w-row-title">
              <FolderMark />
              {post.shortTitle}
            </span>
            <span className="w-row-desc">{post.description}</span>
            <span className="w-row-meta">
              {post.category}
              {" · "}
              <time dateTime={post.date}>{formatWritingDate(post.date)}</time>
              {" · "}
              {post.readTime}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
