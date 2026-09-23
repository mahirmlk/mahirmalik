# SEO Changelog — mahirmalik.in

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
