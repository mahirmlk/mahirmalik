"use client";

import { useEffect, useRef } from "react";

/**
 * Hanging ID badge on a fabric lanyard, matching the reference:
 *
 * - The badge moves FREELY in 2D while dragged (up, down, sideways) with a
 *   soft, weighty follow; on release it eases slowly back to its hanging
 *   spot under slow, heavily damped springs — no elastic snapping.
 * - The strap is fabric: it renders as a curve from the fixed top anchors
 *   to the badge and bows against horizontal motion while swinging. The
 *   connector (crimp → clip) keeps a FIXED length and always points from
 *   the badge toward the pivot, so the thread near the badge never
 *   stretches; the straps themselves just re-angle (sliding over the
 *   neck), and the card tilts to align with that pull.
 * - The card + steel clip + shadows all update in real time. Position is
 *   applied synchronously in the event handlers so dragging works even
 *   while requestAnimationFrame is paused; the rAF loop drives the springs
 *   and parks everything on visibility changes.
 */

const HOOK_REST_Y = 0.33; // hook rest height, fraction of hero height
const CARD_TOP = 24; // hook → card top, px (hook tip curls through the slot)
const KEY_STEP = 44; // keyboard nudge, px
const DRAG_K = 0.42; // follow smoothing while held (attached, not rubbery)
const GRAVITY = 0.32; // px/frame² while falling under the thread
const ROPE_DAMP = 0.982; // air drag on the free swing
const CARD_K = 0.15; // card tilt spring toward the strap pull
const CARD_DAMP = 0.85;
const FLEX_K = 0.2; // strap bow spring
const FLEX_DAMP = 0.85;
const FLEX_PER_VX = 0.45; // px of bow per px/frame of horizontal speed
const FLEX_MAX = 16;
const SAG_MAX = 46; // strap sag while the thread is slack, px
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
    x: 0,
    y: 0,
    restX: 0,
    restY: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    grabOffX: 0,
    grabOffY: 0,
    cardAngle: 0,
    cardAngVel: 0,
    flex: 0,
    flexVel: 0,
    sag: 0,
    ropeLen: 0, // pivot → hook distance when the thread hangs taut
    dragging: false,
    raf: 0,
    heroW: 0,
    heroH: 0,
    px: 0, // pivot (neck) beyond the top edge
    py: 0,
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

    // Hardware geometry, assembly-local (origin = the crimp; the group
    // carries transform="translate(crimpX crimpY) rotate(phi)" so swinging
    // costs one attribute write and the connector length is constant).
    const layoutAssembly = () => {
      const w = s.strokeW;
      connectorRef.current?.setAttribute("stroke-width", String(w));
      shadowConnectorRef.current?.setAttribute("stroke-width", String(w + 9));
      sheenRefs[0].current?.setAttribute("stroke-width", String(w * 0.42));
      sheenRefs[1].current?.setAttribute("stroke-width", String(w * 0.42));
      shadeRefs[0].current?.setAttribute("stroke-width", String(w + 9));
      shadeRefs[1].current?.setAttribute("stroke-width", String(w + 9));

      // Silver crimp band with the folded strap end showing through.
      crimpRef.current?.setAttribute("x", String(-w * 1.05));
      crimpRef.current?.setAttribute("y", String(-9.5));
      crimpRef.current?.setAttribute("width", String(w * 2.1));
      crimpRef.current?.setAttribute("height", String(19));
      crimpSlotRef.current?.setAttribute("x", String(-w * 0.5));
      crimpSlotRef.current?.setAttribute("y", String(-3.5));
      crimpSlotRef.current?.setAttribute("width", String(w));
      crimpSlotRef.current?.setAttribute("height", String(7));

      // Steel swivel snap hook: neck → bell head → curved tip through slot.
      clipNeckRef.current?.setAttribute(
        "d",
        `M -7 ${s.connector - 1} L 7 ${s.connector - 1} L 3.5 ${s.connector + 8} L -3.5 ${s.connector + 8} Z`,
      );
      clipShieldRef.current?.setAttribute(
        "d",
        `M -10 ${s.connector + 7} C -10 ${s.connector + 16} -4 ${s.connector + 20} 0 ${s.connector + 20} C 4 ${s.connector + 20} 10 ${s.connector + 16} 10 ${s.connector + 7} Z`,
      );
      clipRivetRef.current?.setAttribute("cy", String(s.connector + 12.5));
      clipRivetRef.current?.setAttribute("r", "2.8");
      clipHookRef.current?.setAttribute(
        "d",
        `M 0 ${s.connector + 20} C 0 ${s.connector + 30} -2 ${s.connector + 36} -5.5 ${s.connector + 42} C -8.5 ${s.connector + 47.5} -3 ${s.connector + 52} 2.5 ${s.connector + 48.5}`,
      );
      clipHookRef.current?.setAttribute("stroke-width", "8");
      connectorRef.current?.setAttribute("y2", String(s.connector - 2));
    };

    const measure = () => {
      if (!hero || !card) return;
      const rect = hero.getBoundingClientRect();
      s.heroW = rect.width;
      s.heroH = rect.height;
      s.restY = clamp(
        s.heroH * HOOK_REST_Y,
        140,
        s.heroH - CARD_TOP - card.offsetHeight - 14,
      );
      s.restX = s.heroW / 2;
      s.px = s.heroW / 2;
      s.py = -PIVOT_ABOVE;
      s.ropeLen = s.restY + PIVOT_ABOVE;
      s.connector = clamp(s.heroH * 0.085, 56, 100);
      s.spread = clamp(s.heroW * 0.069, 40, 150);
      s.strokeW = clamp(s.heroW * 0.009, 10, 17);
      svg.setAttribute("stroke-width", String(s.strokeW));
      layoutAssembly();
    };

    const bounds = () => ({
      minX: s.heroW * 0.14,
      maxX: s.heroW * 0.86,
      minY: 96,
      maxY: s.heroH - CARD_TOP - (card?.offsetHeight ?? 0) - 12,
    });

    const draw = () => {
      const w = s.strokeW;
      const toPivotX = s.px - s.x;
      const toPivotY = s.py - s.y;
      const dist = Math.hypot(toPivotX, toPivotY) || 1;
      const ux = toPivotX / dist;
      const uy = toPivotY / dist;
      // The connector keeps its fixed length and points at the pivot, so
      // the thread near the badge never stretches.
      const crimpX = s.x + s.connector * ux;
      const crimpY = s.y + s.connector * uy;

      root.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      swing.style.transform = `rotate(${s.cardAngle}rad)`;
      // Rotate the assembly so its +y (crimp → hook) matches the pull
      // direction from the crimp down to the badge.
      const dirX = -ux;
      const dirY = -uy;
      assembly.setAttribute("transform", `translate(${crimpX} ${crimpY}) rotate(${(-Math.atan2(dirX, dirY) * 180) / Math.PI})`);

      // Straps: fixed anchors beyond the top edge → the crimp, drawn as
      // fabric that bows against horizontal motion. The left strap runs a
      // touch past the crimp so its tip hides behind the right one.
      const anchors: Array<[number, number]> = [
        [s.px - s.spread, -40],
        [s.px + s.spread, -40],
      ];
      anchors.forEach(([ax, ay], i) => {
        const fold = i === 1 ? 1 : 1.035;
        const ex = ax + (crimpX - ax) * fold;
        const ey = ay + (crimpY - ay) * fold;
        const dx = crimpX - ax;
        const dy = crimpY - ay;
        const len = Math.hypot(dx, dy) || 1;
        const ox = (-dy / len) * w * 0.28;
        const oy = (dx / len) * w * 0.28;
        const mx = (ax + ex) / 2;
        const my = (ay + ey) / 2;
        const bx = mx + s.flex;
        const by = my + s.sag;
        strapRefs[i].current?.setAttribute("d", `M ${ax} ${ay} Q ${bx} ${by} ${ex} ${ey}`);
        sheenRefs[i].current?.setAttribute(
          "d",
          `M ${ax + ox} ${ay + oy} Q ${bx + ox} ${by + oy} ${ex + ox} ${ey + oy}`,
        );
        // Real-time cast shadow, offset down-right.
        shadeRefs[i].current?.setAttribute("d", `M ${ax + 26} ${ay + 19} Q ${bx + 26} ${by + 19} ${ex + 26} ${ey + 19}`);
      });
      setLine(shadowConnectorRef, crimpX + 26, crimpY + 19, s.x + 26, s.y + 19);
    };

    const tick = () => {
      if (s.dragging) {
        // Held: the badge is in hand — smooth but attached, no rubber lag.
        const nx = s.x + (s.targetX - s.x) * DRAG_K;
        s.vx = nx - s.x;
        s.x = nx;
        const ny = s.y + (s.targetY - s.y) * DRAG_K;
        s.vy = ny - s.y;
        s.y = ny;
      } else {
        // Rope physics: gravity pulls the badge down; the thread only
        // resists when pulled taut (no spring pulling it back — that is
        // what made it feel like elastic). Slack thread = free fall.
        s.vy += GRAVITY;
        s.vx *= ROPE_DAMP;
        s.vy *= ROPE_DAMP;
        s.x += s.vx;
        s.y += s.vy;

        const dx = s.x - s.px;
        const dy = s.y - s.py;
        const d = Math.hypot(dx, dy) || 1;
        if (d > s.ropeLen) {
          // Taut: pin to the rope circle and remove the outward part of
          // the velocity, keeping the tangential swing.
          const ux = dx / d;
          const uy = dy / d;
          s.x = s.px + ux * s.ropeLen;
          s.y = s.py + uy * s.ropeLen;
          const radial = s.vx * ux + s.vy * uy;
          if (radial > 0) {
            s.vx -= radial * ux;
            s.vy -= radial * uy;
            // A little friction where the strap runs through the slide.
            s.vx *= 0.992;
            s.vy *= 0.992;
          }
        }
        // Keep the badge inside the hero.
        const b = bounds();
        if (s.x < b.minX) { s.x = b.minX; s.vx = Math.max(0, s.vx); }
        if (s.x > b.maxX) { s.x = b.maxX; s.vx = Math.min(0, s.vx); }
        if (s.y < b.minY) { s.y = b.minY; s.vy = Math.max(0, s.vy); }
        if (s.y > b.maxY) { s.y = b.maxY; s.vy = Math.min(0, s.vy); }
      }
      // Card tilts to align with the pull of the strap toward the pivot;
      // slack thread (badge well inside the radius) lets it hang vertical.
      const toPivotX = s.px - s.x;
      const toPivotY = s.py - s.y;
      const dist = Math.hypot(toPivotX, toPivotY) || 1;
      const taut = clamp(dist / s.ropeLen, 0, 1);
      const tiltTarget = s.reducedMotion ? 0 : Math.atan2(toPivotX, -toPivotY) * taut;
      s.cardAngVel += (tiltTarget - s.cardAngle) * CARD_K;
      s.cardAngVel *= CARD_DAMP;
      s.cardAngle += s.cardAngVel;
      // The strap bows against horizontal motion and relaxes when it stops.
      const flexTarget = s.reducedMotion ? 0 : clamp(-s.vx * FLEX_PER_VX, -FLEX_MAX, FLEX_MAX);
      s.flexVel += (flexTarget - s.flex) * FLEX_K;
      s.flexVel *= FLEX_DAMP;
      s.flex += s.flexVel;
      // Slack thread: the straps sag away from the straight line.
      s.sag = Math.min(SAG_MAX, Math.max(0, s.ropeLen - dist) * 0.5);
      draw();

      const hanging = Math.abs(s.x - s.restX) < 0.6 && Math.abs(s.y - s.restY) < 0.6;
      const settled =
        Math.abs(s.vx) < 0.06 &&
        Math.abs(s.vy) < 0.06 &&
        Math.abs(s.cardAngVel) < 0.0008 &&
        Math.abs(s.flexVel) < 0.01 &&
        Math.abs(s.flex) < 0.05 &&
        s.sag < 0.6 &&
        (s.dragging
          ? Math.abs(s.targetX - s.x) < 0.4 && Math.abs(s.targetY - s.y) < 0.4
          : hanging);
      if (settled) {
        if (!s.dragging) {
          s.x = s.restX;
          s.y = s.restY;
        }
        s.vx = 0;
        s.vy = 0;
        s.cardAngVel = 0;
        s.flex = 0;
        s.flexVel = 0;
        s.sag = 0;
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
      measure();
      const b = bounds();
      s.x = clamp(s.x, b.minX, b.maxX);
      s.y = clamp(s.y, b.minY, b.maxY);
      const { hx, hy } = heroPoint(event);
      s.grabOffX = s.x - hx;
      s.grabOffY = s.y - hy;
      s.targetX = s.x;
      s.targetY = s.y;
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
      s.targetX = clamp(hx + s.grabOffX, b.minX, b.maxX);
      s.targetY = clamp(hy + s.grabOffY, b.minY, b.maxY);
      if (s.reducedMotion) {
        s.x = s.targetX;
        s.y = s.targetY;
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
        s.x = s.restX;
        s.y = s.restY;
        s.vx = 0;
        s.vy = 0;
        s.cardAngle = 0;
        s.cardAngVel = 0;
        s.flex = 0;
        s.sag = 0;
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
      // A shove sends the badge drifting; the lanyard pulls it back.
      s.vx += event.key === "ArrowLeft" ? -KEY_STEP * 0.4 : KEY_STEP * 0.4;
      wake();
    };

    const onResize = () => {
      measure();
      const b = bounds();
      s.x = clamp(s.x, b.minX, b.maxX);
      s.y = clamp(s.y, b.minY, b.maxY);
      draw();
    };

    const onMotionPreferenceChange = (event: MediaQueryListEvent) => {
      s.reducedMotion = event.matches;
      if (event.matches) {
        s.cardAngle = 0;
        s.cardAngVel = 0;
        s.flex = 0;
        s.sag = 0;
        s.flexVel = 0;
        draw();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (s.raf) cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.flex = 0;
        s.sag = 0;
        s.flexVel = 0;
        if (!s.dragging) {
          s.x = s.restX;
          s.y = s.restY;
          s.vx = 0;
          s.vy = 0;
          s.cardAngle = 0;
          s.cardAngVel = 0;
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

        {/* Rotating assembly (crimp-local): connector, crimp, swivel hook. */}
        <g ref={assemblyRef}>
          <line ref={connectorRef} x1="0" y1="4" stroke={STRAP_INK} strokeLinecap="butt" />
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
        aria-label="Hanging ID badge reading Mahir Malik, AI Engineer. Drag it anywhere with a pointer or nudge it with the arrow keys; the lanyard eases it back to its hanging spot."
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
