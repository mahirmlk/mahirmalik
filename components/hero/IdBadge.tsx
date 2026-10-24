"use client";

import { useEffect, useRef } from "react";

/**
 * Hanging ID badge matching the reference mock: a thick black V-shaped
 * lanyard converging at a metal crimp, a short connector strap, a chrome
 * swivel hook, and the card hanging below.
 *
 * Interaction model:
 * - Grabbing moves the badge 1:1 with the pointer — rigidly, no tilt or
 *   lag, so nothing ever appears to stretch. The card only ever translates
 *   (hook) and rotates (pendulum), never scales.
 * - Releasing lets the badge swing back to its hanging spot on an
 *   underdamped spring and settle there, like a real lanyard badge.
 * - Position is applied synchronously in the event handlers so dragging
 *   works even while requestAnimationFrame is paused (hidden tab); the rAF
 *   loop only drives the swing-back and pendulum, which park themselves on
 *   visibility changes.
 */

const REST_Y = 0.32; // hook rest height, fraction of hero height
const CLIP_GAP = 30; // hook → card top, px
const CONNECTOR = 40; // crimp vertex → hook (short strap), px
const KEY_STEP = 36; // keyboard nudge, px
const MAX_TILT = 0.1; // radians (~5.7°) while swinging back
const TILT_PER_PX = 0.0035; // rad of tilt per px of return velocity
const SWING_K = 0.045; // return-spring pull toward the resting spot
const SWING_DAMP = 0.9; // velocity retained per frame
const ANGLE_K = 0.09; // pendulum spring toward the tilt target
const ANGLE_DAMP = 0.86; // angular velocity retained per frame

export function IdBadge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const strapRefs = [useRef<SVGLineElement>(null), useRef<SVGLineElement>(null)];
  const sheenRefs = [useRef<SVGLineElement>(null), useRef<SVGLineElement>(null)];
  const connectorRef = useRef<SVGLineElement>(null);

  const sim = useRef({
    x: 0,
    y: 0,
    restX: 0,
    restY: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    angVel: 0,
    grabOffsetX: 0,
    grabOffsetY: 0,
    dragging: false,
    raf: 0,
    heroW: 0,
    heroH: 0,
    cardW: 0,
    cardH: 0,
    spread: 0,
    stroke: 14,
    reducedMotion: false,
  });

  useEffect(() => {
    const root = rootRef.current;
    const swing = swingRef.current;
    const svg = svgRef.current;
    if (!root || !swing || !svg) return;

    const hero = root.parentElement;
    const card = swing.firstElementChild as HTMLElement | null;
    const s = sim.current;

    const clamp = (v: number, lo: number, hi: number) => (hi < lo ? lo : Math.min(Math.max(v, lo), hi));

    const measure = () => {
      if (!hero || !card) return;
      const rect = hero.getBoundingClientRect();
      s.heroW = rect.width;
      s.heroH = rect.height;
      s.cardW = card.offsetWidth;
      s.cardH = card.offsetHeight;
      s.spread = clamp(s.heroW * 0.048, 24, 96);
      s.stroke = clamp(s.heroW * 0.011, 12, 20);
      s.restX = clamp(s.heroW / 2, s.cardW / 2 + 14, s.heroW - s.cardW / 2 - 14);
      s.restY = clamp(s.heroH * REST_Y, 88, s.heroH - CLIP_GAP - s.cardH - 16);
      svg.setAttribute("stroke-width", String(s.stroke));
      root.style.setProperty("--connector", `${CONNECTOR}px`);
    };

    const bounds = () => ({
      minX: s.cardW / 2 + 14,
      maxX: s.heroW - s.cardW / 2 - 14,
      minY: 88,
      maxY: s.heroH - CLIP_GAP - s.cardH - 16,
    });

    const draw = () => {
      root.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      swing.style.transform = `rotate(${s.angle}rad)`;
      const vy = s.y - CONNECTOR; // vertex where the two straps meet the crimp
      const setLine = (
        ref: React.RefObject<SVGLineElement | null>,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => {
        ref.current?.setAttribute("x1", String(x1));
        ref.current?.setAttribute("y1", String(y1));
        ref.current?.setAttribute("x2", String(x2));
        ref.current?.setAttribute("y2", String(y2));
      };
      setLine(strapRefs[0], s.heroW / 2 - s.spread, -40, s.x, vy);
      setLine(strapRefs[1], s.heroW / 2 + s.spread, -40, s.x, vy);
      setLine(sheenRefs[0], s.heroW / 2 - s.spread, -40, s.x, vy);
      setLine(sheenRefs[1], s.heroW / 2 + s.spread, -40, s.x, vy);
      setLine(connectorRef, s.x, vy, s.x, s.y);
    };

    // Step the pendulum spring once toward `target`.
    const stepSwing = (target: number) => {
      s.angVel += (target - s.angle) * ANGLE_K;
      s.angVel *= ANGLE_DAMP;
      s.angle += s.angVel;
    };

    const tick = () => {
      if (!s.dragging) {
        // Swing back to the hanging spot on an underdamped spring; the card
        // tilts gently against the direction of travel, like a real badge.
        s.vx += (s.restX - s.x) * SWING_K;
        s.vx *= SWING_DAMP;
        s.x += s.vx;
        s.vy += (s.restY - s.y) * SWING_K;
        s.vy *= SWING_DAMP;
        s.y += s.vy;
        if (!s.reducedMotion) {
          stepSwing(clamp(-s.vx * TILT_PER_PX, -MAX_TILT, MAX_TILT));
        }
      } else {
        // Held: keep the card steady and vertical.
        stepSwing(0);
      }
      draw();

      const settled =
        !s.dragging &&
        Math.abs(s.restX - s.x) < 0.4 &&
        Math.abs(s.restY - s.y) < 0.4 &&
        Math.abs(s.vx) < 0.05 &&
        Math.abs(s.vy) < 0.05 &&
        Math.abs(s.angle) < 0.0005 &&
        Math.abs(s.angVel) < 0.0005;
      if (settled) {
        s.x = s.restX;
        s.y = s.restY;
        s.vx = 0;
        s.vy = 0;
        s.angle = 0;
        s.angVel = 0;
        draw();
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };

    // Pointer coords are viewport-relative; the hero sits at the top of the
    // page, so subtract its current rect to get hero-relative hook coords.
    const heroPoint = (event: PointerEvent) => {
      if (!hero) return { hx: event.clientX, hy: event.clientY };
      const rect = hero.getBoundingClientRect();
      return { hx: event.clientX - rect.left, hy: event.clientY - rect.top };
    };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      try {
        root.setPointerCapture(event.pointerId);
      } catch {
        // Pointer may already be gone (e.g. released before this handler ran).
      }
      // Re-measure so bounds reflect the current layout (window may have
      // resized, fonts may have loaded, CSS may have settled since mount).
      measure();
      const b = bounds();
      s.x = clamp(s.x, b.minX, b.maxX);
      s.y = clamp(s.y, b.minY, b.maxY);
      const { hx, hy } = heroPoint(event);
      s.grabOffsetX = s.x - hx;
      s.grabOffsetY = s.y - hy;
      s.vx = 0;
      s.vy = 0;
      s.dragging = true;
      draw();
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!s.dragging || !root.hasPointerCapture(event.pointerId)) return;
      const { hx, hy } = heroPoint(event);
      const b = bounds();
      s.x = clamp(hx + s.grabOffsetX, b.minX, b.maxX);
      s.y = clamp(hy + s.grabOffsetY, b.minY, b.maxY);
      draw();
      wake();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!s.dragging) return;
      try {
        if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      } catch {
        // Capture may already be gone; the swing-back still proceeds.
      }
      s.dragging = false;
      if (s.reducedMotion) {
        // No animation: settle straight back into the hanging spot.
        s.x = s.restX;
        s.y = s.restY;
        s.vx = 0;
        s.vy = 0;
        s.angle = 0;
        s.angVel = 0;
        draw();
        return;
      }
      wake();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const step =
        event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown"
          ? KEY_STEP
          : 0;
      if (!step) return;
      event.preventDefault();
      measure();
      const b = bounds();
      if (event.key === "ArrowLeft") s.x = clamp(s.x - step, b.minX, b.maxX);
      if (event.key === "ArrowRight") s.x = clamp(s.x + step, b.minX, b.maxX);
      if (event.key === "ArrowUp") s.y = clamp(s.y - step, b.minY, b.maxY);
      if (event.key === "ArrowDown") s.y = clamp(s.y + step, b.minY, b.maxY);
      draw();
      wake();
    };

    const onResize = () => {
      measure();
      const b = bounds();
      s.x = clamp(s.x, b.minX, b.maxX);
      s.y = clamp(s.y, b.minY, b.maxY);
      draw();
      wake();
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      s.reducedMotion = event.matches;
      if (event.matches) {
        s.angVel = 0;
        s.angle = 0;
        draw();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // rAF pauses while hidden: park the pendulum upright and, unless the
        // badge is being held, settle it back on its hanging spot.
        if (s.raf) cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.angle = 0;
        s.angVel = 0;
        if (!s.dragging) {
          s.x = s.restX;
          s.y = s.restY;
          s.vx = 0;
          s.vy = 0;
        }
        draw();
      }
    };

    measure();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    s.reducedMotion = motionQuery.matches;
    s.x = s.restX;
    s.y = s.restY;
    root.style.left = "0px";
    root.style.top = "0px";
    draw();

    motionQuery.addEventListener("change", onMotionPreferenceChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("keydown", onKeyDown);

    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      s.raf = 0;
      motionQuery.removeEventListener("change", onMotionPreferenceChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("keydown", onKeyDown);
    };
    // Refs are stable; the simulation lives in a ref, so an empty dep list is correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <svg ref={svgRef} aria-hidden className="badge-straps">
        <line ref={strapRefs[0]} stroke="#0d0d0d" strokeLinecap="round" />
        <line ref={strapRefs[1]} stroke="#0d0d0d" strokeLinecap="round" />
        <line ref={sheenRefs[0]} stroke="rgba(255,255,255,0.14)" strokeLinecap="round" strokeWidth="2" />
        <line ref={sheenRefs[1]} stroke="rgba(255,255,255,0.14)" strokeLinecap="round" strokeWidth="2" />
        <line ref={connectorRef} stroke="#0d0d0d" strokeLinecap="round" />
      </svg>

      <div
        ref={rootRef}
        role="img"
        aria-label="Hanging ID badge reading Mahir Malik, AI Systems Builder. Drag with a pointer or use the arrow keys to move it; it swings back to its hanging spot on release."
        tabIndex={0}
        className="badge-root"
      >
        <div aria-hidden className="badge-crimp" />
        <div aria-hidden className="badge-hook" />

        <div ref={swingRef} className="badge-swing">
          <div className="badge-card">
            <span aria-hidden className="badge-hole badge-hole-l" />
            <span aria-hidden className="badge-hole badge-hole-r" />
            <span aria-hidden className="badge-slot" />

            <div className="badge-paper">
              <p className="badge-name">
                <span className="badge-name-dark">Mahir</span>
                <span className="badge-name-blue">Malik.</span>
              </p>

              <p className="badge-role">AI Systems Builder</p>
              <p className="badge-line">Agents · Automation · LLMs</p>

              <div className="badge-foot">
                <div className="badge-rule" />
                <p className="badge-site">
                  <span>Site</span>
                  mahirmalik.in
                </p>
                <div className="badge-chips">
                  <span>AI Systems</span>
                  <span>Agents</span>
                  <span>Automation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
