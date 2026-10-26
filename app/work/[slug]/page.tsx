import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, Globe } from "lucide-react";
import { ProjectHero } from "@/components/work/ProjectHero";
import { TechBadge } from "@/components/work/TechBadge";
import { getProjectBySlug, projects } from "@/lib/projects";
import { JsonLd, projectSchema } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import { renderInlineMarkdown } from "@/lib/writing";

// Renders inline markdown (links, code, bold) from project content. The source
// is HTML-escaped inside renderInlineMarkdown before any tags are added.
function Inline({ text }: { text: string }) {
  return <span dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }} />;
}

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

type Block =
  | { type: "heading"; value: string }
  | { type: "paragraph"; value: string }
  | { type: "list"; items: string[] };

async function readProjectContent(slug: string) {
  const filePath = path.join(process.cwd(), "content", "projects", `${slug}.md`);

  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return "";
  }
}

function parseBlocks(raw: string): Block[] {
  const lines = raw.split(/\r?\n/);
  const contentLines: string[] = [];
  let inFrontmatter = false;

  lines.forEach((line, index) => {
    if (line.trim() === "---" && index === 0) {
      inFrontmatter = true;
      return;
    }
    if (line.trim() === "---" && inFrontmatter) {
      inFrontmatter = false;
      return;
    }
    if (!inFrontmatter) {
      contentLines.push(line);
    }
  });

  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", value: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: [...list] });
      list = [];
    }
  };

  contentLines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", value: trimmed.slice(3) });
      return;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      return;
    }

    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();
  return blocks;
}

export async function generateStaticParams() {
  return projects
    .filter((project) => !project.comingSoon)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  const url = `/work/${project.slug}`;
  const ogImage = project.image ?? "/og-image.jpg";

  return {
    title: project.title,
    description: project.description,
    authors: [{ name: siteName, url: siteUrl }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.description,
      section: project.category,
      tags: project.tags,
      images: [
        {
          // Project covers are 1200x798; declaring the real dimensions keeps
          // link previews from cropping (the old 1200x630 mismatch did).
          url: ogImage,
          width: 1200,
          height: project.image ? 798 : 675,
          alt: `${project.title} — case study by Mahir Malik`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const content = await readProjectContent(slug);

  // No body file = no case study. Coming-soon cards (Helion) must 404 here;
  // their preview lives on the project card in the archive.
  if (!content.trim()) {
    notFound();
  }

  const blocks = parseBlocks(content);

  return (
    <>
      <JsonLd data={projectSchema(project)} />
      <article className="project-detail project-case-study">
        <Link href="/work" className="case-study-back">← All work</Link>

        <header className="case-study-header">
          <p className="case-study-kicker">{project.category} <span>·</span> {project.year}</p>
          <h1>{project.title}</h1>
          <p className="case-study-summary">{project.description}</p>
          <div className="case-study-tech">
            {project.tags.map((tag) => <TechBadge key={tag}>{tag}</TechBadge>)}
          </div>
          <div className="case-study-links">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Globe size={14} strokeWidth={1.5} /> Live project
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github size={14} strokeWidth={1.5} /> Source code
              </a>
            ) : null}
          </div>
        </header>

        <figure className="case-study-hero">
          <ProjectHero project={project} className="case-study-hero-media" />
        </figure>

        <section className="case-study-features" aria-labelledby="case-study-features-title">
          <h2 id="case-study-features-title">What it does</h2>
          <ul>
            {project.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </section>

        <div className="prose-article case-study-prose">
          {blocks.length ? (
            blocks.map((block, index) => {
              if (block.type === "heading") {
                return <h2 key={`${block.value}-${index}`}>{block.value}</h2>;
              }
              if (block.type === "list") {
                return (
                  <ul key={`list-${index}`}>
                    {block.items.map((item) => (
                      <li key={item}>
                        <Inline text={item} />
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={`${block.value}-${index}`}>
                  <Inline text={block.value} />
                </p>
              );
            })
          ) : (
            <p>
              The case study content for this project lives in <code>content/projects/{project.slug}.md</code>{" "}
              and can be expanded with richer narrative detail.
            </p>
          )}
        </div>
      </article>
    </>
  );
}
