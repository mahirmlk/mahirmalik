"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { papersBaseUrl } from "@/lib/site";

export function TheorySection() {
  return (
    <section id="implementations" className="theory site-container section-block">
      <Reveal>
        <div className="space-y-8">
          <div>
            <p className="section-eyebrow">Implementations</p>
            <h2
              className="section-title"
              style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)" }}
            >
              Because reading the paper wasn&apos;t enough.
            </h2>
            <div className="theory-row mt-5 flex items-center gap-3 sm:gap-4">
              <a
                href={papersBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open papers.mahirmalik.in"
                aria-label="Open papers.mahirmalik.in"
                className="group shrink-0 rounded-2xl transition duration-300 hover:-translate-y-1"
              >
                <Image
                  src="/folder-icon.webp"
                  alt="Implementations folder icon"
                  width={512}
                  height={512}
                  className="h-36 w-36 select-none object-contain transition group-hover:opacity-90 sm:h-48 sm:w-48"
                  priority={false}
                />
              </a>
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
      </Reveal>
    </section>
  );
}
