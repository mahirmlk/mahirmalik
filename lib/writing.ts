import fs from "node:fs";
import path from "node:path";

export type WritingBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "diagram"; id: string; fallback: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "image"; alt: string; src: string }
  | { type: "hr" };

export type WritingPost = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  excerpt: string;
  date: string;
  updated: string;
  readTime: string;
  tldr: string;
  category: string;
  tags: string[];
  wordCount: number;
  blocks: WritingBlock[];
};

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  // Normalize CRLF so `^...$` regexes match (`.` never matches `\r`).
  const source = raw.replace(/\r\n/g, "\n");
  if (!source.startsWith("---")) {
    return { data: {}, body: source };
  }
  const end = source.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: source };
  }
  const front = source.slice(3, end).trim();
  const body = source.slice(end + 4).replace(/^\n+/, "");
  const data: Record<string, unknown> = {};
  const lines = front.split("\n");
  let currentKey: string | null = null;
  for (const line of lines) {
    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      const existing = data[currentKey];
      const value = listMatch[1].trim().replace(/^["']|["']$/g, "");
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        data[currentKey] = [value];
      }
      continue;
    }
    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim().replace(/^["']|["']$/g, "");
      if (value === "") {
        data[currentKey] = [];
      } else {
        data[currentKey] = value;
      }
    }
  }
  return { data, body };
}

function titleCaseTag(tag: string): string {
  const acronyms = new Set(["ai", "llm", "api", "ml", "rag", "cpu", "gpu"]);
  return tag
    .split("-")
    .map((word) => (acronyms.has(word.toLowerCase()) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(" ");
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?[\s:|-]+\|?[\s:|-]*$/.test(trimmed) && trimmed.includes("-");
}

function splitTableRow(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((cell) => cell.trim());
}

export function parseMarkdownBlocks(markdown: string): WritingBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: WritingBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      i++;
      continue;
    }

    // Fenced code block (or diagram placeholder: ```diagram:<id>)
    const fenceMatch = trimmed.match(/^```(\S*)\s*$/);
    if (fenceMatch) {
      const lang = fenceMatch[1].toLowerCase();
      i++;
      const codeLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "```") {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      // Trim leading/trailing blank lines but preserve internal alignment
      while (codeLines.length > 0 && codeLines[0].trim() === "") codeLines.shift();
      while (codeLines.length > 0 && codeLines[codeLines.length - 1].trim() === "") codeLines.pop();
      const code = codeLines.join("\n");
      if (lang.startsWith("diagram:")) {
        blocks.push({ type: "diagram", id: lang.slice("diagram:".length), fallback: code });
      } else {
        blocks.push({ type: "code", lang, code });
      }
      continue;
    }

    // ATX heading
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      const level = Math.min(headingMatch[1].length, 4) as 1 | 2 | 3 | 4;
      blocks.push({ type: "heading", level, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(---|\*\*\*|___)\s*$/.test(trimmed)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Blockquote group
    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", lines: quoteLines.filter((l) => l !== "" || quoteLines.length === 1) });
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitTableRow(trimmed);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitTableRow(lines[i].trim()));
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    // Image (own line)
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/);
    if (imageMatch) {
      blocks.push({ type: "image", alt: imageMatch[1], src: imageMatch[2] });
      i++;
      continue;
    }

    // List group
    const unorderedMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    const orderedMatch = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (unorderedMatch || orderedMatch) {
      const ordered = Boolean(orderedMatch);
      const items: string[] = [];
      while (i < lines.length) {
        const um = lines[i].match(/^\s*[-*+]\s+(.*)$/);
        const om = lines[i].match(/^\s*\d+[.)]\s+(.*)$/);
        const m = ordered ? om : um;
        if (!m) break;
        items.push(m[1].trim());
        i++;
      }
      if (items.length > 0) {
        blocks.push({ type: "list", ordered, items });
        continue;
      }
    }

    // Paragraph: accumulate until blank or special line
    const paraLines: string[] = [];
    while (i < lines.length) {
      const current = lines[i];
      const ct = current.trim();
      if (ct === "") break;
      if (/^```/.test(ct)) break;
      if (/^(#{1,4})\s+/.test(ct)) break;
      if (/^(---|\*\*\*|___)\s*$/.test(ct)) break;
      if (ct.startsWith(">")) break;
      if (/^\s*[-*+]\s+/.test(current)) break;
      if (/^\s*\d+[.)]\s+/.test(current)) break;
      if (ct.startsWith("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) break;
      if (/^!\[[^\]]*\]\([^)]+\)\s*$/.test(ct)) break;
      paraLines.push(current);
      i++;
    }
    if (paraLines.length > 0) {
      // Preserve explicit hard breaks (two trailing spaces) as <br />
      const text = paraLines
        .map((l) => (/  $/.test(l) ? `${l.trimEnd()}\n` : l.trim()))
        .join(" ");
      blocks.push({ type: "paragraph", text });
    } else {
      i++;
    }
  }

  return blocks;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Minimal inline markdown renderer: `code`, [links](url), **bold**, *italic*.
 * Code spans are extracted first so their contents are never reinterpreted.
 */
export function renderInlineMarkdown(source: string): string {
  const codeSpans: string[] = [];
  const withPlaceholders = escapeHtml(source).replace(/`([^`]+?)`/g, (_match, code: string) => {
    codeSpans.push(`<code class="w-inline-code">${code}</code>`);
    return `\u0000${codeSpans.length - 1}\u0000`;
  });

  const withLinks = withPlaceholders.replace(/\[([^\]]+?)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_match, text: string, href: string) => {
    const isExternal = /^https?:\/\//.test(href);
    const extra = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${href}"${extra}>${text}</a>`;
  });

  const withBold = withLinks
    .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+?)__/g, "<strong>$1</strong>");
  const withItalic = withBold.replace(/(^|[^*\w])\*([^*\n]+?)\*/g, "$1<em>$2</em>");

  // Hard breaks from trailing double-spaces
  const withBreaks = withItalic.replace(/\n/g, "<br />");

  return withBreaks.replace(/\u0000(\d+)\u0000/g, (_match, index: string) => codeSpans[Number(index)] ?? "");
}

function countWords(blocks: WritingBlock[]): number {
  let words = 0;
  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "heading") {
      words += block.text.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "list") {
      for (const item of block.items) words += item.split(/\s+/).filter(Boolean).length;
    } else if (block.type === "quote") {
      for (const line of block.lines) words += line.split(/\s+/).filter(Boolean).length;
    }
  }
  return words;
}

export function formatWritingDate(date: string): string {
  const parsed = new Date(date.length === 7 ? `${date}-01` : date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(parsed);
}

export function formatWritingDateLong(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(parsed);
}

function loadPost(slug: string): WritingPost | null {
  const filePath = path.join(WRITING_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, body } = parseFrontmatter(raw);
  const blocks = parseMarkdownBlocks(body);
  const wordCount = countWords(blocks);
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

  const firstParagraph = blocks.find((b): b is Extract<WritingBlock, { type: "paragraph" }> => b.type === "paragraph");
  const title = typeof data.title === "string" && data.title ? data.title : titleCaseTag(slug);
  const description =
    typeof data.description === "string" && data.description
      ? data.description
      : (firstParagraph?.text.slice(0, 160) ?? "");
  const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
  const category =
    typeof data.category === "string" && data.category ? data.category : tags.length > 0 ? titleCaseTag(tags[0]) : "Notes";
  const date = typeof data.date === "string" && data.date ? data.date : "2026-09-13";

  return {
    slug,
    title,
    shortTitle:
      typeof data.shortTitle === "string" && data.shortTitle ? data.shortTitle : title,
    description,
    excerpt: description,
    date,
    updated: typeof data.updated === "string" && data.updated ? data.updated : date,
    readTime: typeof data.readTime === "string" && data.readTime ? data.readTime : readTime,
    tldr: typeof data.tldr === "string" ? data.tldr : "",
    category,
    tags,
    wordCount,
    blocks,
  };
}

export function getWritingSlugs(): string[] {
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""))
    .sort();
}

export function getAllWritingPosts(): WritingPost[] {
  return getWritingSlugs()
    .map((slug) => loadPost(slug))
    .filter((post): post is WritingPost => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWritingPost(slug: string): WritingPost | null {
  return loadPost(slug);
}
