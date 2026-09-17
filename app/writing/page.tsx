import type { Metadata } from "next";
import Image from "next/image";
import { getAllWritingPosts } from "@/lib/writing";
import { WritingList } from "@/components/writing/WritingList";
import { JsonLd, collectionPageSchema } from "@/lib/schema";

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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 675,
        alt: "Mahir Malik — Writing on AI agents and production ML systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing | Mahir Malik",
    description:
      "A collection of technical notes, experiments, ideas and things I've been building around AI agents and production-grade ML systems.",
    images: ["/og-image.jpg"],
  },
};

export default function WritingIndexPage() {
  const posts = getAllWritingPosts();

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          title: "Writing | Mahir Malik",
          description:
            "A collection of technical notes, experiments, ideas and things I've been building around AI agents and production-grade ML systems.",
          path: "/writing",
          items: posts.map((post) => ({
            name: post.title,
            path: `/writing/${post.slug}`,
            datePublished: post.date,
          })),
        })}
      />
    <div className="w-column">
      <header className="w-index-head">
        <div className="w-index-top">
          <h1 className="w-index-title">Writing</h1>
          <Image
            src="/book-logo.webp"
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
    </>
  );
}
