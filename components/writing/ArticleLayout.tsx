import Link from "next/link";
import type { ReactNode } from "react";
import type { WritingPost } from "@/lib/writing";
import { formatWritingDateLong } from "@/lib/writing";

export function ArticleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-column">
      <article>{children}</article>
    </div>
  );
}

export function ArticleHeader({ post }: { post: WritingPost }) {
  return (
    <header className="w-article-head">
      <Link href="/writing" className="w-back">
        ← All writing
      </Link>
      <p className="w-kicker">{post.category}</p>
      <h1 className="w-title">{post.title}</h1>
      <p className="w-subtitle">{post.description}</p>
      <p className="w-byline">
        Mahir Malik
        {" · "}
        <time dateTime={post.date}>{formatWritingDateLong(post.date)}</time>
        {" · "}
        {post.readTime}
      </p>
    </header>
  );
}

export function ArticleFooter() {
  return (
    <footer className="w-article-foot">
      <hr className="w-foot-rule" />
      <Link href="/writing" className="w-back">
        ← All writing
      </Link>
    </footer>
  );
}
