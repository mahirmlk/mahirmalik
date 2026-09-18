import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, Globe } from "lucide-react";
import { ProjectHero } from "@/components/work/ProjectHero";
import { TechBadge } from "@/components/work/TechBadge";
import { getProjectBySlug, projects } from "@/lib/projects";
import { JsonLd, techArticleSchema } from "@/lib/schema";

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
  return projects.map((project) => ({ slug: project.slug }));
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
    keywords: project.tags,
    authors: [{ name: "Mahir Malik", url: "https://www.mahirmalik.in" }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.description,
      publishedTime: `${project.year}-01-01`,
      section: project.category,
      tags: project.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
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
  const blocks = parseBlocks(content);

  return (
    <>
      <JsonLd data={techArticleSchema(project)} />
      <article className="project-detail site-container section-block">
      <Link
        href="/work"
        className="glass-chip mono inline-flex rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
      >
        Back to archive
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="section-eyebrow">Case Study / {project.year}</p>
          <h1 className="section-title">{project.title}</h1>
          <p className="mono-body mt-5 max-w-[44rem] text-[0.92rem] leading-8 text-[var(--fg-muted)]">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TechBadge key={tag}>{tag}</TechBadge>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-[var(--fg)] transition hover:opacity-70"
              >
                <Globe size={13} strokeWidth={1.5} />
                Live project
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-[var(--fg)] transition hover:opacity-70"
              >
                <Github size={13} strokeWidth={1.5} />
                Source code
              </a>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
          <ProjectHero project={project} className="aspect-[16/10] w-full" />
        </div>
      </div>

      <div className="mt-10 rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 md:p-7">
        <div className="features-head flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <p className="section-eyebrow">Project Features</p>
            <h2 className="font-section mt-3 text-[1.5rem] font-semibold tracking-[-0.02em] text-[var(--fg)]">
              What this case study includes
            </h2>
          </div>
          <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {String(project.features.length).padStart(2, "0")} features
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {project.features.map((feature) => (
            <div
              key={feature}
              className="mono-body rounded-[1rem] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-[0.8rem] leading-7 text-[var(--fg-muted)]"
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="prose-article mono-body mt-14 max-w-3xl">
        {blocks.length ? (
          blocks.map((block, index) => {
            if (block.type === "heading") {
              return <h2 key={`${block.value}-${index}`}>{block.value}</h2>;
            }
            if (block.type === "list") {
              return (
                <ul key={`list-${index}`}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              );
            }
            return <p key={`${block.value}-${index}`}>{block.value}</p>;
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
