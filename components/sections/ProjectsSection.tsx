"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { projects } from "@/lib/projects";

export function ProjectsSection() {
  const categories = [...new Set(projects.map((project) => project.category))];
  const [selectedCategory, setSelectedCategory] = useState<string>("All Projects");
  const visibleProjects = useMemo(() => {
    const base =
      selectedCategory === "All Projects"
        ? projects
        : projects.filter((project) => project.category === selectedCategory);

    return [...base].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [selectedCategory]);

  return (
    <section id="projects" className="site-container section-block">
      <Reveal>
        <div className="space-y-8">
          <div>
            <p className="section-eyebrow">Projects</p>
            <h2 className="section-title">Selected works showcasing engineering depth and problem-solving.</h2>
            <p className="section-copy mt-5">
              A focused selection of product and machine learning work spanning agent systems,
              backend orchestration, and causal inference pipelines.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("All Projects")}
                className={`glass-chip mono rounded-full px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] transition ${
                  selectedCategory === "All Projects"
                    ? "border-[var(--border-hover)] text-[var(--fg)]"
                    : "text-[var(--fg-subtle)]"
                }`}
              >
                All Projects
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`glass-chip mono rounded-full px-3.5 py-2 text-[10px] uppercase tracking-[0.16em] transition ${
                    selectedCategory === category
                      ? "border-[var(--border-hover)] text-[var(--fg)]"
                      : "text-[var(--fg-subtle)]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <Link
              href="/work"
              className="mono inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:text-[var(--fg)] md:self-auto"
            >
              Full archive <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-8">
        <ProjectGrid projects={visibleProjects} />
      </Reveal>
    </section>
  );
}
