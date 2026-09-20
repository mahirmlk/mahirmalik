import { personDescription, personId, personJobTitle, personKnowsAbout, personSameAs, siteDescription, siteName, siteUrl, websiteId } from "@/lib/site";

function escapeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(data) }}
    />
  );
}

export function authorRef() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteName,
    url: siteUrl,
  };
}

export function timeRequiredFromReadTime(readTime: string, wordCount: number): string {
  const match = readTime.match(/(\d+)/);
  const minutes = Math.max(1, match ? parseInt(match[1], 10) : Math.max(1, Math.round(wordCount / 200)));
  return `PT${minutes}M`;
}

export function personSchema() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteName,
    url: siteUrl,
    jobTitle: personJobTitle,
    description: personDescription,
    sameAs: personSameAs,
    knowsAbout: personKnowsAbout,
  };
}

export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        publisher: { "@id": personId },
      },
      personSchema(),
    ],
  };
}

export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/about#profilepage`,
    url: `${siteUrl}/about`,
    mainEntity: personSchema(),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function writingPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  readTime: string;
  wordCount: number;
  category: string;
  tags: string[];
}) {
  const url = `${siteUrl}/writing/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        image: `${siteUrl}/og-image.jpg`,
        datePublished: post.date,
        dateModified: post.updated,
        author: authorRef(),
        publisher: { "@id": personId },
        keywords: post.tags.join(", "),
        articleSection: post.category,
        wordCount: post.wordCount,
        timeRequired: timeRequiredFromReadTime(post.readTime, post.wordCount),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Writing", path: "/writing" },
        { name: post.title, path: `/writing/${post.slug}` },
      ]),
    ],
  };
}

export function techArticleSchema(project: {
  slug: string;
  title: string;
  description: string;
  year: number;
  category: string;
  tags: string[];
  image?: string;
}) {
  const url = `${siteUrl}/work/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: project.title,
        description: project.description,
        url,
        mainEntityOfPage: url,
        inLanguage: "en",
        image: project.image ?? `${siteUrl}/og-image.jpg`,
        datePublished: `${project.year}-01-01`,
        dateModified: `${project.year}-12-31`,
        author: authorRef(),
        publisher: { "@id": personId },
        keywords: project.tags.join(", "),
        articleSection: project.category,
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
        { name: project.title, path: `/work/${project.slug}` },
      ]),
    ],
  };
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function faqPageSchema(url: string, faqs: FaqItem[]) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function collectionPageSchema(input: {
  title: string;
  description: string;
  path: string;
  items: { name: string; path: string; datePublished?: string }[];
}) {
  const url = `${siteUrl}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        url,
        name: input.title,
        description: input.description,
        inLanguage: "en",
        author: authorRef(),
        mainEntity: { "@id": `${url}#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#list`,
        url,
        name: input.title,
        numberOfItems: input.items.length,
        itemListElement: input.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${siteUrl}${item.path}`,
          name: item.name,
          ...(item.datePublished ? { datePublished: item.datePublished } : {}),
        })),
      },
    ],
  };
}
