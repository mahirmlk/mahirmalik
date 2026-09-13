import type { Metadata } from "next";
import Image from "next/image";
import { getAllWritingPosts } from "@/lib/writing";
import { WritingList } from "@/components/writing/WritingList";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "A collection of technical notes, experiments, ideas and things I've been building around AI agents and production-grade ML systems.",
  alternates: {
    canonical: "/writing",
  },
  openGraph: {
    type: "website",
    url: "/writing",
    title: "Writing | Mahir Malik",
    description:
      "A collection of technical notes, experiments, ideas and things I've been building around AI agents and production-grade ML systems.",
  },
  twitter: {
    card: "summary",
    title: "Writing | Mahir Malik",
    description:
      "A collection of technical notes, experiments, ideas and things I've been building around AI agents and production-grade ML systems.",
  },
};

export default function WritingIndexPage() {
  const posts = getAllWritingPosts();

  return (
    <div className="w-column">
      <header className="w-index-head">
        <div className="w-index-top">
          <h1 className="w-index-title">Writing</h1>
          <Image
            src="/book-logo.png"
            alt="Stack of books with glasses"
            width={56}
            height={56}
            className="w-index-logo"
            priority={false}
          />
        </div>
        <p className="w-index-lede">
          A collection of technical notes, experiments, ideas and things I&apos;ve been building.
        </p>
      </header>
      <WritingList posts={posts} />
    </div>
  );
}
