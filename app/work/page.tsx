import type { Metadata } from "next";
import { ArrowDownRight } from "lucide-react";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { projects } from "@/lib/projects";
import { JsonLd, collectionPageSchema } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Work",
  description: "A closer look at Mahir Malik’s software projects, including policy-controlled agent commerce and interactive machine-learning visualization.",
  authors: [{ name: siteName, url: siteUrl }],
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    type: "website",
    url: "/work",
    title: "Work | Mahir Malik",
    description: "A closer look at Mahir Malik’s software projects, including policy-controlled agent commerce and interactive machine-learning visualization.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 675,
        alt: "Mahir Malik — AI project archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work | Mahir Malik",
    description: "Projects archive for Mahir Malik — agentic commerce, ML visualization, and applied AI systems.",
    images: ["/og-image.jpg"],
  },
};

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          title: "Work | Mahir Malik",
          description: "A closer look at Mahir Malik’s software projects, including policy-controlled agent commerce and interactive machine-learning visualization.",
          path: "/work",
          items: [...projects]
            .filter((project) => !project.comingSoon)
            .sort((a, b) => b.year - a.year)
            .map((project) => ({
              name: project.title,
              path: `/work/${project.slug}`,
            })),
        })}
      />
    <section className="work-archive">
      <header className="work-archive-header">
        <p className="work-archive-eyebrow">Selected work / 2022—now</p>
        <h1>Built, tested, and put to use.</h1>
        <div className="work-archive-intro-row">
          <p>Projects in applied machine learning and agent systems, shaped by the parts that have to work in practice.</p>
          <a href="#project-list" aria-label="Scroll to selected projects" className="work-archive-down">
            <ArrowDownRight aria-hidden="true" />
          </a>
        </div>
      </header>

      <ProjectGrid projects={[...projects].sort((a, b) => b.year - a.year)} />
    </section>
    </>
  );
}
