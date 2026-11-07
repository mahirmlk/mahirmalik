"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { WritingPost } from "@/lib/writing";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function WritingEntry({ post, index }: { post: WritingPost; index: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="blogs-writing-entry"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: Math.min(index * 0.04, 0.16), ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="blogs-writing-entry-link" href={`/writing/${post.slug}`}>
        <div className="blogs-writing-entry-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime}</span>
        </div>
        <div className="blogs-writing-entry-copy">
          <h3>{post.shortTitle}</h3>
          <p>{post.excerpt}</p>
        </div>
        <ArrowUpRight className="blogs-writing-entry-arrow" aria-hidden="true" />
      </a>
    </motion.article>
  );
}

export function WritingSection({ posts }: { posts: WritingPost[] }) {
  return (
    <section id="blogs" className="blogs-writing" aria-labelledby="blogs-heading">
      <aside className="blogs-writing-aside">
        <h2 id="blogs-heading">Stuff I&apos;ve been thinking about.</h2>
        <p>
          Tech moves stupidly fast, so I write down the things I&apos;m learning, building,
          breaking, and obsessing over before the next rabbit hole gets me.
        </p>
        <a href="/writing" className="blogs-writing-all">
          Browse all <ArrowRight aria-hidden="true" />
        </a>
      </aside>

      <div className="blogs-writing-list" aria-label="Latest writing">
        <div className="blogs-writing-feed-head">
          <span>Latest</span>
        </div>
        {posts.map((post, index) => (
          <WritingEntry key={post.slug} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}
