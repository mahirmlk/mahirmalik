"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Project } from "@/types";
import { ProjectCardCover } from "@/components/work/ProjectCardCover";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const detailsUrl = `/work/${project.slug}`;

  return (
    <article className="project-card group flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.14)] transition-all duration-300 hover:border-black/[0.14] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_24px_48px_-16px_rgba(0,0,0,0.18)]">
      {project.comingSoon ? (
        <ProjectCardCover project={project} className="project-card-cover aspect-[16/9]" />
      ) : (
        <Link href={detailsUrl} aria-label={`View ${project.title}`} className="block">
          <ProjectCardCover project={project} className="project-card-cover aspect-[16/9]" />
        </Link>
      )}

      <div className="project-card-body flex flex-1 flex-col px-6 pb-4 pt-6 sm:px-7 sm:pt-7">
        <p
          className={cn("text-[15px] text-[#3a3a3c]", !expanded && "line-clamp-2")}
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

        <div className="mt-auto pt-4">
          <div className="border-t border-black/[0.08]" />
          <div className="flex items-center justify-center gap-8 pb-1 pt-3">
            {!project.liveUrl && !project.githubUrl ? (
              <span
                className="text-[13px] font-medium text-black/50"
                style={{ fontFamily: SANS }}
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
                className="text-[13px] font-medium text-black/70 transition-colors hover:text-black"
                style={{ fontFamily: SANS }}
              >
                Live
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Source code of ${project.title}`}
                className="text-[13px] font-medium text-black/70 transition-colors hover:text-black"
                style={{ fontFamily: SANS }}
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
