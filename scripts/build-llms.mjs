// Build concise and full-text discovery files from the site's content sources.
// These are optional plain-text references for assistants and other clients.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteSource = fs.readFileSync(path.join(root, "lib", "site.ts"), "utf8");
const siteUrl = siteSource.match(/export const siteUrl = "([^"]+)"/)?.[1] ?? "";
const siteDescription = siteSource.match(/export const siteDescription =\s*"([^"]+)"/)?.[1] ?? "";
const personEmail = siteSource.match(/export const personEmail = "([^"]+)"/)?.[1] ?? "";
const sameAsSource = siteSource.match(/export const personSameAs = \[([\s\S]*?)\];/)?.[1] ?? "";
const socialUrls = [...sameAsSource.matchAll(/"(https:\/\/[^\"]+)"/g)].map((match) => match[1]);

function parseProjectsTs() {
  const source = fs.readFileSync(path.join(root, "lib", "projects.ts"), "utf8");
  const starts = [...source.matchAll(/slug:\s*"([^"]+)"/g)];
  return starts.map((match, index) => {
    const start = match.index ?? 0;
    const end = starts[index + 1]?.index ?? source.length;
    const project = source.slice(start, end);
    const tags = project.match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? "";
    return {
      slug: match[1],
      title: project.match(/title:\s*"([^"]+)"/)?.[1] ?? match[1],
      category: project.match(/category:\s*"([^"]+)"/)?.[1] ?? "Project",
      description: project.match(/description:\s*\n?\s*"([\s\S]*?)",\n\s*features/)?.[1] ?? "",
      tags: [...tags.matchAll(/"([^"]+)"/g)].map((tag) => tag[1]),
      comingSoon: /comingSoon:\s*true/.test(project),
    };
  });
}

function parseFrontmatter(raw) {
  const source = raw.replace(/\r\n/g, "\n");
  if (!source.startsWith("---")) return { data: {}, body: source };
  const end = source.indexOf("\n---", 3);
  if (end === -1) return { data: {}, body: source };
  const front = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\n+/, "");
  const data = {};
  for (const line of front.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match && !/^\s*-\s+/.test(line)) {
      data[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, "$2");
    }
  }
  return { data, body };
}

function readDir(directory) {
  const absolutePath = path.join(root, "content", directory);
  if (!fs.existsSync(absolutePath)) return [];
  return fs.readdirSync(absolutePath)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(absolutePath, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const slug = file.replace(/\.md$/, "");
      return {
        slug,
        title: data.title || body.match(/^##\s+(.*)$/m)?.[1]?.trim() || slug,
        description: data.description || "",
        date: data.date || "",
        body: body.trim(),
      };
    });
}

const projects = parseProjectsTs();
const posts = readDir("writing").sort((a, b) => b.date.localeCompare(a.date));
const projectBodies = readDir("projects");
const projectBodySlugs = new Set(projectBodies.map((project) => project.slug));

let index = `# Mahir Malik — AI Engineer\n\n> ${siteDescription}\n\n`;
index += `## Site\n- [Home](${siteUrl}/): Portfolio of Mahir Malik, AI engineer.\n- [About](${siteUrl}/about): Profile, working approach, skills, and contact details.\n- [Projects](${siteUrl}/work): Software projects and case studies.\n- [Articles](${siteUrl}/writing): Technical writing on agent systems and machine learning.\n\n`;
index += "## Projects\n";
for (const project of projects) {
  const url = `${siteUrl}/work/${project.slug}`;
  if (project.comingSoon || !projectBodySlugs.has(project.slug)) {
    index += `- ${project.title} (${project.category}; in progress): ${project.description}\n`;
  } else {
    index += `- [${project.title}](${url}) (${project.category}): ${project.description}\n`;
  }
}
index += "\n## Articles\n";
for (const post of posts) {
  index += `- [${post.title}](${siteUrl}/writing/${post.slug})${post.date ? ` (${post.date})` : ""}${post.description ? `: ${post.description}` : ""}\n`;
}
index += `\n## Contact\n- Email: ${personEmail}\n- [RSS feed](${siteUrl}/feed.xml)\n\n## Profiles\n`;
for (const url of socialUrls) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  index += `- [${host}](${url})\n`;
}

let fullText = `# Mahir Malik — AI Engineer\n\n> ${siteDescription}\n> Canonical site: ${siteUrl}\n\n`;
fullText += `## Project index\n${index.split("## Projects\n")[1].split("\n## Articles")[0]}\n`;
fullText += `## Article index\n${index.split("## Articles\n")[1].split("\n## Contact")[0]}\n`;
for (const post of posts) {
  fullText += `\n---\n\n# ${post.title}\n\nURL: ${siteUrl}/writing/${post.slug}\n${post.date ? `Date published: ${post.date}\n` : ""}\n${post.body}\n`;
}
for (const project of projectBodies) {
  const data = projects.find((entry) => entry.slug === project.slug);
  fullText += `\n---\n\n# ${data?.title ?? project.title}\n\nURL: ${siteUrl}/work/${project.slug}\n\n${project.body}\n`;
}
fullText += `\n---\n\n## Contact and profiles\n- Email: ${personEmail}\n`;
for (const url of socialUrls) {
  fullText += `- ${new URL(url).hostname.replace(/^www\./, "")}: ${url}\n`;
}

fs.writeFileSync(path.join(root, "public", "llms.txt"), index);
fs.writeFileSync(path.join(root, "public", "llms-full.txt"), fullText);
console.log(`Discovery files generated: ${posts.length} articles, ${projects.filter((project) => !project.comingSoon).length} published projects.`);
