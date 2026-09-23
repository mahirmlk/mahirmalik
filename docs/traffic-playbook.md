# Traffic & Distribution Playbook — mahirmalik.in

Ready-to-use materials. Work through top to bottom.

---

## B3 — GitHub Profile README (ready to paste)

Create the repo `mahirmlk/mahirmlk` (must match your username), add `README.md`, paste below. Then pin `sellable` and `Confluence`, and update your profile bio + headshot to match.

```markdown
### Hi, I'm Mahir Malik — AI Engineer

I build intelligent systems that make it to production: LLM agents, RAG pipelines,
ML products, and the full-stack software around them. I work across the whole
pipeline — training to inference to the frontend people actually use.

- 🔭 Currently: building agentic commerce infrastructure ([Sellable](https://www.mahirmalik.in/work/sellable)) and interactive ML learning tools ([Confluence](https://www.mahirmalik.in/work/confluence))
- ✍️ Writing: [mahirmalik.in/writing](https://www.mahirmalik.in/writing) — long-form on LLM deployment, model efficiency, and AI systems engineering
- 📄 Full portfolio: [mahirmalik.in](https://www.mahirmalik.in)
- 📫 Reach me: [LinkedIn](https://www.linkedin.com/in/mahir-malik)

### Featured work

| Project | What it is |
|---|---|
| [Sellable](https://github.com/mahirmlk/sellable) → [case study](https://www.mahirmalik.in/work/sellable) | AI agents that buy things autonomously — machine-readable storefront, policy engine, Razorpay rails, XAI audit ledger |
| [Confluence](https://github.com/mahirmlk/Confluence) → [case study](https://www.mahirmalik.in/work/confluence) | Interactive ML playground: 38 scikit-learn algorithms, live decision boundaries, frame-by-frame training |
```

**Also do (10 min):** profile pic = same headshot as the site/LinkedIn; bio line = "AI Engineer — building LLM agents, RAG pipelines, and production ML systems | mahirmalik.in"; pin both repos.

---

## B4 — dev.to cross-post (do AFTER the post is indexed in Google)

1. Publish/update the post on mahirmalik.in first.
2. Wait until Search Console → URL Inspection shows "URL is on Google" for the post.
3. On dev.to: New Post → paste the full article → Settings → **Canonical URL = `https://www.mahirmalik.in/writing/<your-post-slug>`** (clean URL, no UTM params — ever).
4. After publishing, view-source of the dev.to post and confirm `<link rel="canonical" href="https://www.mahirmalik.in/...">` is present.
5. Use dev.to liquid tags (`{% github mahirmlk/sellable %}`) to embed your repos — extra cross-linking.

Distribution links (social bios, LinkedIn posts) CAN use UTM tags:
`?utm_source=devto&utm_medium=social&utm_campaign=2026-09-efficiency-era` — lowercase, hyphens, never on canonical URLs, never on internal links.

---

## B5 — Per-post distribution checklist

For every new post:

- [ ] Publish on mahirmalik.in → URL Inspection → Request Indexing
- [ ] **Hacker News** — submit if it's a benchmark/comparison/post-mortem (title = the finding, not the marketing). Engage in comments for the first 2 hours
- [ ] **Reddit** — r/LocalLLaMA, r/MachineLearning (keep self-promo ≤ 1 in 9 contributions)
- [ ] **LinkedIn** — text post with 3 takeaways + link (personal posts outperform company pages)
- [ ] **daily.dev** — submit the RSS feed once: https://www.daily.dev → add blog `https://www.mahirmalik.in/feed.xml`
- [ ] **X** — thread or single tweet linking the post

Monthly rhythm (~45 min): check Vercel Analytics Top Referrers (look for `chatgpt.com`, `perplexity.ai`, `claude.ai`, `dev.to`), GSC queries/pages deltas, Speed Insights p75 trends, and run the AI-citation ledger below.

### AI-citation ledger (monthly, ~20 min)

Run these prompts in ChatGPT, Perplexity, Gemini, Claude; log cited/not + which URL:

1. "Who is Mahir Malik?"
2. "Mahir Malik AI engineer"
3. "Best personal blogs about LLM efficiency"
4. "Sellable agentic commerce project"
5. "LLM model routing vs fine-tuning"
6. Your 3 newest GSC non-branded queries

---

## B6 — Wikidata entry (draft)

Create at wikidata.org → "Create a new item" (Person). Fill:

| Property | Value |
|---|---|
| instance of (P31) | human (Q5) |
| occupation (P106) | machine learning researcher (Q29038286) and/or software engineer (Q212238) |
| official website (P856) | https://www.mahirmalik.in |
| GitHub username (P2037) | mahirmlk |
| LinkedIn URL | https://www.linkedin.com/in/mahir-malik |
| X username (P2002) | mahirmllk |
| described at URL | your About page |

Rules: **every claim needs a reference URL** (your own site counts for the website claim; use your GitHub profile page as reference for the GitHub claim). Only add claims that are verifiable — unreferenced statements get removed by bots. Once live, add the Wikidata URI to the `sameAs` array in `lib/site.ts`.

**After Wikidata goes live**, also update `lib/site.ts`:

```ts
export const personSameAs = [
  "https://github.com/mahirmlk",
  "https://www.linkedin.com/in/mahir-malik",
  "https://x.com/mahirmllk",
  "https://www.wikidata.org/wiki/Q<YOUR_QID>",
];
```

---

## Already shipped (code-side, this repo)

- ✅ Vercel Web Analytics + Speed Insights in `app/layout.tsx` (enable both in the Vercel dashboard → Analytics tab after deploying)
- ✅ RSS feed at `/feed.xml` + autodiscovery `<link>` in head
- ✅ llms.txt + `<link rel="llms">` in head
- ✅ Sitemap, permissive robots.txt (all AI crawlers allowed), JSON-LD graph, canonicals, OG/Twitter
- ✅ `npm run indexnow` — IndexNow submission script (`scripts/submit-indexnow.mjs`, covers Bing/Yandex/Naver/Seznam; zero effect on Google)
- ✅ CollectionPage+ItemList, BlogPosting (wordCount/inLanguage), FAQPage, TL;DR boxes, author bio, `llms-full.txt` (auto-generated), `humans.txt`, fixed `/blog` 308s + stable sitemap dates

---

## C1 — Search console setup (one-time, ~30 min)

1. **Google Search Console** (search.google.com/search-console) → Add property → Domain → DNS TXT verify.
   Submit sitemap: `https://www.mahirmalik.in/sitemap.xml`.
2. **Bing Webmaster Tools** (bing.com/webmasters) → Add site → **Import from Google Search Console** (2 min, auto-verifies).
3. In BWT → URL Submission → IndexNow → generate key → save as `public/<key>.txt` → redeploy → verify live at `https://www.mahirmalik.in/<key>.txt` → run:
   ` $env:INDEXNOW_KEY="<key>"; npm run indexnow`
   Check BWT → IndexNow tab for 200/202 statuses.
4. For every new/updated page: GSC → URL Inspection → Request Indexing (quota-limited, key URLs only) + `npm run indexnow` for Bing-side.
5. Weekly GSC: Performance anomalies, Pages ("Crawled–not indexed" = beef up content; "Discovered–not indexed" = add internal links), CWV field data, Links (new referring domains), Generative AI performance report.

---

## C2 — Per-post syndication payloads (copy-paste)

Rule: publish on mahirmalik.in FIRST, wait for GSC "URL is on Google", then syndicate. Always view-source and confirm `<link rel="canonical">` points home.

### dev.to frontmatter — context/harness/loop post

```yaml
---
title: "Context vs Loop vs Harness Engineering: The New Stack Behind AI Agents"
published: true
canonical_url: https://www.mahirmalik.in/writing/context-vs-loop-vs-harness-engineering
tags: ai, llm, machinelearning, showdev
cover_image: https://www.mahirmalik.in/og-image.jpg
---
```

### dev.to frontmatter — Confluence post

```yaml
---
title: "I Made a Visualization Tool for ML Algorithms"
published: true
canonical_url: https://www.mahirmalik.in/writing/i-made-a-visualization-tool-for-ml-algorithms
tags: machinelearning, python, showdev, ai
cover_image: https://www.mahirmalik.in/og-image.jpg
---
```

Use `{% github mahirmlk/sellable %}` / `{% github mahirmlk/Confluence %}` embeds for extra cross-links. Hashnode: same body, "republished from" field = canonical URL. Medium: Import-from-URL (sets canonical automatically, nofollow — reach only).

### LinkedIn template (text post, 3 takeaways + link)

> I stopped thinking about prompts and started thinking about systems.
>
> 3 ideas from my latest post on agent engineering:
> 1) Context engineering = what the agent knows
> 2) Harness engineering = what it can do + the rules around it
> 3) Loop engineering = what happens next + when it stops
>
> The prompt is no longer the product. The system around the model is.
> Full breakdown (12-step blueprint included): <link>

### X template (single post)

> prompts were the whole product. now they're the smallest part.
>
> context = what the agent knows
> harness = what it can do + rules
> loop = what happens next + when to stop
>
> wrote up the full mental model + a 12-step build blueprint: <link>

### Hacker News (benchmark/comparison/post-mortem posts only)

- Title = the finding, not the marketing. Example: `Show HN: Confluence – watch 38 scikit-learn algorithms train frame by frame`
- Engage in comments for the first 2 hours.

### Reddit

- r/LocalLLaMA ← context/harness/loop engineering post (self-promo ≤ 1 in 9 contributions)
- r/MachineLearning ← Confluence post (project showcase rules; lead with the demo link)

---

## C3 — Directory submissions (5–10/week, staggered — never mass-submit in one day)

Asset kit (prepare once): tagline <10 words, 100–200 word description, logo PNG 512×512, 3 screenshots, founder name + LinkedIn, pricing model, category tags.

| Tier | Site | Submit | Best for |
|---|---|---|---|
| 1 | Product Hunt (producthunt.com) | Launch page | Launch traffic + AI recommendations |
| 1 | BetaList (betalist.com) | Startup submit | Early adopters |
| 1 | Crunchbase (crunchbase.com) | Org profile | Investor discovery + press citations |
| 1 | G2 (g2.com) | Product listing | Buyer-intent traffic, dofollow |
| 1 | Capterra (capterra.com) | Product listing | SaaS discovery, dofollow |
| 1 | Wellfound (wellfound.com) | Company profile | Investor + talent signals |
| 1 | Indie Hackers (indiehackers.com) | Product page | Build-in-public mentions |
| 2 | AlternativeTo (alternativeto.net) | Product entry | Comparison searches, dofollow |
| 2 | SaaSHub (saashub.com) | Product entry | SaaS discovery, dofollow |
| 2 | StackShare (stackshare.io) | Stack + tools | Developer-tool signals, dofollow |
| AI | There's An AI For That (theresanaiforthat.com) | Tool submit | Sellable + Confluence, AI discovery |
| AI | Futurepedia (futurepedia.io) | Tool submit | Sellable + Confluence, AI discovery |
| OSS | SourceForge (sourceforge.net) | Project page | Open-source footprint, dofollow |
| Dev | GitHub awesome-lists | PR to list | Highest-ROI backlinks: awesome-machine-learning, awesome-llm-apps style lists |

Per-directory URLs get `?utm_source=<site>&utm_medium=referral&utm_campaign=directory` (tracking only — never on canonicals/internal links). Verify each live backlink: visit listing, view-source, confirm `href="https://www.mahirmalik.in/..."` with no `rel="nofollow"` (nofollow still counts for traffic, just not equity).

---

## C4 — GitHub awesome-list pitch (per list, via PR/issue)

> Hi — proposing an addition under [section]:
> [Confluence](https://github.com/mahirmlk/Confluence) — interactive playground for learning ML by watching it run: 38 real scikit-learn algorithms, decision-boundary heatmaps, frame-by-frame training playback, 25 datasets. Live demo: https://confluence.website/ · Case study: https://www.mahirmalik.in/work/confluence

Swap in Sellable (agentic commerce: policy-bounded buyer/seller agents, Razorpay rails, audit ledger — demo https://sellable.shop/, case study https://www.mahirmalik.in/work/sellable) where the list fits agents/commerce.
