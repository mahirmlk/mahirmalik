"use client";

import { useEffect, useRef } from "react";

/**
 * Hanging ID badge modeled as a real lanyard, matching the reference:
 *
 * - A fixed pivot sits beyond the top edge of the hero; the hook always
 *   stays at a FIXED radius from it (a pendulum). Nothing is ever
 *   stretched — dragging swings the badge along that arc.
 * - The badge + clip + connector rotate as ONE rigid body (like the
 *   reference, where the card tilts with the strap), and the strap itself
 *   is a fabric ribbon that FLEXES — drawn as a quadratic curve whose bow
 *   opposes the rotation, so the thread bends naturally instead of
 *   snapping like elastic.
 * - Motion is slow and heavy: soft springs with high damping, so the
 *   badge lazily follows the pointer and eases back under the pivot with
 *   at most one gentle settle — no fast bouncing.
 * - Both the strap and the card cast soft real-time shadows (offset
 *   down-right) that track the swing.
 * - Position is applied synchronously in the event handlers so dragging
 *   works even while requestAnimationFrame is paused; the rAF loop drives
 *   the springs and parks everything on visibility changes.
 */

const HOOK_REST_Y = 0.33; // hook rest height, fraction of hero height
const CARD_TOP = 24; // hook → card top, px (hook tip curls through the slot)
const MAX_ANGLE = 0.85; // pendulum clamp, radians (~49°)
const KEY_IMPULSE = 0.05; // keyboard flick, angular velocity
const FOLLOW_K = 0.12; // pendulum stiffness while held (heavy follow)
const FOLLOW_DAMP = 0.82;
const SWING_K = 0.016; // pendulum stiffness while swinging back (slow)
const SWING_DAMP = 0.94;
const CARD_K = 0.18; // card follows the strap angle with a hint of lag
const CARD_DAMP = 0.82;
const FLEX_K = 0.2; // strap bow spring toward its lag target
const FLEX_DAMP = 0.85;
const FLEX_PER_VEL = 260; // px of bow per rad/frame of rotation speed
const FLEX_MAX = 16;
const PIVOT_ABOVE = 60; // pivot height beyond the hero's top edge, px
const STRAP_INK = "#353736";
const STRAP_LIGHT = "#4a4d4b";
const SHADOW_INK = "rgba(25,25,25,0.13)";

export function IdBadge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const strapRefs = [useRef<SVGPathElement>(null), useRef<SVGPathElement>(null)];
  const shadeRefs = [useRef<SVGPathElement>(null), useRef<SVGPathElement>(null)];
  const sheenRefs = [useRef<SVGPathElement>(null), useRef<SVGPathElement>(null)];
  const shadowConnectorRef = useRef<SVGLineElement>(null);
  const assemblyRef = useRef<SVGGElement>(null);
  const connectorRef = useRef<SVGLineElement>(null);
  const crimpRef = useRef<SVGRectElement>(null);
  const crimpSlotRef = useRef<SVGRectElement>(null);
  const clipNeckRef = useRef<SVGPathElement>(null);
  const clipShieldRef = useRef<SVGPathElement>(null);
  const clipRivetRef = useRef<SVGCircleElement>(null);
  const clipHookRef = useRef<SVGPathElement>(null);

  const sim = useRef({
    theta: 0,
    thetaVel: 0,
    thetaTarget: 0,
    cardAngle: 0,
    cardAngVel: 0,
    flex: 0,
    flexVel: 0,
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

    // Static geometry of the rotating assembly, in pivot-local coordinates
    // (the group carries transform="translate(px py) rotate(-theta)"), so
    // swinging costs one attribute write on the group and nothing else.
    const layoutAssembly = () => {
      const w = s.strokeW;
      const top = s.radius - s.connector; // crimp seat on the strap
      connectorRef.current?.setAttribute("stroke-width", String(w));
      shadowConnectorRef.current?.setAttribute("stroke-width", String(w + 9));

      // Silver crimp band with the folded strap end showing through.
      crimpRef.current?.setAttribute("x", String(-w * 1.05));
      crimpRef.current?.setAttribute("y", String(top - 9.5));
      crimpRef.current?.setAttribute("width", String(w * 2.1));
      crimpRef.current?.setAttribute("height", String(19));
      crimpSlotRef.current?.setAttribute("x", String(-w * 0.5));
      crimpSlotRef.current?.setAttribute("y", String(top - 3.5));
      crimpSlotRef.current?.setAttribute("width", String(w));
      crimpSlotRef.current?.setAttribute("height", String(7));

      // Steel swivel snap hook: neck → bell head → curved tip through slot.
      clipNeckRef.current?.setAttribute(
        "d",
        `M -7 ${s.radius - 1} L 7 ${s.radius - 1} L 3.5 ${s.radius + 8} L -3.5 ${s.radius + 8} Z`,
      );
      clipShieldRef.current?.setAttribute(
        "d",
        `M -10 ${s.radius + 7} C -10 ${s.radius + 16} -4 ${s.radius + 20} 0 ${s.radius + 20} C 4 ${s.radius + 20} 10 ${s.radius + 16} 10 ${s.radius + 7} Z`,
      );
      clipRivetRef.current?.setAttribute("cy", String(s.radius + 12.5));
      clipRivetRef.current?.setAttribute("r", "2.8");
      clipHookRef.current?.setAttribute(
        "d",
        `M 0 ${s.radius + 20} C 0 ${s.radius + 30} -2 ${s.radius + 36} -5.5 ${s.radius + 42} C -8.5 ${s.radius + 47.5} -3 ${s.radius + 52} 2.5 ${s.radius + 48.5}`,
      );
      clipHookRef.current?.setAttribute("stroke-width", "8");
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
      s.connector = clamp(s.heroH * 0.085, 56, 100);
      s.spread = clamp(s.heroW * 0.069, 40, 150);
      s.strokeW = clamp(s.heroW * 0.009, 10, 17);
      svg.setAttribute("stroke-width", String(s.strokeW));
      layoutAssembly();
    };

    // Fabric ribbon as a quadratic curve: anchor → crimp, bowing by the
    // flex amount opposite to the rotation. At flex = 0 it is the straight
    // strap of the resting V; while swinging it bends like cloth.
    const ribbonPath = (ax: number, ay: number, crimpX: number, crimpY: number, fold: number, ox: number, oy: number) => {
      const ex = ax + (crimpX - ax) * fold;
      const ey = ay + (crimpY - ay) * fold;
      const mx = (ax + ex) / 2 + ox;
      const my = (ay + ey) / 2 + oy;
      const bx = mx + s.flex;
      const by = my;
      return `M ${ax + ox} ${ay + oy} Q ${bx + ox} ${by + oy} ${ex + ox} ${ey + oy}`;
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
      // The left strap runs a touch past the crimp so its tip hides behind
      // the right strap — the fold from the reference.
      const anchors: Array<[number, number]> = [
        [s.px - s.spread, -40],
        [s.px + s.spread, -40],
      ];
      anchors.forEach(([ax, ay], i) => {
        const fold = i === 1 ? 1 : 1.035;
        const dx = crimpX - ax;
        const dy = crimpY - ay;
        const len = Math.hypot(dx, dy) || 1;
        const ox = (-dy / len) * w * 0.28;
        const oy = (dx / len) * w * 0.28;
        strapRefs[i].current?.setAttribute("d", ribbonPath(ax, ay, crimpX, crimpY, fold, 0, 0));
        sheenRefs[i].current?.setAttribute("d", ribbonPath(ax, ay, crimpX, crimpY, fold, ox, oy));
        // Real-time cast shadow, offset down-right.
        shadeRefs[i].current?.setAttribute(
          "d",
          ribbonPath(ax + 26, ay + 19, crimpX + 26, crimpY + 19, fold, 0, 0),
        );
      });
      setLine(shadowConnectorRef, crimpX + 26, crimpY + 19, hookX + 26, hookY + 19);
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
      // The card is part of the rigid body; a soft spring gives it a hint
      // of lag behind the strap, like a real swivel.
      s.cardAngVel += (s.theta - s.cardAngle) * CARD_K;
      s.cardAngVel *= CARD_DAMP;
      s.cardAngle += s.cardAngVel;
      // The strap bows against the rotation and relaxes when it stops.
      const flexTarget = s.reducedMotion ? 0 : clamp(-s.thetaVel * FLEX_PER_VEL, -FLEX_MAX, FLEX_MAX);
      s.flexVel += (flexTarget - s.flex) * FLEX_K;
      s.flexVel *= FLEX_DAMP;
      s.flex += s.flexVel;
      draw();

      const settled =
        Math.abs(s.thetaVel) < 0.0004 &&
        Math.abs(s.cardAngVel) < 0.0006 &&
        Math.abs(s.cardAngle - s.theta) < 0.0005 &&
        Math.abs(s.flexVel) < 0.01 &&
        Math.abs(s.flex) < 0.05 &&
        (s.dragging ? Math.abs(s.thetaTarget - s.theta) < 0.0006 : Math.abs(s.theta) < 0.0004);
      if (settled) {
        if (!s.dragging) s.theta = 0;
        s.thetaVel = 0;
        s.cardAngle = s.theta;
        s.cardAngVel = 0;
        s.flex = 0;
        s.flexVel = 0;
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
        s.cardAngle = s.theta;
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
        s.cardAngle = s.theta;
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
        s.flex = 0;
        s.flexVel = 0;
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
        s.cardAngle = s.theta;
        s.cardAngVel = 0;
        s.flex = 0;
        s.flexVel = 0;
        draw();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (s.raf) cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.theta = s.dragging ? s.thetaTarget : 0;
        s.thetaVel = 0;
        s.cardAngle = s.theta;
        s.cardAngVel = 0;
        s.flex = 0;
        s.flexVel = 0;
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
            <stop offset="0" stopColor="#a6a6a6" />
            <stop offset="0.28" stopColor="#ffffff" />
            <stop offset="0.55" stopColor="#cfcfcf" />
            <stop offset="1" stopColor="#767676" />
          </linearGradient>
          <linearGradient id="lanyard-metal-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="#c4c4c4" />
            <stop offset="1" stopColor="#838383" />
          </linearGradient>
        </defs>

        {/* Cast shadows, offset down-right like the reference. */}
        <path ref={shadeRefs[0]} stroke={SHADOW_INK} fill="none" strokeLinecap="butt" />
        <path ref={shadeRefs[1]} stroke={SHADOW_INK} fill="none" strokeLinecap="butt" />
        <line ref={shadowConnectorRef} stroke={SHADOW_INK} strokeLinecap="butt" />

        {/* Real straps + fabric fold highlight, flexing with the swing. */}
        <path ref={strapRefs[0]} stroke={STRAP_INK} fill="none" strokeLinecap="butt" />
        <path ref={strapRefs[1]} stroke={STRAP_INK} fill="none" strokeLinecap="butt" />
        <path ref={sheenRefs[0]} stroke={STRAP_LIGHT} fill="none" strokeLinecap="butt" />
        <path ref={sheenRefs[1]} stroke={STRAP_LIGHT} fill="none" strokeLinecap="butt" />

        {/* Rotating assembly (pivot-local): connector, crimp, swivel hook. */}
        <g ref={assemblyRef}>
          <line ref={connectorRef} stroke={STRAP_INK} strokeLinecap="butt" />
          <rect ref={crimpRef} rx="2.5" fill="url(#lanyard-metal-v)" stroke="#777777" strokeWidth="0.8" />
          <rect ref={crimpSlotRef} rx="1.5" fill="#6d6d6d" />
          <path ref={clipNeckRef} fill="url(#lanyard-metal)" stroke="#5f5f5f" strokeWidth="0.7" />
          <path ref={clipShieldRef} fill="url(#lanyard-metal-v)" stroke="#5f5f5f" strokeWidth="0.8" />
          <circle ref={clipRivetRef} cx="0" r="2.2" fill="#7d7d7d" />
          <path
            ref={clipHookRef}
            fill="none"
            stroke="url(#lanyard-metal)"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
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
