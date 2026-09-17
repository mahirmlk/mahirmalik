import Image from "next/image";
import type { Project } from "@/types";

interface ProjectHeroProps {
  project: Project;
  className?: string;
  style?: React.CSSProperties;
}

function SellableScene() {
  const route = "M20 120 C 100 88, 200 142, 300 78";

  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="sell-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="black" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill="url(#sell-grid)" />

      <path d={route} fill="none" stroke="black" strokeOpacity="0.14" strokeWidth="1.2" />

      <rect x="152" y="111" width="7" height="7" fill="white" stroke="black" strokeOpacity="0.5" strokeWidth="1.2" transform="rotate(45 155.5 114.5)" />

      <circle cx="300" cy="78" r="6" fill="none" stroke="black" strokeOpacity="0.4" strokeWidth="1.2" />

      <circle r="2.4" fill="black" fillOpacity="0.55">
        <animateMotion dur="8s" repeatCount="indefinite" path={route} />
      </circle>
      <circle r="2.4" fill="black" fillOpacity="0.35">
        <animateMotion dur="8s" begin="2.6s" repeatCount="indefinite" path={route} />
      </circle>
      <circle r="2.4" fill="black" fillOpacity="0.7">
        <animateMotion dur="8s" begin="5.2s" repeatCount="indefinite" path={route} />
      </circle>

      <circle cx="300" cy="78" r="2.2" fill="black">
        <animate attributeName="opacity" values="0.15;1;0.15" dur="2.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function ConfluenceScene() {
  const dots: Array<[number, number]> = [
    [36, 118], [52, 96], [64, 130], [84, 112], [96, 140],
    [196, 52], [216, 40], [236, 62], [252, 44], [270, 66], [246, 84]
  ];

  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="conf-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="black" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill="url(#conf-grid)" />

      {dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i < 5 ? 2 : 2.4}
          fill="black"
          fillOpacity={i < 5 ? 0.4 : 0.7}
          className="p-drift"
          style={{ animationDelay: `${(i % 6) * 0.6}s` }}
        />
      ))}

      <path
        d="M30 148 C 90 70, 170 150, 300 52"
        fill="none"
        stroke="black"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <animate
          attributeName="d"
          dur="9s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          values="M30 148 C 90 70, 170 150, 300 52;
                  M30 130 C 90 120, 170 84, 300 78;
                  M30 148 C 90 70, 170 150, 300 52"
        />
      </path>
    </svg>
  );
}

function HelionScene() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="helion-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="black" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill="url(#helion-grid)" />

      <path d="M24 132 C 100 128, 150 96, 168 88" fill="none" stroke="black" strokeOpacity="0.14" strokeWidth="1.2" />
      <path d="M296 132 C 220 128, 170 96, 152 88" fill="none" stroke="black" strokeOpacity="0.14" strokeWidth="1.2" />
      <path d="M64 48 C 110 54, 136 70, 152 84" fill="none" stroke="black" strokeOpacity="0.1" strokeWidth="1.2" />

      <rect x="140" y="68" width="40" height="44" rx="6" fill="white" stroke="black" strokeOpacity="0.45" strokeWidth="1.2" />
      <rect x="148" y="78" width="24" height="3" rx="1.5" fill="black" fillOpacity="0.18">
        <animate attributeName="width" values="8;24;12;24;8" dur="7s" repeatCount="indefinite" />
      </rect>
      <rect x="148" y="87" width="16" height="3" rx="1.5" fill="black" fillOpacity="0.1">
        <animate attributeName="width" values="16;6;20;6;16" dur="7s" repeatCount="indefinite" />
      </rect>
      <rect x="148" y="96" width="10" height="3" rx="1.5" fill="black" fillOpacity="0.06">
        <animate attributeName="width" values="10;20;6;20;10" dur="7s" repeatCount="indefinite" />
      </rect>

      <circle r="2.4" fill="black" fillOpacity="0.55">
        <animateMotion dur="6s" repeatCount="indefinite" path="M24 132 C 100 128, 150 96, 168 88" />
      </circle>
      <circle r="2.4" fill="black" fillOpacity="0.35">
        <animateMotion dur="6s" begin="3s" repeatCount="indefinite" path="M296 132 C 220 128, 170 96, 152 88" />
      </circle>
      <circle r="2.2" fill="black" fillOpacity="0.4">
        <animate attributeName="opacity" values="0.15;1;0.15" dur="3s" repeatCount="indefinite" />
        <animateMotion dur="6s" begin="1.5s" repeatCount="indefinite" path="M64 48 C 110 54, 136 70, 152 84" />
      </circle>
    </svg>
  );
}

export function ProjectHero({ project, className = "", style }: ProjectHeroProps) {
  const isComingSoon = project.slug === "helion" && !project.image;

  if (project.image) {
    return (
      <div
        role="img"
        aria-label={`${project.title} preview`}
        className={`relative overflow-hidden bg-white ${className}`}
        style={style}
      >
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${project.title} preview`}
      className={`relative flex items-center justify-center overflow-hidden bg-white text-black ${className}`}
      style={style}
    >
      {project.slug === "confluence" ? <ConfluenceScene /> : null}
      {project.slug === "helion" ? <HelionScene /> : null}
      {project.slug !== "confluence" && project.slug !== "helion" ? <SellableScene /> : null}

      {project.slug === "helion" ? (
        <p
          className="mono absolute left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-black/55"
          style={{ top: "22px" }}
        >
          {project.category}
        </p>
      ) : null}

      <div className="relative px-6 text-center transition duration-500 group-hover:scale-[1.03]">
        {project.slug !== "helion" ? (
          <p className="mono text-[10px] uppercase tracking-[0.32em] text-black/55">
            {project.category}
          </p>
        ) : null}
        <p className="mt-2.5 text-[clamp(2.3rem,5.5vw,3.4rem)] font-semibold lowercase leading-none tracking-[-0.05em]">
          {project.title}
        </p>
      </div>

      {isComingSoon ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent"
          />
          <span className="mono absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-black/10 bg-white/85 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-black/60 backdrop-blur-sm">
            Coming soon
          </span>
        </>
      ) : null}
    </div>
  );
}
