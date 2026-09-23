# Content Strategy — mahirmalik.in

Brand voice: human, technical, confident, slightly playful, minimal. No keyword stuffing, no marketing-landing tone.

## Topical clusters (demonstrated work only)

### AI ENGINEERING (pillar: `/writing/context-vs-loop-vs-harness-engineering`)
- LLM engineering, AI agents, agentic workflows, agent harnesses, evaluation, AI infrastructure
- Proof: Sellable (policy engine, consent/HITL, eval scenarios, Razorpay rails), Helion (harness — when shipped)
- Support: Jev explainer (typed deciders inside loops)

### MACHINE LEARNING (pillar pair: Confluence article + `/work/confluence`)
- Visualization, ML fundamentals, model evaluation, applied ML
- Proof: Confluence (38 scikit-learn algorithms, 25 datasets, frame playback, codegen)

### SOFTWARE SYSTEMS (supporting, never a standalone pillar)
- Python, FastAPI, Redis, Supabase, Docker — surfaced inside case studies, not separate posts

## Project ↔ article matrix

| Project | Companion article | Status |
|---|---|---|
| Sellable | policy-engine build log / eval scenarios | FUTURE (needs author artifacts) |
| Confluence | `i-made-a-visualization-tool-for-ml-algorithms` | LIVE, linked both ways |
| Helion | harness diary | FUTURE — only when shipped; no vapor posts |

## Content gaps (require real artifacts — never invent)

1. Sellable policy-engine build log (verdict schema, 2–3 rules, accept/reject path)
2. The 7 eval scenarios, named (setup → expected verdict → observed, incl. one adversarial case)
3. Consent + HITL + ledger walkthrough (one redacted end-to-end entry)
4. Confluence perf notes (debounce values, grid resolutions, Redis hit/miss behavior)
5. Gamma/k-NN visual essay (actual figures — highest linkable value)
6. Calibration from own data (accuracy-vs-confidence plot → ship threshold)
7. Loop-article pilot run (n≥5 tasks with the article's own metrics table)
8. Jev micro-benchmark (bounded decision, own latency/cost/accuracy)

## Refresh rules

- Never change `date` without substantial content changes; use frontmatter `updated` (rendered automatically).
- Re-verify Jev price/limits/model IDs quarterly (staleness line dated 2026-09-20).
- Every new post: add proof links (§INTERNAL_LINK_MAP), TL;DR, FAQ where snippet-worthy, hyperlinked sources.
- Every figure needs alt text that survives into `llms-full.txt`.
