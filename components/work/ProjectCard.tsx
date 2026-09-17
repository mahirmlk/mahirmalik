"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Github, Globe } from "lucide-react";
import type { Project } from "@/types";
import { ProjectCardCover } from "@/components/work/ProjectCardCover";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const detailsUrl = `/work/${project.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.14)] transition-all duration-300 hover:border-black/[0.14] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_24px_48px_-16px_rgba(0,0,0,0.18)]">
      <Link href={detailsUrl} aria-label={`View ${project.title}`} className="block">
        <ProjectCardCover project={project} className="aspect-[16/9]" />
      </Link>

      <div className="flex flex-1 flex-col px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
        <p
          className="text-[11px] font-semibold uppercase text-black/45"
          style={{ fontFamily: SANS, letterSpacing: "0.16em" }}
        >
          {project.category}
        </p>

        <p
          className={cn("mt-3 text-[15px] text-[#3a3a3c]", !expanded && "line-clamp-2")}
          style={{ fontFamily: SANS, lineHeight: 1.65 }}
        >
          {project.description}
        </p>

        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 self-start text-[12.5px] font-medium text-black/45 transition-colors hover:text-black"
          style={{ fontFamily: SANS }}
        >
          {expanded ? "Less" : "More"}
          <ChevronDown
            size={13}
            strokeWidth={2}
            className={cn("transition-transform duration-300", expanded && "rotate-180")}
          />
        </button>

        <p
          className="mt-4 text-[13px] leading-relaxed text-black/55"
          style={{ fontFamily: SANS }}
          aria-label={`Built with ${project.tags.join(", ")}`}
        >
          {project.tags.join("  ·  ")}
        </p>

        <div className="mt-auto pt-5">
          <div className="border-t border-black/[0.08]" />
          <div className="flex items-start gap-4 pt-4">
            {!project.liveUrl && !project.githubUrl ? (
              <span
                className="inline-flex items-center border border-dashed border-black/20 px-3 py-1.5 text-[11px] tracking-[0.14em] text-black/45"
                style={{ fontFamily: MONO }}
              >
                Coming soon
              </span>
            ) : null}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Live preview of ${project.title}`}
                className="group/link flex flex-col items-center gap-1.5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 group-hover/link:border-black/25 group-hover/link:text-black group-hover/link:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <Globe size={14} strokeWidth={1.5} />
                </span>
                <span
                  className="text-[10px] font-medium tracking-wide text-black/45 transition-colors group-hover/link:text-black"
                  style={{
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                  }}
                >
                  Live
                </span>
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Source code of ${project.title}`}
                className="group/link flex flex-col items-center gap-1.5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/60 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all duration-200 group-hover/link:border-black/25 group-hover/link:text-black group-hover/link:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <Github size={14} strokeWidth={1.5} />
                </span>
                <span
                  className="text-[10px] font-medium tracking-wide text-black/45 transition-colors group-hover/link:text-black"
                  style={{
                    fontFamily:
                      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                  }}
                >
                  GitHub
                </span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
