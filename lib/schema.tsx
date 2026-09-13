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
        datePublished: post.date,
        dateModified: post.date,
        author: { "@id": personId },
        publisher: { "@id": personId },
        keywords: post.tags.join(", "),
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
  tags: string[];
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
        datePublished: `${project.year}-01-01`,
        dateModified: `${project.year}-12-31`,
        author: { "@id": personId },
        publisher: { "@id": personId },
        keywords: project.tags.join(", "),
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Work", path: "/work" },
        { name: project.title, path: `/work/${project.slug}` },
      ]),
    ],
  };
}
