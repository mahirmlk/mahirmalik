// Submits canonical URLs to IndexNow (Bing, Yandex, Naver, Seznam…).
// NOTE: zero effect on Google — Google must be covered via Search Console.
//
// One-time setup:
//   1. Bing Webmaster Tools → URL Submission → IndexNow → generate key.
//   2. Save the key file as public/<key>.txt (deploys with the site).
//   3. $env:INDEXNOW_KEY="<key>"  (never commit the key)
//
// Usage:
//   node scripts/submit-indexnow.mjs --dry-run   # list URLs, submit nothing
//   node scripts/submit-indexnow.mjs             # POST to api.indexnow.org
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://www.mahirmalik.in";
const host = new URL(siteUrl).host;
const DRY = process.argv.includes("--dry-run");

function projectSlugs() {
  // Single source of truth: lib/projects.ts. The regex keeps this script
  // dependency-free (plain node can't import TS), so it stays in sync with
  // lib/projects.ts as long as the `slug: "..."` entries exist there.
  try {
    const src = fs.readFileSync(path.join(root, "lib", "projects.ts"), "utf8");
    const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    // Only submit slugs that have a case-study body; coming-soon cards have no
    // content/projects/<slug>.md and would 404 if submitted.
    const pages = slugs.filter((slug) =>
      fs.existsSync(path.join(root, "content", "projects", `${slug}.md`))
    );
    if (pages.length > 0) return pages;
  } catch (error) {
    console.error("Could not read lib/projects.ts:", error);
  }
  // Hard failure instead of a silent stale list — a stale sitemap submission
  // is worse than a failed run.
  process.exit(1);
}

function writingSlugs() {
  const dir = path.join(root, "content", "writing");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort();
}

const urls = [
  `${siteUrl}/`,
  `${siteUrl}/about`,
  `${siteUrl}/work`,
  `${siteUrl}/writing`,
  ...projectSlugs().map((s) => `${siteUrl}/work/${s}`),
  ...writingSlugs().map((s) => `${siteUrl}/writing/${s}`),
];

if (DRY) {
  console.log(`[dry-run] ${urls.length} URLs would be submitted:`);
  for (const u of urls) console.log(`  ${u}`);
  process.exit(0);
}

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.error(
    "Missing INDEXNOW_KEY.\n" +
      "  1. Generate a key: Bing Webmaster Tools → URL Submission → IndexNow.\n" +
      "  2. Save it as public/<key>.txt (this file ships with the site).\n" +
      '  3. Run again: $env:INDEXNOW_KEY="<key>"; npm run indexnow'
  );
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList: urls,
  }),
});

console.log(`IndexNow → ${res.status} (${urls.length} URLs)`);
if (res.status !== 200 && res.status !== 202) {
  console.error("Submission not accepted — check key file is live and host matches.");
  process.exit(1);
}
