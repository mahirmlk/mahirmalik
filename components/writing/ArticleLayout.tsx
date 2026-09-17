import Link from "next/link";
import type { ReactNode } from "react";
import type { WritingPost } from "@/lib/writing";
import { formatWritingDateLong } from "@/lib/writing";
import type { FaqItem } from "@/lib/schema";

export function ArticleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-column">
      <article>{children}</article>
    </div>
  );
}

export function ArticleHeader({ post }: { post: WritingPost }) {
  const showUpdated = post.updated && post.updated !== post.date;
  return (
    <header className="w-article-head">
      <Link href="/writing" className="w-back">
        ← All writing
      </Link>
      <p className="w-kicker">{post.category}</p>
      <h1 className="w-title">{post.title}</h1>
      <p className="w-subtitle">{post.description}</p>
      <p className="w-byline">
        <Link href="/about" className="w-byline-author">
          Mahir Malik
        </Link>
        {" · "}
        <time dateTime={post.date}>{formatWritingDateLong(post.date)}</time>
        {showUpdated ? (
          <>
            {" · Updated "}
            <time dateTime={post.updated}>{formatWritingDateLong(post.updated)}</time>
          </>
        ) : null}
        {" · "}
        {post.readTime}
      </p>
      {post.tldr ? (
        <aside className="w-tldr" aria-label="Key takeaway">
          <p className="w-tldr-label">Key takeaway</p>
          <p className="w-tldr-text">{post.tldr}</p>
        </aside>
      ) : null}
    </header>
  );
}

export function ArticleFaq({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  return (
    <section className="w-faq" aria-label="Frequently asked questions">
      <h2 className="w-h2">Frequently asked questions</h2>
      {faqs.map((faq) => (
        <div key={faq.question} className="w-faq-item">
          <h3 className="w-h3">{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
    </section>
  );
}

export function ArticleFooter() {
  return (
    <footer className="w-article-foot">
      <hr className="w-foot-rule" />
      <aside className="w-author" aria-label="About the author">
        <p className="w-author-name">
          Written by <Link href="/about" className="w-byline-author">Mahir Malik</Link>
        </p>
        <p className="w-author-bio">
          AI engineer building intelligent systems, ML products, and production-grade software —
          LLM agents, RAG pipelines, and full-stack AI applications.
        </p>
      </aside>
      <Link href="/writing" className="w-back">
        ← All writing
      </Link>
    </footer>
  );
}
