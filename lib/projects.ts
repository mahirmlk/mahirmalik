import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "sellable",
    title: "Sellable",
    category: "Agentic Commerce",
    description:
      "Sellable lets AI agents buy stuff on their own, with guardrails that actually hold. They get a storefront they can read: find products, haggle quotes, pass policy checks, and pay over real Razorpay rails. Every decision lands in an audit ledger. The model suggests, deterministic code decides.",
    features: [
      "Agent gateway with machine-readable discovery and HMAC-signed transactional API",
      "LangGraph seller and buyer agents bounded by an LLM-independent policy engine",
      "Per-transaction single-use consent, spend caps, floor prices, and human-in-the-loop thresholds",
      "Razorpay test-mode payments with webhook reconciliation, refunds, and idempotent orders",
      "XAI Ledger audit trail with reasoning summaries plus 7 deterministic evaluation scenarios"
    ],
    metrics: [
      { label: "Agents", value: "Buyer + Seller" },
      { label: "Rails", value: "Razorpay" },
      { label: "Evals", value: "7 scenarios" }
    ],
    year: 2026,
    tags: ["Python", "FastAPI", "LangGraph", "Next.js 16", "Supabase", "Razorpay"],
    image: "/assets/img/projects/sellable.webp",
    liveUrl: "https://sellable.shop/",
    githubUrl: "https://github.com/mahirmlk/sellable",
    featured: true
  },
  {
    slug: "confluence",
    title: "Confluence",
    category: "ML Visualization",
    description:
      "Confluence teaches ML by showing it. Thirty-eight real scikit-learn algorithms, decision boundaries you can poke at, training you can scrub through frame by frame, and 25 datasets from Iris to Titanic.",
    features: [
      "38 algorithms across classification, regression, clustering, and dimensionality reduction",
      "Real scikit-learn compute with Canvas2D decision-boundary heatmaps and 3D uncertainty surfaces",
      "Animated training playground with loss curves, playback controls, and step-through tree builder",
      "25 datasets spanning Kaggle real-world data and synthetic generators, plus PCA explorer",
      "Algorithm race, benchmark suite, prediction explanations, and auto-generated Python code"
    ],
    metrics: [
      { label: "Algorithms", value: "38" },
      { label: "Datasets", value: "25" },
      { label: "Compute", value: "scikit-learn" }
    ],
    year: 2026,
    tags: ["Next.js 15", "FastAPI", "scikit-learn", "TypeScript", "Redis", "Docker"],
    image: "/assets/img/projects/confluence.webp",
    liveUrl: "https://confluence.website/",
    githubUrl: "https://github.com/mahirmlk/Confluence",
    featured: true
  },
  {
    slug: "helion",
    title: "Helion",
    category: "Agent Harness",
    description:
      "Helion is an agent harness that lives in your terminal and on your desktop. Watch runs unfold, steer them mid-flight, and approve every tool call from one calm surface. Still cooking, coming soon.",
    features: [
      "Terminal and desktop frontends over one shared agent runtime",
      "Live run timeline with steering, interrupts, and replay",
      "Policy gates for tool calls with human-in-the-loop approval",
      "Session capture for replaying and diffing agent behavior"
    ],
    metrics: [
      { label: "Surfaces", value: "TUI + App" },
      { label: "Control", value: "Inline" },
      { label: "Status", value: "Soon" }
    ],
    year: 2026,
    tags: ["TypeScript", "Tauri", "Ink", "React"],
    featured: false
  }
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
