import Image from "next/image";
import type { Project } from "@/types";

const TAGLINES: Record<string, string> = {
  sellable: "agents that buy things.",
  confluence: "watch ml work.",
  helion: "an ai agent harness.",
};

const PIXEL_STACK = "var(--font-pixel), 'Berkeley Mono', ui-monospace, Menlo, monospace";

export function ProjectCardCover({ project, className = "" }: { project: Project; className?: string }) {
  const tagline = TAGLINES[project.slug] ?? project.category.toLowerCase();
  const isComingSoon = project.slug === "helion" && !project.image;

  if (project.image) {
    return (
      <div
        role="img"
        aria-label={`${project.title} preview`}
        className={`relative w-full overflow-hidden bg-white ${className}`}
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
    );
  }

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
      {isComingSoon ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"
          />
          <span className="mono absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-black/10 bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-black/60 backdrop-blur-sm">
            Coming soon
          </span>
        </>
      ) : null}
    </div>
  );
}
