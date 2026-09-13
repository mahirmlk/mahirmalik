import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Folder } from "@/components/ui/folder-component";
import { getAllWritingPosts } from "@/lib/writing";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const writingPosts = getAllWritingPosts();

export function BlogsSection() {
  return (
    <section id="blogs" className="site-container section-block">
      <Reveal>
        <div className="space-y-8">
          <div>
            <p className="section-eyebrow">Writing</p>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)" }}
            >
              Stuff I&apos;ve been thinking about.
            </h2>
            <p className="section-copy mt-5">
              Tech moves stupidly fast, so I write down the things I&apos;m learning, building,
              breaking, and obsessing over before the next rabbit hole gets me.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <p className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
              {writingPosts.length > 0 ? "Latest" : "Essays"}
            </p>
            <Link
              href="/writing"
              className="mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
            >
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="mt-8">
        {writingPosts.length === 0 ? (
          <p className="section-copy">New essays are on the way. Check back soon.</p>
        ) : (
          <div className="flex flex-wrap items-start gap-x-14 gap-y-10">
            {writingPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group flex max-w-[15rem] flex-col items-center text-center"
              >
                <span className="flex h-[150px] w-[178px] items-center justify-center">
                  <span className="block h-[176px] w-[209px] scale-[0.85]">
                    <Folder color="white" size="sm" />
                  </span>
                </span>
                <span className="mt-4 font-[Georgia,'Times_New_Roman',serif] text-[1.0625rem] leading-snug text-[var(--fg)] transition group-hover:text-[var(--fg-muted)] group-hover:underline group-hover:underline-offset-4">
                  {post.shortTitle}
                </span>
                <span className="mono mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                  {formatDate(post.date)} · {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
