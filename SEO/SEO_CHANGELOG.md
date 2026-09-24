# SEO Changelog — mahirmalik.in

## 2026-09-24 — Favicon tight crop: ring removed, face zoom
- `public/favicon.ico` / `public/icon.png` (512) / `public/apple-icon.png` (180): rebuilt from a tighter face-focused square crop; badge ring, dotted edge texture, and shadow fully removed (pixel-verified: inner avatar dark-pixel count identical before/after, shirt mass preserved via connectivity check).
- Background is pure white; face centered with gaze room on the right; legibility verified at 16/32/48.
- URLs and `app/layout.tsx` / `app/manifest.ts` sizes strings unchanged (still `512x512`); stable `/favicon.ico` kept.
- Deliberately unchanged: OG/social images, hero/logo/person images, robots/sitemap, DNS.

## 2026-09-24 — Content phase: project pages, article quality, writing index
- `content/projects/confluence.md` / `sellable.md`: rewritten as proof-of-work case studies (facts traceable to `lib/projects.ts`; `TODO(mahir)` placeholders for metrics/URLs Mahir must supply).
- Helion deliberately has **no case-study page**: no `content/projects/helion.md`; `/work/helion` 404s (excluded from `generateStaticParams`, sitemap, work JSON-LD, IndexNow submission, and llms links). The archive card keeps its coming-soon cover preview + footer badge and no longer links anywhere.
- 3 articles: heading hierarchy normalized (title `#`, sections `##`, subs `###`); 11 Sources turned into externally title-verified links; audience/roadmap lines added to openings; blueprint `ts` fences labeled illustrative; overstated "production-ready" heading softened; humanizer pass (staged reveals, filler closers, fragment bursts, one inflated claim grounded to the article's own ceiling warning).
- New internal bridge: loop article → `/work/sellable` (metrics section, 7 scenarios). The Helion mention in the harness section is plain text — no case-study page to link while it is unshipped.
- `app/writing/page.tsx`: description string deduped into `WRITING_DESCRIPTION` (was copied 4×), retitled to enumerate actual topics (AI agents, harness engineering, model routing, interactive ML tools).
- `components/writing/WritingList.tsx` + `writing.css`: each index row now shows the post's real description (`.w-row-desc`, light + dark) and its category in the meta line — real frontmatter data, no new invented copy.
- `components/writing/ArticleLayout.tsx` renderer: inline markdown links render as anchors (Links blocks converted to `[text](url)`).
- Regenerated `public/llms-full.txt` (still contains `TODO(mahir)` placeholders — fill before deploy).
- Deliberately unchanged: schema suite, favicon system, sitemap/robots, diagrams, all metrics/claims; no benchmarks, user counts, or performance numbers added anywhere.

## 2026-09-23 — Canonical + favicon stabilization (prior task)
- `app/layout.tsx`: root canonical fallback `alternates: { canonical: "/" }` (per-page canonicals override).
- `docs/traffic-playbook.md`: 3 bare-apex hrefs → `https://www.mahirmalik.in/…`.
- `public/humans.txt`: stack string Next.js 15 → 16.
- Verified live: canonical, OG URL, favicon tags, `/blog` 308s, sitemap (10 URLs), robots.

## 2026-09-23 — Personal-brand authority implementation
- `app/work/page.tsx`: stale "chat infrastructure / causal inference / causal ML" copy → agentic commerce + ML visualization wording (metadata ×4, schema description, body).
- `content/writing/context-vs-loop-vs-harness-engineering.md`: 21 flat `#` headings → `##` under blueprint (anchor-safe: no heading IDs rendered); 3 contextual links added (Sellable ×2, Jev ×1).
- `content/writing/i-made-a-visualization-tool-for-ml-algorithms.md`: case-study link to `/work/confluence`.
- `content/writing/jev-system-one-model-explained.md`: verified-on-2026-09-20 staleness line; links to loop article + `/work/sellable`.
- `content/projects/sellable.md` / `confluence.md`: Links blocks (live + source + companion articles, all in-repo-verified URLs) + Implementation-notes paragraphs (facts traceable to `lib/projects.ts` or the file itself; no new metrics).
- `components/sections/SnapshotSection.tsx`: body text `white/60`→`white/75`, `white/65`→`white/75` (contrast).
- `app/globals.css`: global `:focus-visible` outline in brand token.
- `components/hero/HeroActions.tsx`: `required` + `autoComplete` on name/email/message.
- New: `SEO/{INTERNAL_LINK_MAP,CONTENT_STRATEGY,BACKLINK_STRATEGY,SEO_CHANGELOG}.md`.
- Deliberately unchanged: schema suite, favicon system, sitemap/robots logic, OG images, DNS, design, all metrics/claims.
