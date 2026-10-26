"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { projects } from "@/lib/projects";

const projectNotes: Record<string, string> = {
  sellable:
    "An agent-ready storefront where AI buyers can find products and negotiate within seller-set rules. Purchases pass through consent checks, spending limits, and Razorpay test payments, with each step recorded for review.",
  confluence:
    "An interactive way to see machine learning at work. Compare 38 scikit-learn algorithms, explore 25 datasets, and step through how models learn with decision-boundary views, loss curves, and a tree builder.",
  helion:
    "An agent harness for your terminal and desktop. Watch runs unfold, steer them mid-flight, and approve tool calls as they happen.",
};

const projectStacks: Record<string, string[]> = {
  sellable: ["Python", "FastAPI", "LangGraph", "Razorpay"],
  confluence: ["Next.js", "FastAPI", "scikit-learn", "TypeScript"],
};

function ProjectRow({ project }: { project: Project }) {
  const reduceMotion = useReducedMotion();
  const note = projectNotes[project.slug] ?? project.description;
  const stack = projectStacks[project.slug] ?? project.tags.slice(0, 4);

  return (
    <motion.article
      className="project-showcase-row"
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
    >
      <h3>
        {project.comingSoon ? project.title : <Link href={`/work/${project.slug}`}>{project.title}</Link>}
      </h3>
      <p className="project-showcase-description">{note}</p>
      <div className="project-showcase-stack-row">
        <ul className="project-showcase-stack" aria-label={`${project.title} main technology stack`}>
          {stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
        {project.liveUrl ? (
          <a
            className="project-showcase-live-link"
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title} live project`}
            title="Open live project"
          >
            <ArrowUpRight aria-hidden="true" />
          </a>
        ) : project.comingSoon ? (
          <span className="project-showcase-coming">In progress</span>
        ) : null}
      </div>
    </motion.article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="projects-showcase">
      <aside className="projects-showcase-aside">
        <h2>A few things I’ve been building.</h2>
        <p className="projects-showcase-intro">
          I work on AI systems, agents, and machine-learning tools. Each project started with something I wanted to understand or make easier to use.
        </p>
        <Link href="/work" className="projects-showcase-archive">
          Full archive <ArrowRight aria-hidden="true" />
        </Link>
      </aside>

      <div className="projects-showcase-list">
        {projects.map((project) => <ProjectRow key={project.slug} project={project} />)}
      </div>
    </section>
  );
}
