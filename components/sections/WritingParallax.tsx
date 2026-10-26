"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { WritingPost } from "@/lib/writing";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function WritingParallax({ posts }: { posts: WritingPost[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const contentY = useTransform(scrollYProgress, (progress) => {
    if (reduceMotion) return "0vh";
    return progress <= 0.48
      ? `${16 * (1 - progress / 0.48)}vh`
      : `${-2 * ((progress - 0.48) / 0.52)}vh`;
  });
  const contentOpacity = useTransform(scrollYProgress, (progress) => {
    if (reduceMotion) return 1;
    if (progress <= 0.24) return 0.62 + (0.94 - 0.62) * (progress / 0.24);
    if (progress <= 0.58) return 0.94 + 0.06 * ((progress - 0.24) / 0.34);
    return 1;
  });
  const contentScale = useTransform(scrollYProgress, (progress) => reduceMotion ? 1 : 0.985 + (0.015 * Math.min(progress / 0.55, 1)));
  const introY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [18, -18]);
  const feedY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-12, 12]);

  return (
    <section ref={sectionRef} id="blogs" className="blogs-writing">
      <div className="blogs-writing-stage">
        <motion.div
          className="blogs-writing-layout"
          style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        >
          <motion.header className="blogs-writing-intro" style={{ y: introY }}>
            <h2>Stuff I&apos;ve been thinking about.</h2>
            <p>
              Tech moves stupidly fast, so I write down the things I&apos;m learning, building,
              breaking, and obsessing over before the next rabbit hole gets me.
            </p>
            <Link href="/writing" className="blogs-writing-all">
              Browse all <ArrowRight aria-hidden="true" />
            </Link>
          </motion.header>

          <motion.div className="blogs-writing-feed" style={{ y: feedY }}>
            <div className="blogs-writing-feed-head">
              <span>Latest</span>
            </div>
            {posts.map((post) => (
              <Link className="blogs-writing-entry" key={post.slug} href={`/writing/${post.slug}`}>
                <div className="blogs-writing-entry-meta">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="blogs-writing-entry-copy">
                  <h3>{post.shortTitle}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <ArrowUpRight className="blogs-writing-entry-arrow" aria-hidden="true" />
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
