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
  return (
    <section className="hero-stage -mt-24 md:-mt-28" aria-label="Introduction">
      <p className="hero-note hero-note-left">
        I build AI systems, agents,
        <br />
        and automations.
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
