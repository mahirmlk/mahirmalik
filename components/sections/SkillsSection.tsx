import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface StackLogo {
  name: string;
  src?: string;
  darkSrc?: string;
}

interface StackCategory {
  title: string;
  wide?: boolean;
  items: StackLogo[];
}

// Icons are vendored to /public/assets/icons (see scripts/icon-map.json) so
// the stack section makes zero third-party requests at runtime.
const si = (slug: string, color: string) => `/assets/icons/si-${slug}-${color}.svg`;
const favicon = (domain: string) => `/assets/icons/fav-${domain}.png`;

const LIGHT_DARK = "f6f7f8";

const stackCategories: StackCategory[] = [
  {
    title: "Programming Languages",
    items: [
      { name: "Python", src: si("python", "3776AB") },
      { name: "TypeScript", src: si("typescript", "3178C6") },
      { name: "SQL", src: si("sqlite", "003B57") },
      {
        name: "Rust",
        src: si("rust", "111111"),
        darkSrc: si("rust", LIGHT_DARK),
      },
    ],
  },
  {
    title: "Frontend Engineering",
    items: [
      { name: "React", src: si("react", "61DAFB") },
      {
        name: "Next.js",
        src: si("nextdotjs", "111111"),
        darkSrc: si("nextdotjs", LIGHT_DARK),
      },
      { name: "Tailwind CSS", src: si("tailwindcss", "06B6D4") },
    ],
  },
  {
    title: "Backend Engineering",
    wide: true,
    items: [
      { name: "FastAPI", src: si("fastapi", "009688") },
      { name: "Pydantic", src: si("pydantic", "E92063") },
      { name: "SQLAlchemy", src: si("sqlalchemy", "D71F00") },
      { name: "Alembic", src: "/assets/icons/sqlalchemy-org.png" },
      {
        name: "WebSockets",
        src: si("socketdotio", "111111"),
        darkSrc: si("socketdotio", LIGHT_DARK),
      },
      { name: "GraphQL", src: si("graphql", "E10098") },
      { name: "gRPC", src: favicon("grpc.io") },
      { name: "Celery", src: si("celery", "37814A") },
      { name: "Uvicorn", src: favicon("uvicorn.dev") },
    ],
  },
  {
    title: "Data Analysis & Computing",
    wide: true,
    items: [
      { name: "NumPy", src: si("numpy", "013243") },
      { name: "Pandas", src: si("pandas", "150458") },
      { name: "SciPy", src: si("scipy", "8CAAE6") },
      {
        name: "Matplotlib",
        src: "/assets/icons/matplotlib-light.svg",
        darkSrc: "/assets/icons/matplotlib-dark.svg",
      },
      { name: "Plotly", src: si("plotly", "3F4F75") },
      { name: "Jupyter", src: si("jupyter", "F37626") },
      { name: "PyArrow", src: si("apachearrow", "E0251B") },
      { name: "Polars", src: si("polars", "CD792C") },
    ],
  },
  {
    title: "Machine Learning",
    items: [
      { name: "PyTorch", src: si("pytorch", "EE4C2C") },
      { name: "scikit-learn", src: si("scikitlearn", "F7931E") },
    ],
  },
  {
    title: "AI & LLM Engineering",
    items: [
      { name: "Hugging Face", src: si("huggingface", "FFD21E") },
      { name: "Transformers", src: favicon("huggingface.co") },
      { name: "LangChain", src: favicon("langchain.com") },
      { name: "LlamaIndex", src: favicon("llamaindex.ai") },
      {
        name: "Ollama",
        src: si("ollama", "111111"),
        darkSrc: si("ollama", LIGHT_DARK),
      },
      { name: "vLLM", src: favicon("docs.vllm.ai") },
      { name: "LiteLLM", src: favicon("docs.litellm.ai") },
    ],
  },
  {
    title: "Agentic Systems",
    wide: true,
    items: [
      { name: "LangGraph", src: favicon("langchain.com") },
      { name: "CrewAI", src: favicon("crewai.com") },
      { name: "AutoGen", src: favicon("microsoft.com") },
      { name: "PydanticAI", src: si("pydantic", "E92063") },
      { name: "MCP", src: favicon("modelcontextprotocol.io") },
      { name: "OpenAI SDK", src: favicon("openai.com") },
      { name: "Google ADK", src: favicon("ai.google.dev") },
    ],
  },
  {
    title: "AI Agents",
    items: [
      { name: "OpenCode", src: favicon("opencode.ai") },
      { name: "Claude Code", src: si("anthropic", "D97757") },
      { name: "Codex", src: favicon("openai.com") },
      { name: "Hermes", src: favicon("hermes-agent.nousresearch.com") },
      { name: "Pi", src: favicon("pi.dev") },
      { name: "Orca", src: favicon("onorca.dev") },
      { name: "Herder", src: favicon("herdr.dev") },
    ],
  },
  {
    title: "Databases & Data Stores",
    items: [
      { name: "PostgreSQL", src: si("postgresql", "4169E1") },
      { name: "MySQL", src: si("mysql", "4479A1") },
      { name: "Redis", src: si("redis", "DC382D") },
      { name: "Supabase", src: si("supabase", "3ECF8E") },
    ],
  },
  {
    title: "Workflow & Orchestration",
    items: [
      { name: "n8n", src: si("n8n", "EA4B71") },
      { name: "Zapier", src: si("zapier", "FF4F00") },
      {
        name: "Temporal",
        src: si("temporal", "111111"),
        darkSrc: si("temporal", LIGHT_DARK),
      },
    ],
  },
  {
    title: "Cloud & Infrastructure",
    wide: true,
    items: [
      { name: "AWS", src: favicon("aws.amazon.com") },
      { name: "Oracle Cloud", src: favicon("oracle.com") },
      { name: "Docker", src: si("docker", "2496ED") },
      { name: "Kubernetes", src: si("kubernetes", "326CE5") },
      { name: "Cloudflare", src: si("cloudflare", "F38020") },
      {
        name: "Vercel",
        src: si("vercel", "111111"),
        darkSrc: si("vercel", LIGHT_DARK),
      },
      {
        name: "Railway",
        src: si("railway", "111111"),
        darkSrc: si("railway", LIGHT_DARK),
      },
      { name: "Fly.io", src: favicon("fly.io") },
      { name: "Render", src: si("render", "46E3B7") },
      { name: "Terraform", src: si("terraform", "7B42BC") },
      { name: "Nginx", src: si("nginx", "009639") },
      { name: "GitHub Actions", src: si("githubactions", "2088FF") },
    ],
  },
  {
    title: "Monitoring & Observability",
    items: [
      { name: "OpenTelemetry", src: si("opentelemetry", "425CC7") },
      { name: "Prometheus", src: si("prometheus", "E6522C") },
      { name: "Grafana", src: si("grafana", "F46800") },
      { name: "Langfuse", src: favicon("langfuse.com") },
    ],
  },
  {
    title: "Developer Tooling",
    wide: true,
    items: [
      { name: "Git", src: si("git", "F05032") },
      {
        name: "GitHub",
        src: si("github", "111111"),
        darkSrc: si("github", LIGHT_DARK),
      },
      { name: "VS Code", src: favicon("code.visualstudio.com") },
      { name: "Postman", src: si("postman", "FF6C37") },
      { name: "Linux", src: si("linux", "FCC624") },
      { name: "Bun", src: si("bun", "FB702E") },
      { name: "pnpm", src: si("pnpm", "F69220") },
      { name: "uv", src: favicon("docs.astral.sh") },
      { name: "MLflow", src: si("mlflow", "0194E2") },
    ],
  },
];

function StackIcon({ item }: { item: StackLogo }) {
  if (!item.src) {
    return (
      <span
        aria-hidden
        className="mono flex h-7 w-7 items-center justify-center text-base font-semibold uppercase text-[var(--fg-subtle)] sm:h-8 sm:w-8 sm:text-lg"
      >
        {item.name.charAt(0)}
      </span>
    );
  }

  if (item.darkSrc) {
    return (
      <>
        <img
          src={item.src}
          alt=""
          aria-hidden
          className="h-7 w-7 object-contain sm:h-8 sm:w-8 dark:hidden"
          loading="lazy"
        />
        <img
          src={item.darkSrc}
          alt=""
          aria-hidden
          className="hidden h-7 w-7 object-contain sm:h-8 sm:w-8 dark:block"
          loading="lazy"
        />
      </>
    );
  }

  return (
    <img
      src={item.src}
      alt=""
      aria-hidden
      className="h-7 w-7 object-contain sm:h-8 sm:w-8"
      loading="lazy"
    />
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="site-container section-block">
      <Reveal>
        <p className="section-eyebrow">The Stack</p>
        <h2 className="section-title section-title-sm">
          What I build with.
        </h2>
        <p className="section-copy mt-5">
          A bunch of languages, frameworks, databases, and AI tools that somehow turn ideas
          into functioning software. The stack changes, the building doesn&apos;t.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {stackCategories.map((category, index) => (
          <Reveal
            key={category.title}
            delay={Math.min(index, 6) * 30}
            className={cn(category.wide && "sm:col-span-2 xl:col-span-2")}
          >
            <div className="h-full rounded-[24px] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.16)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_0_1px_rgba(15,23,42,0.07),0_12px_32px_-14px_rgba(15,23,42,0.18)] [backdrop-filter:blur(24px)_saturate(130%)] [-webkit-backdrop-filter:blur(24px)_saturate(130%)] transition-all duration-300 hover:-translate-y-[2px] hover:border-[rgba(255,255,255,0.45)] hover:bg-[rgba(255,255,255,0.2)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_1px_rgba(15,23,42,0.09),0_20px_48px_-14px_rgba(15,23,42,0.24)] sm:p-6 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_0_1px_rgba(0,0,0,0.35),0_12px_32px_-14px_rgba(0,0,0,0.75)]">
              <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--fg)]">
                {category.title}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-4 sm:mt-5 sm:gap-x-6 sm:gap-y-5">
                {category.items.map((item) => (
                  <div
                    key={`${category.title}-${item.name}`}
                    title={item.name}
                    aria-label={item.name}
                    className="flex w-14 flex-col items-center gap-1.5 text-center sm:w-16 sm:gap-2"
                  >
                    <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[18px] border border-white/60 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_2px_10px_-2px_rgba(0,0,0,0.14)] sm:h-14 sm:w-14 dark:border-white/10 dark:bg-white/[0.08] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_10px_-2px_rgba(0,0,0,0.6)]">
                      <StackIcon item={item} />
                    </div>
                    <span className="w-full break-words text-[11px] leading-tight text-[var(--fg-muted)] sm:text-[11.5px]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
