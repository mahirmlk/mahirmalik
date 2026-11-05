"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WritingSection } from "@/components/sections/WritingSection";
import { TheorySection } from "@/components/sections/TheorySection";
import type { WritingPost } from "@/lib/writing";

export function ArticlesImplementationsTransition({ posts }: { posts: WritingPost[] }) {
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const articles = transitionRef.current?.querySelector<HTMLElement>("#blogs");
        if (!articles) return;

        // Keep the writing feed in normal flow; pin only the completed section handoff.
        const transition = ScrollTrigger.create({
          trigger: articles,
          start: "bottom bottom",
          end: "bottom top",
          pin: articles,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        return () => transition.kill();
      });

      return () => media.revert();
    }, transitionRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={transitionRef} className="articles-implementations-transition">
      <WritingSection posts={posts} />
      <TheorySection />
    </div>
  );
}
