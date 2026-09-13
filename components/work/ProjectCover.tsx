import type { Project } from "@/types";

const TAGLINES: Record<string, string> = {
  sellable: "agents that buy things.",
  confluence: "watch ml work.",
  helion: "an ai agent harness.",
};

const PIXEL_STACK = "var(--font-pixel), 'Berkeley Mono', ui-monospace, Menlo, monospace";

export function ProjectCover({ project, className = "" }: { project: Project; className?: string }) {
  const tagline = TAGLINES[project.slug] ?? project.category.toLowerCase();
  return (
    <div
      role="img"
      aria-label={`${project.title} preview`}
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#2b2b2f] ${className}`}
    >
      <span
        aria-hidden
        className="px-6 text-center lowercase leading-none text-[#f4f4f2]"
        style={{ fontFamily: PIXEL_STACK, fontSize: "clamp(2.6rem, 6vw, 3.9rem)" }}
      >
        {project.title}
      </span>
      <span
        aria-hidden
        className="mt-2 px-6 text-center lowercase text-[#b9b9c0]"
        style={{
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
          letterSpacing: "0.02em",
        }}
      >
        {tagline}
      </span>
    </div>
  );
}
