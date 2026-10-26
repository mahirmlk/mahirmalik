"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { papersBaseUrl } from "@/lib/site";

export function TheorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const contentY = useTransform(scrollYProgress, (progress) => {
    if (reduceMotion) return "0vh";
    return progress <= 0.48
      ? `${18 * (1 - progress / 0.48)}vh`
      : `${-4 * ((progress - 0.48) / 0.52)}vh`;
  });
  const contentOpacity = useTransform(scrollYProgress, (progress) => {
    if (reduceMotion) return 1;
    if (progress <= 0.24) return 0.58 + (0.94 - 0.58) * (progress / 0.24);
    if (progress <= 0.58) return 0.94 + 0.06 * ((progress - 0.24) / 0.34);
    return 1;
  });
  const contentScale = useTransform(scrollYProgress, (progress) => reduceMotion ? 1 : 0.985 + (0.015 * Math.min(progress / 0.55, 1)));
  const illustrationY = useTransform(scrollYProgress, (progress) => reduceMotion ? 0 : -50 + progress * 100);

  return (
    <section ref={sectionRef} id="implementations" className="theory-parallax">
      <div className="theory-parallax-stage">
        <div className="theory site-container section-block">
          <motion.div
            className="theory-parallax-content"
            style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
          >
            <div className="space-y-8">
              <div>
                <p className="section-eyebrow">Implementations</p>
                <h2 className="section-title section-title-sm theory-parallax-heading">
                  Because reading the paper wasn&apos;t enough.
                </h2>
                <div className="theory-row mt-5 flex items-center gap-3 sm:gap-4">
                  <motion.a
                    href={papersBaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open papers.mahirmalik.in"
                    aria-label="Open papers.mahirmalik.in"
                    className="group shrink-0 rounded-2xl transition duration-300 hover:-translate-y-1"
                    style={{ y: illustrationY }}
                  >
                    <Image
                      src="/folder-icon.webp"
                      alt="Implementations folder icon"
                      width={512}
                      height={512}
                      className="h-36 w-36 select-none object-contain transition group-hover:opacity-90 sm:h-48 sm:w-48"
                      priority={false}
                    />
                  </motion.a>
                  <div className="min-w-0">
                    <p className="section-copy mt-0">
                      I take interesting papers, ideas, and algorithms and actually build them from
                      scratch.
                    </p>
                    <a
                      href={papersBaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex flex-wrap items-center gap-2 text-[var(--fg-muted)] transition hover:text-[var(--fg)]"
                    >
                      <span className="mono text-[10px] uppercase tracking-[0.16em]">
                        papers.mahirmalik.in
                      </span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
