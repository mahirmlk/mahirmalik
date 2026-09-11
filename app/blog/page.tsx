import type { Metadata } from "next";
import { blogPosts } from "@/lib/blogs";
import { BlogListItem } from "@/components/blog/BlogListItem";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Writing on AI systems, retrieval reliability, deployment tradeoffs, and product-minded engineering.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#090b0f] pb-20 pt-28 text-[#eee8de] lg:pb-24 lg:pt-10">
      <section className="border-b border-white/8">
        <div className="mx-auto w-[min(1240px,calc(100vw-1.5rem))] pb-12 lg:w-[min(1240px,calc(100vw-2rem))] lg:px-2 lg:pb-14">
          <div className="flex flex-col gap-7 lg:gap-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-white/42">
                Blog Index
              </p>
              <div className="text-left sm:text-right">
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-white/36">
                  written by
                </p>
                <p className="mt-1 font-[var(--font-serif)] text-[1.15rem] font-semibold text-[#f4efe7] lg:mt-2 lg:text-[1.35rem]">
                  Mahir Malik
                </p>
              </div>
            </div>

            <div>
              <h1 className="mt-1 max-w-[12ch] font-feature text-[clamp(2.45rem,12vw,3.7rem)] font-normal uppercase leading-[1] tracking-[-0.045em] text-[#f4efe7] lg:mt-2 lg:max-w-[11ch] lg:text-[clamp(3rem,6.8vw,5.4rem)] lg:leading-[0.96] lg:tracking-[-0.06em]">
                Systems essays with weight.
              </h1>
              <p className="mt-5 max-w-[44rem] text-[0.98rem] leading-7 text-white/66 lg:mt-6 lg:text-[1.02rem] lg:leading-8">
                Long-form writing on LLM deployment, retrieval systems, evaluation discipline, and
                product decisions around AI. Less trend-chasing, more engineering signal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-[min(1100px,calc(100vw-1.5rem))] lg:mt-12 lg:w-[min(1100px,calc(100vw-3rem))] lg:px-2">
        <div className="border-b border-white/10 pb-5">
          <p className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-white/42">
            Table of Contents
          </p>
          <h2 className="mt-3 font-[var(--font-serif)] text-[clamp(2rem,4.5vw,3.4rem)] leading-tight tracking-[-0.035em] text-[#f4efe7]">
            Writing
          </h2>
        </div>

        <div className="mt-4">
          {blogPosts.length === 0 ? (
            <p className="border-t border-white/10 py-10 text-[0.95rem] leading-7 text-white/60">
              New essays are on the way. Check back soon.
            </p>
          ) : (
            blogPosts.map((post) => <BlogListItem key={post.slug} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
}
