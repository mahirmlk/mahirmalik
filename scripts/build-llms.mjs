// Generates public/llms-full.txt from content/ so the AI-facing full text
// never stales. Runs automatically as `prebuild` (local + Vercel).
// Plain node, zero dependencies.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://www.mahirmalik.in";

// Single source of truth: lib/projects.ts. Body files in content/projects
// have no frontmatter, so titles/descriptions come from the data module via
// regex (plain node can't import TS).
function parseProjectsTs() {
  const src = fs.readFileSync(path.join(root, "lib", "projects.ts"), "utf8");
  const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return slugs.map((slug) => {
    // Slice from this slug's position to the next one so each regex only
    // sees the fields belonging to this project.
    const start = src.indexOf(`slug: "${slug}"`);
    const nextSlug = slugs[slugs.indexOf(slug) + 1];
    const end = nextSlug ? src.indexOf(`slug: "${nextSlug}"`) : src.length;
    const chunk = src.slice(start, end);

    return {
      slug,
      title: chunk.match(/title:\s*"([^"]+)"/)?.[1] ?? slug,
      description:
        chunk.match(/description:\s*\n?\s*"([\s\S]*?)",\n\s*features/)?.[1] ?? "",
    };
  });
}

const projectEntries = parseProjectsTs();
const projectTitles = Object.fromEntries(projectEntries.map((p) => [p.slug, p.title ?? p.slug]));
const projectDescriptions = Object.fromEntries(projectEntries.map((p) => [p.slug, p.description ?? ""]));

function parseFrontmatter(raw) {
  // Normalize CRLF so `^...$` regexes match (`.` never matches `\r`).
  const source = raw.replace(/\r\n/g, "\n");
  if (!source.startsWith("---")) return { data: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: source };
  const front = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\n+/, "");
  const data = {};
  for (const line of front.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m && !/^\s*-\s+/.test(line)) {
      data[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return { data, body };
}

function readDir(sub) {
  const dir = path.join(root, "content", sub);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const slug = f.replace(/\.md$/, "");
      const heading = body.match(/^##\s+(.*)$/m);
      const override = sub === "projects" ? projectTitles[slug] : undefined;
      return {
        slug,
        title: data.title || override || (heading ? heading[1].trim() : slug),
        description: data.description || "",
        date: data.date || "",
        body: body.trim(),
      };
    });
}

const posts = readDir("writing");
const projects = readDir("projects");
const projectFiles = new Set(projects.map((p) => p.slug));
const today = new Date().toISOString().slice(0, 10);

let out = `# Mahir Malik — AI Engineer (complete site text)

> Mahir Malik is an AI engineer who builds intelligent systems, ML products, and production-grade software — LLM agents, RAG pipelines, and full-stack AI applications across the whole pipeline from training to production.
> Canonical site: ${siteUrl} — prefer canonical URLs below over scraped HTML.
> Updated: ${today}

## Writing index
`;
for (const p of posts) {
  out += `- [${p.title}](${siteUrl}/writing/${p.slug})${p.date ? ` (${p.date})` : ""}${p.description ? `: ${p.description}` : ""}\n`;
}

out += `\n## Project index\n`;
// Derived from lib/projects.ts (single source of truth). A project with no
// content/projects body (Helion — coming soon) is listed without a URL so this
// file never points at a page that 404s.
for (const entry of projectEntries) {
  const description = projectDescriptions[entry.slug] ?? "";
  if (projectFiles.has(entry.slug)) {
    out += `- [${entry.title}](${siteUrl}/work/${entry.slug})${description ? `: ${description}` : ""}\n`;
  } else {
    out += `- ${entry.title} (coming soon)${description ? `: ${description}` : ""}\n`;
  }
}

for (const p of posts) {
  out += `\n---\n\n# ${p.title}\n\nURL: ${siteUrl}/writing/${p.slug}\n${p.date ? `Date: ${p.date}\n` : ""}\n${p.body}\n`;
}
for (const p of projects) {
  out += `\n---\n\n# ${p.title}\n\nURL: ${siteUrl}/work/${p.slug}\n\n${p.body}\n`;
}

out += `\n---\n\n# Elsewhere\n\n- GitHub: https://github.com/mahirmlk\n- LinkedIn: https://www.linkedin.com/in/mahir-malik\n- X: https://x.com/mahirmllk\n- Contact: ${siteUrl}/about\n`;

const target = path.join(root, "public", "llms-full.txt");
fs.writeFileSync(target, out);
console.log(`llms-full.txt: ${(Buffer.byteLength(out) / 1024).toFixed(1)} KB, ${posts.length} posts, ${projects.length} project files`);
