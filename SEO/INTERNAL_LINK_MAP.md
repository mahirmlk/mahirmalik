# Internal Link Map — mahirmalik.in

Canonical: `https://www.mahirmalik.in/`. All internal links are relative and resolve against `metadataBase`.

## Chrome links (site furniture, verified in code)

- Nav (`components/nav/Navbar.tsx`): `/about`, `/work`, `/writing`, `/#contact`, `/` (home icon), `/writing` (Explore button)
- Footer (`components/sections/ContactSection.tsx`): `/work`, `/writing`
- Home sections: `ProjectsSection` → `/work`; `BlogsSection` → `/writing`
- Article header/footer (`components/writing/ArticleLayout.tsx`): `/writing` (back, ×2), `/about` (byline + author bio)
- Project page (`app/work/[slug]/page.tsx`): `/work` (back)
- Grids: `ProjectGrid`/`WritingList` link every slug; no orphan indexable page exists

## Content links (applied 2026-09-23, extended 2026-09-24)

| From | Anchor | To |
|---|---|---|
| Loop article, Step 4 permissions | "I built this exact pattern in Sellable…" | `/work/sellable` |
| Loop article, Step 5 evaluator | "a typed decider like Jev…" | `/writing/jev-system-one-model-explained` |
| Loop article, Step 8 checkpoints | "see how Sellable gates high-value orders" | `/work/sellable` |
| Loop article, metrics intro | "seven deterministic transaction scenarios" | `/work/sellable` |
| Confluence article, intro | "full case study at Confluence" | `/work/confluence` |
| Jev article, agent-fit intro | "the context/harness/loop blueprint" | `/writing/context-vs-loop-vs-harness-engineering` |
| Jev article, risk-gate section | "how Sellable gates risky orders" | `/work/sellable` |
| `sellable.md` Links block | live app, source, loop article, Jev article | external + 2 internal |
| `confluence.md` Links block | live app, source, build-log article | external + 1 internal |

## Rules for new posts/projects

1. Every article links its proof object (`/work/*`) where one exists; every project links its companion article.
2. Evaluator/policy/confidence topics bridge to the loop article and/or Jev article — only where genuinely relevant, one link per bridge.
3. Descriptive anchor text naming the destination concept; no "click here".
4. Internal markdown links (`/route`) stay same-tab (renderer only new-tabs `http(s)` links).
5. Never link to deleted slugs; dead ends 404 via the `noindex` boundary — fix or remove the link.
6. Diagrams: all `diagram:` IDs must exist in `components/writing/diagrams/AgentDiagrams.tsx` (all 19 current ones do — KEEP).
