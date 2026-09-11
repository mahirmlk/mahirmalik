"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { blogPosts } from "@/lib/blogs";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function BlogsSection() {
  const featured = blogPosts.find((post) => post.featured) ?? blogPosts[0];

  if (!featured) {
    return (
      <section id="blogs" className="site-container section-block">
        <Reveal>
          <div className="space-y-8">
            <div>
              <p className="section-eyebrow">Blogs</p>
              <h2 className="section-title">Writing that turns technical shifts into usable mental models.</h2>
              <p className="section-copy mt-5">
                New essays are on the way. Check back soon.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="blogs" className="site-container section-block">
      <Reveal>
        <div className="space-y-8">
          <div>
            <p className="section-eyebrow">Blogs</p>
            <h2 className="section-title">Writing that turns technical shifts into usable mental models.</h2>
            <p className="section-copy mt-5">
              Writing on model behavior, retrieval systems, evaluation, and deployment tradeoffs
              behind reliable, production-grade machine learning systems.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">Featured post</p>
            <Link
              href="/blog"
              className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
            >
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-8">
        <div className="max-w-[720px]">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block border-t border-[var(--border)] py-5 transition duration-300 hover:border-[var(--border-hover)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                {formatDate(featured.date)}
              </span>
              <span className="mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                {featured.readTime}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="font-feature text-[1.55rem] font-normal uppercase leading-[0.94] tracking-[-0.06em] text-[var(--fg)] sm:text-[1.9rem]">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-[34rem] text-sm leading-7 text-[var(--fg-muted)]">
                  {featured.description}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 text-[var(--fg-muted)] transition group-hover:text-[var(--fg)] sm:mt-1">
                <span className="mono text-[10px] uppercase tracking-[0.16em]">Read</span>
                <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
