import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { projects } from "@/lib/projects";
import { JsonLd, collectionPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects archive for Mahir Malik, including AI infrastructure and causal ML work.",
  keywords: ["Mahir Malik", "AI projects", "agentic commerce", "ML visualization", "case studies"],
  authors: [{ name: "Mahir Malik", url: "https://www.mahirmalik.in" }],
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    type: "website",
    url: "/work",
    title: "Work | Mahir Malik",
    description: "Projects archive for Mahir Malik, including AI infrastructure and causal ML work.",
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
    description: "Projects archive for Mahir Malik, including AI infrastructure and causal ML work.",
    images: ["/og-image.jpg"],
  },
};

export default function WorkPage() {
  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          title: "Work | Mahir Malik",
          description: "Projects archive for Mahir Malik, including AI infrastructure and causal ML work.",
          path: "/work",
          items: [...projects]
            .sort((a, b) => b.year - a.year)
            .map((project) => ({
              name: project.title,
              path: `/work/${project.slug}`,
              datePublished: `${project.year}-01-01`,
            })),
        })}
      />
    <section className="site-container section-block">
      <Reveal>
        <p className="section-eyebrow">Work Archive</p>
        <h1 className="section-title">Repository-backed systems and applied ML work.</h1>
        <p className="section-copy mt-5">
          The archive now focuses on real project repos instead of placeholder demos, with work
          spanning chat infrastructure and causal inference pipelines.
        </p>
      </Reveal>

      <Reveal className="mt-10" delay={100}>
        <ProjectGrid projects={[...projects].sort((a, b) => b.year - a.year)} />
      </Reveal>
    </section>
    </>
  );
}
