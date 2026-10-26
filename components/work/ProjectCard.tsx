import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const detailsUrl = `/work/${project.slug}`;

  return (
    <article className="work-project">
      <div className="work-project-copy">
        <p className="work-project-category">{project.category}</p>
        <div className="work-project-heading">
          <h2>{project.title}</h2>
          {!project.comingSoon ? (
            <Link href={detailsUrl} aria-label={`Read the ${project.title} case study`}>
              <span>Case study</span>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          ) : (
            <span className="work-project-status">In progress</span>
          )}
        </div>
        <p className="work-project-description">{project.description}</p>
      </div>

      <footer className="work-project-footer">
        <ul aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <div className="work-project-links">
          {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">Live <ArrowUpRight aria-hidden="true" /></a> : null}
          {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer">Source <ArrowUpRight aria-hidden="true" /></a> : null}
        </div>
      </footer>
    </article>
  );
}
