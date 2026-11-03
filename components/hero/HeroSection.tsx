"use client";

import { useEffect, useState } from "react";
import { IdBadge } from "@/components/hero/IdBadge";

/**
 * Editorial hero: pure-white stage, two small serif notes in the upper
 * corners, an oversized serif name cropped at the viewport edges, and a
 * draggable ID badge hanging from a lanyard in the foreground.
 *
 * The negative top margin cancels the global `main` padding (kept for the
 * other routes) so this stage starts flush with the viewport top.
 */
export function HeroSection() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="hero-stage -mt-24 md:-mt-28"
      aria-label="Introduction"
      aria-busy={!ready}
      data-ready={ready ? "true" : "false"}
    >
      <div className="hero-skeleton" aria-hidden="true">
        <div className="hero-skeleton-note hero-skeleton-note-left">
          <i />
          <i />
        </div>
        <div className="hero-skeleton-note hero-skeleton-note-right">
          <i />
          <i />
        </div>
        <i className="hero-skeleton-name" />
        <i className="hero-skeleton-lanyard" />
        <div className="hero-skeleton-badge">
          <i className="hero-skeleton-badge-mark" />
          <i className="hero-skeleton-badge-title" />
          <i className="hero-skeleton-badge-subtitle" />
          <i className="hero-skeleton-badge-rule" />
          <div className="hero-skeleton-badge-chips">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <p className="hero-note hero-note-left">
        I build AI systems, agents,
        <br />
        and automations.{" "}
        <a className="hero-more" href="#about">
          [more]
        </a>
      </p>

      <p className="hero-note hero-note-right">
        making ai do more
        <br />
        than just <em>yap.</em>
      </p>

      <h1 className="hero-name">Mahir Malik</h1>

      <IdBadge />
    </section>
  );
}
