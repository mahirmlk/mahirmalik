import type { Project } from "@/types";
import { ProjectCard } from "@/components/work/ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div id="project-list" className="projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
