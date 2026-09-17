import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWritingPost, getWritingSlugs } from "@/lib/writing";
import { getWritingFaqs } from "@/lib/writing-faq";
import { siteUrl } from "@/lib/site";
import { ArticleBody } from "@/components/writing/ArticleBody";
import { ArticleFaq, ArticleFooter, ArticleHeader, ArticleLayout } from "@/components/writing/ArticleLayout";
import { JsonLd, faqPageSchema, writingPostingSchema } from "@/lib/schema";

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
    keywords: post.tags,
    authors: [{ name: "Mahir Malik", url: "https://www.mahirmalik.in" }],
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
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 675,
          alt: `${post.title} — Mahir Malik`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function WritingPostPage({ params }: WritingPageProps) {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) {
    notFound();
  }

  const faqs = getWritingFaqs(post.slug);
  const graph = writingPostingSchema(post);
  const url = `${siteUrl}/writing/${post.slug}`;
  const data =
    faqs.length > 0
      ? { ...graph, "@graph": [...graph["@graph"], faqPageSchema(url, faqs)] }
      : graph;

  return (
    <>
      <JsonLd data={data} />
      <ArticleLayout>
        <ArticleHeader post={post} />
        <ArticleBody blocks={post.blocks} />
        <ArticleFaq faqs={faqs} />
        <ArticleFooter />
      </ArticleLayout>
    </>
  );
}
