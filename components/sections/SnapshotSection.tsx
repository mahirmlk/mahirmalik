"use client";

import { Reveal } from "@/components/ui/Reveal";

export function SnapshotSection() {
  return (
    <section id="pulse" className="site-container section-block">
      <div>
        <Reveal>
          <p className="section-eyebrow">Current Snapshot</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] max-sm:text-[1.65rem]">
            What I&#39;m Building And Why It Matters
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Reveal delay={80}>
            <div className="border-t border-[var(--border)] pt-5">
              <div className="mono flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                <span>Status</span>
                <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-pulse-dot" />
              </div>
              <div className="mt-5 flex items-start gap-3 text-sm leading-7 text-[var(--fg-muted)]">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-green)] animate-pulse-dot" />
                Actively building and open to Machine Learning/AI Engineer roles and internships
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="border-t border-[var(--border)] pt-5">
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                Current Focus
              </div>
              <p className="mt-5 text-sm leading-7 text-[var(--fg-muted)]">
                Building reliable retrieval systems, agent tooling, and interfaces that make model
                behavior clear to operators and end users.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
