import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWritingPost, getWritingSlugs } from "@/lib/writing";
import { ArticleBody } from "@/components/writing/ArticleBody";
import { ArticleFooter, ArticleHeader, ArticleLayout } from "@/components/writing/ArticleLayout";
import { JsonLd, writingPostingSchema } from "@/lib/schema";

interface WritingPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `/writing/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: "Mahir Malik" }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      section: post.category,
      tags: post.tags,
      authors: ["Mahir Malik"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={writingPostingSchema(post)} />
      <ArticleLayout>
        <ArticleHeader post={post} />
        <ArticleBody blocks={post.blocks} />
        <ArticleFooter />
      </ArticleLayout>
    </>
  );
}
