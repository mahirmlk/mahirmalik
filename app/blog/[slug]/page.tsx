import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, blogPosts } from "@/lib/blogs";
import { StandardBlogArticle } from "@/components/blog/StandardBlogArticle";
import { JsonLd, blogPostingSchema } from "@/lib/schema";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `/blog/${post.slug}`;
  const images = post.previewImage
    ? [
        {
          url: post.previewImage.url,
          width: post.previewImage.width,
          height: post.previewImage.height,
          type: post.previewImage.type,
          alt: post.previewImage.alt,
        },
      ]
    : undefined;

  return {
    title: post.title,
    description: post.description,
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
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.previewImage
        ? [
            {
              url: post.previewImage.url,
              alt: post.previewImage.alt,
            },
          ]
        : undefined,
    },
    other: post.previewImage
      ? {
          "twitter:image:alt": post.previewImage.alt,
        }
      : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />
      <StandardBlogArticle post={post} />
    </>
  );
}
