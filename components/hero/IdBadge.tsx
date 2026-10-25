"use client";

import { useEffect, useRef } from "react";

/**
 * Hanging ID badge modeled as a real lanyard:
 *
 * - A fixed pivot sits beyond the top edge of the hero; the hook always
 *   stays at a FIXED radius from it (a pendulum). Nothing is ever
 *   stretched — dragging swings the badge along that arc, and the straps
 *   only re-angle (their length barely changes because the pivot sits
 *   between the two anchor points).
 * - The connector (crimp → swivel clip) and the metal clip live in the SVG
 *   and rotate with the pendulum; the card hangs from the swivel so it
 *   stays vertical with a soft counter-sway.
 * - Grabbing pulls the pendulum toward the pointer; releasing lets it
 *   swing back and settle under the pivot. Position is applied
 *   synchronously in the event handlers so dragging works even while
 *   requestAnimationFrame is paused; the rAF loop drives the springs and
 *   parks everything on visibility changes.
 * - A soft offset shadow (straps + connector in the SVG, wall shadow on
 *   the card) tracks the geometry in real time, like the reference mock.
 */

const HOOK_REST_Y = 0.33; // hook rest height, fraction of hero height
const CARD_TOP = 21; // hook → card top, px (ring overlaps the slot)
const MAX_ANGLE = 0.85; // pendulum clamp, radians (~49°)
const KEY_IMPULSE = 0.09; // keyboard nudge, angular velocity
const FOLLOW_K = 0.28; // pendulum stiffness while held
const FOLLOW_DAMP = 0.72;
const SWING_K = 0.055; // pendulum stiffness while swinging back
const SWING_DAMP = 0.925;
const CARD_K = 0.09; // card sway spring toward its hang angle
const CARD_DAMP = 0.88;
const PIVOT_ABOVE = 60; // pivot height beyond the hero's top edge, px

export function IdBadge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const strapRefs = [useRef<SVGLineElement>(null), useRef<SVGLineElement>(null)];
  const shadeRefs = [useRef<SVGLineElement>(null), useRef<SVGLineElement>(null)];
  const sheenRefs = [useRef<SVGLineElement>(null), useRef<SVGLineElement>(null)];
  const shadowConnectorRef = useRef<SVGLineElement>(null);
  const assemblyRef = useRef<SVGGElement>(null);
  const connectorRef = useRef<SVGLineElement>(null);
  const crimpRef = useRef<SVGRectElement>(null);
  const clipNeckRef = useRef<SVGRectElement>(null);
  const clipBodyRef = useRef<SVGRectElement>(null);
  const clipRivetRef = useRef<SVGCircleElement>(null);
  const clipRingRef = useRef<SVGEllipseElement>(null);

  const sim = useRef({
    theta: 0,
    thetaVel: 0,
    thetaTarget: 0,
    cardAngle: 0,
    cardAngVel: 0,
    dragging: false,
    raf: 0,
    heroW: 0,
    heroH: 0,
    px: 0, // pivot
    py: 0,
    radius: 0, // pivot → hook, fixed
    connector: 0, // crimp → hook, fixed
    spread: 0,
    strokeW: 0,
    reducedMotion: false,
  });

  useEffect(() => {
    const root = rootRef.current;
    const swing = swingRef.current;
    const svg = svgRef.current;
    const assembly = assemblyRef.current;
    if (!root || !swing || !svg || !assembly) return;

    const hero = root.parentElement;
    const card = swing.firstElementChild as HTMLElement | null;
    const s = sim.current;

    const clamp = (v: number, lo: number, hi: number) => (hi < lo ? lo : Math.min(Math.max(v, lo), hi));

    // Static geometry of the rotating assembly, in pivot-local coordinates
    // (the group carries transform="translate(px py) rotate(theta)").
    const setRect = (
      ref: React.RefObject<SVGRectElement | null>,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      ref.current?.setAttribute("x", String(x));
      ref.current?.setAttribute("y", String(y));
      ref.current?.setAttribute("width", String(width));
      ref.current?.setAttribute("height", String(height));
    };

    const layoutAssembly = () => {
      const w = s.strokeW;
      const top = s.radius - s.connector; // crimp seat, pivot-local
      setLine(connectorRef, 0, top + 6, 0, s.radius - 4);
      setRect(crimpRef, -w * 1.15, top - 9, w * 2.3, 18);
      setRect(clipNeckRef, -2.6, s.radius - 6, 5.2, 10);
      setRect(clipBodyRef, -6, s.radius + 2, 12, 15);
      clipRivetRef.current?.setAttribute("cy", String(s.radius + 7));
      clipRingRef.current?.setAttribute("cy", String(s.radius + 27));
    };

    const measure = () => {
      if (!hero || !card) return;
      const rect = hero.getBoundingClientRect();
      s.heroW = rect.width;
      s.heroH = rect.height;
      const hookRestY = clamp(
        s.heroH * HOOK_REST_Y,
        140,
        s.heroH - CARD_TOP - card.offsetHeight - 14,
      );
      s.px = s.heroW / 2;
      s.py = -PIVOT_ABOVE;
      s.radius = hookRestY + PIVOT_ABOVE;
      s.connector = clamp(s.heroH * 0.11, 64, 120);
      s.spread = clamp(s.heroW * 0.069, 40, 150);
      s.strokeW = clamp(s.heroW * 0.0075, 9, 14);
      svg.setAttribute("stroke-width", String(s.strokeW));
      layoutAssembly();
    };

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

    const draw = () => {
      const sin = Math.sin(s.theta);
      const cos = Math.cos(s.theta);
      const hookX = s.px + s.radius * sin;
      const hookY = s.py + s.radius * cos;
      const crimpX = s.px + (s.radius - s.connector) * sin;
      const crimpY = s.py + (s.radius - s.connector) * cos;
      const w = s.strokeW;

      root.style.transform = `translate3d(${hookX}px, ${hookY}px, 0)`;
      swing.style.transform = `rotate(${s.cardAngle}rad)`;
      // SVG rotate() is clockwise-positive, so negate to match the hook at
      // P + radius·(sin θ, cos θ).
      assembly.setAttribute("transform", `translate(${s.px} ${s.py}) rotate(${(-s.theta * 180) / Math.PI})`);

      // Straps: fixed anchors beyond the top edge → the swinging crimp.
      const anchors: Array<[number, number]> = [
        [s.px - s.spread, -40],
        [s.px + s.spread, -40],
      ];
      anchors.forEach(([ax, ay], i) => {
        const dx = crimpX - ax;
        const dy = crimpY - ay;
        const len = Math.hypot(dx, dy) || 1;
        // Fabric fold highlight hugging the upper-left edge of the ribbon.
        const ox = (-dy / len) * w * 0.28;
        const oy = (dx / len) * w * 0.28;
        setLine(strapRefs[i], ax, ay, crimpX, crimpY);
        setLine(sheenRefs[i], ax + ox, ay + oy, crimpX + ox, crimpY + oy);
        // Real-time cast shadow, offset down-right.
        setLine(shadeRefs[i], ax + 24, ay + 18, crimpX + 24, crimpY + 18);
      });
      setLine(shadowConnectorRef, crimpX + 24, crimpY + 18, hookX + 24, hookY + 18);
    };

    const stepPendulum = (target: number, k: number, damp: number) => {
      s.thetaVel += (target - s.theta) * k;
      s.thetaVel *= damp;
      s.theta += s.thetaVel;
    };

    const tick = () => {
      if (s.dragging) {
        stepPendulum(s.thetaTarget, FOLLOW_K, FOLLOW_DAMP);
      } else {
        stepPendulum(0, SWING_K, SWING_DAMP);
      }
      if (!s.reducedMotion) {
        // The swivel lets the card hang vertical; a soft counter-sway sells it.
        s.cardAngVel += (-s.theta * 0.22 - s.cardAngle) * CARD_K;
        s.cardAngVel *= CARD_DAMP;
        s.cardAngle += s.cardAngVel;
      }
      draw();

      const settled =
        Math.abs(s.thetaVel) < 0.0006 &&
        Math.abs(s.cardAngVel) < 0.0006 &&
        Math.abs(s.cardAngle) < 0.0005 &&
        (s.dragging ? Math.abs(s.thetaTarget - s.theta) < 0.0006 : Math.abs(s.theta) < 0.0005);
      if (settled) {
        if (!s.dragging) s.theta = 0;
        s.thetaVel = 0;
        s.cardAngle = 0;
        s.cardAngVel = 0;
        draw();
        s.raf = 0;
        return;
      }
      s.raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };

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
      s.dragging = true;
      const { hx, hy } = heroPoint(event);
      s.thetaTarget = clamp(Math.atan2(hx - s.px, hy - s.py), -MAX_ANGLE, MAX_ANGLE);
      if (s.reducedMotion) {
        s.theta = s.thetaTarget;
        draw();
      }
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!s.dragging || !root.hasPointerCapture(event.pointerId)) return;
      const { hx, hy } = heroPoint(event);
      s.thetaTarget = clamp(Math.atan2(hx - s.px, hy - s.py), -MAX_ANGLE, MAX_ANGLE);
      if (s.reducedMotion) {
        s.theta = s.thetaTarget;
        draw();
        return;
      }
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
        s.theta = 0;
        s.thetaVel = 0;
        s.cardAngle = 0;
        s.cardAngVel = 0;
        draw();
        return;
      }
      wake();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      if (s.reducedMotion) return;
      // A flick sets the pendulum swinging; it settles back on its own.
      s.thetaVel += event.key === "ArrowLeft" ? -KEY_IMPULSE : KEY_IMPULSE;
      wake();
    };

    const onResize = () => {
      measure();
      draw();
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      s.reducedMotion = event.matches;
      if (event.matches) {
        s.theta = s.dragging ? s.thetaTarget : 0;
        s.thetaVel = 0;
        s.cardAngle = 0;
        s.cardAngVel = 0;
        draw();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (s.raf) cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.theta = s.dragging ? s.thetaTarget : 0;
        s.thetaVel = 0;
        s.cardAngle = 0;
        s.cardAngVel = 0;
        draw();
      }
    };

    measure();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    s.reducedMotion = motionQuery.matches;
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
        <defs>
          <linearGradient id="lanyard-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8f8f8f" />
            <stop offset="0.32" stopColor="#eeeeee" />
            <stop offset="0.52" stopColor="#c6c6c6" />
            <stop offset="1" stopColor="#7a7a7a" />
          </linearGradient>
        </defs>

        {/* Cast shadow, offset down-right like the reference. */}
        <line ref={shadeRefs[0]} stroke="rgba(20,20,20,0.13)" strokeLinecap="butt" />
        <line ref={shadeRefs[1]} stroke="rgba(20,20,20,0.13)" strokeLinecap="butt" />
        <line ref={shadowConnectorRef} stroke="rgba(20,20,20,0.13)" strokeLinecap="butt" />

        {/* Real straps + fabric fold highlight. */}
        <line ref={strapRefs[0]} stroke="#262626" strokeLinecap="butt" />
        <line ref={strapRefs[1]} stroke="#262626" strokeLinecap="butt" />
        <line ref={sheenRefs[0]} stroke="#454545" strokeLinecap="butt" />
        <line ref={sheenRefs[1]} stroke="#454545" strokeLinecap="butt" />

        {/* Rotating assembly (pivot-local): connector strap, crimp, swivel clip. */}
        <g ref={assemblyRef}>
          <line ref={connectorRef} stroke="#262626" strokeLinecap="butt" />
          <rect ref={crimpRef} rx="3" fill="url(#lanyard-metal)" stroke="#6f6f6f" strokeWidth="0.75" />
          <rect ref={clipNeckRef} fill="url(#lanyard-metal)" />
          <rect ref={clipBodyRef} rx="4.5" fill="url(#lanyard-metal)" stroke="#6b6b6b" strokeWidth="0.75" />
          <circle ref={clipRivetRef} cx="0" r="1.7" fill="#9a9a9a" />
          <ellipse ref={clipRingRef} cx="0" rx="8.5" ry="6.5" fill="none" stroke="url(#lanyard-metal)" strokeWidth="3.4" />
        </g>
      </svg>

      <div
        ref={rootRef}
        role="img"
        aria-label="Hanging ID badge reading Mahir Malik, AI Engineer. Drag with a pointer or flick it with the arrow keys; it swings and settles back under the lanyard."
        tabIndex={0}
        className="badge-root"
      >
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

              <p className="badge-role">AI Engineer</p>

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
