"use client";

import { useEffect, useRef } from "react";

/** Draggable ID badge on a fixed-length spherical pendulum. */
const REST_Y = 0.33;
const ANCHOR_Y = -40;
const CARD_SLOT_RATIO = 0.044;
const CONNECTOR_RATIO = 0.03;
const GRAVITY = 500;
const DAMPING = 0.16;
const MAX_POINTER_SPEED = 90;
const fmt = (value: number) => Math.round(value * 10) / 10;

export function IdBadge() {
  const rootRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const leftStrapRef = useRef<SVGPathElement>(null);
  const rightStrapRef = useRef<SVGPathElement>(null);
  const assemblyRef = useRef<SVGGElement>(null);
  const pinRef = useRef<SVGPathElement>(null);
  const pinHighlightRef = useRef<SVGPathElement>(null);

  const sim = useRef({
    width: 0,
    height: 0,
    homeX: 0,
    homeY: 0,
    pivotX: 0,
    pivotY: 0,
    length: 0,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    connector: 30,
    spread: 80,
    strapWidth: 10,
    slotOffset: 10,
    dragging: false,
    grabX: 0,
    grabY: 0,
    lastX: 0,
    lastY: 0,
    lastZ: 0,
    lastPointerTime: 0,
    lastFrame: 0,
    raf: 0,
  });

  useEffect(() => {
    const root = rootRef.current;
    const swing = swingRef.current;
    const card = cardRef.current;
    const svg = svgRef.current;
    const leftStrap = leftStrapRef.current;
    const rightStrap = rightStrapRef.current;
    const assembly = assemblyRef.current;
    const pin = pinRef.current;
    const pinHighlight = pinHighlightRef.current;
    const hero = root?.parentElement;
    if (!root || !swing || !card || !svg || !leftStrap || !rightStrap || !assembly || !pin || !pinHighlight || !hero) return;

    const s = sim.current;
    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const measure = () => {
      const rect = hero.getBoundingClientRect();
      s.width = rect.width;
      s.height = rect.height;
      s.slotOffset = card.offsetWidth * CARD_SLOT_RATIO;
      s.connector = clamp(rect.height * CONNECTOR_RATIO, 26, 34);
      s.spread = clamp(rect.width * 0.055, 36, 120);
      s.strapWidth = clamp(rect.width * 0.0072, 6, 13);
      s.homeX = rect.width / 2;
      s.homeY = clamp(rect.height * REST_Y, 140 + s.slotOffset, rect.height - card.offsetHeight + s.slotOffset - 14);
      s.pivotX = s.homeX;
      s.pivotY = ANCHOR_Y;
      s.length = s.homeY - s.pivotY;
      s.x = s.homeX;
      s.y = s.homeY;
      s.z = 0;
      s.vx = 0;
      s.vy = 0;
      s.vz = 0;
      s.lastZ = 0;
      card.style.top = `${-s.slotOffset}px`;
      root.style.left = "0px";
      root.style.top = "0px";
      svg.setAttribute("viewBox", `0 0 ${fmt(rect.width)} ${fmt(rect.height)}`);
      svg.setAttribute("stroke-width", String(s.strapWidth));
      draw();
    };

    const draw = () => {
      const dx = s.x - s.homeX;
      const dy = s.y - s.homeY;
      const pinPath = `M 0 20 L 0 ${fmt(s.connector)}`;
      const crimpX = s.x;
      const crimpY = s.y - s.connector;
      const bend = clamp(dx * 0.09 + dy * 0.04 + s.vx * 0.015 + s.vy * 0.012, -24, 24);
      const strapCurve = (anchorX: number, sway: number) => {
        const dx = crimpX - anchorX;
        const dy = crimpY - ANCHOR_Y;
        const distance = Math.hypot(dx, dy) || 1;
        const nx = -dy / distance;
        const ny = dx / distance;
        const x1 = anchorX + dx / 3 + nx * sway * 0.45;
        const y1 = ANCHOR_Y + dy / 3 + ny * sway * 0.45;
        const x2 = anchorX + (dx * 2) / 3 + nx * sway;
        const y2 = ANCHOR_Y + (dy * 2) / 3 + ny * sway;
        return `M ${fmt(anchorX)} ${ANCHOR_Y} C ${fmt(x1)} ${fmt(y1)} ${fmt(x2)} ${fmt(y2)} ${fmt(crimpX)} ${fmt(crimpY)}`;
      };
      leftStrap.setAttribute("d", strapCurve(s.homeX - s.spread, -bend * 0.65));
      rightStrap.setAttribute("d", strapCurve(s.homeX + s.spread, bend));
      pin.setAttribute("d", pinPath);
      pinHighlight.setAttribute("d", pinPath);
      root.style.transform = `translate3d(${fmt(s.x)}px, ${fmt(s.y)}px, 0)`;

      // Small perspective roll and pitch respond to both drag direction and speed.
      const pitch = clamp(dy * 0.00055 - s.vy * 0.00018, -0.28, 0.28);
      const yaw = clamp(-dx * 0.00055 + s.vx * 0.00018, -0.3, 0.3);
      const roll = clamp(s.vx * 0.00022 + dx * 0.00018, -0.22, 0.22);
      swing.style.transform = `perspective(1000px) rotateX(${fmt(pitch)}rad) rotateY(${fmt(yaw)}rad) rotateZ(${fmt(roll)}rad)`;

      // The card's cast shadow shifts with its live position, pitch, and velocity.
      card.style.setProperty("--badge-shadow-x", `${fmt(clamp(22 + dx * 0.16 + s.vx * 0.05, 10, 42))}px`);
      card.style.setProperty("--badge-shadow-y", `${fmt(clamp(28 + dy * 0.16 + s.vy * 0.05, 12, 48))}px`);
      assembly.setAttribute("transform", `translate(${fmt(crimpX)} ${fmt(crimpY)})`);
    };

    const snapHome = () => {
      s.x = s.homeX;
      s.y = s.homeY;
      s.z = 0;
      s.vx = 0;
      s.vy = 0;
      s.vz = 0;
      draw();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - (s.lastFrame || now)) / 1000, 0.032);
      s.lastFrame = now;

      if (!s.dragging) {
        const qx = s.x - s.pivotX;
        const qy = s.y - s.pivotY;
        const speedSquared = s.vx * s.vx + s.vy * s.vy + s.vz * s.vz;
        const tension = -(GRAVITY * qy + speedSquared) / (s.length * s.length);
        const ax = tension * qx - DAMPING * s.vx;
        const ay = GRAVITY + tension * qy - DAMPING * s.vy;
        const az = tension * s.z - DAMPING * s.vz;
        s.vx += ax * dt;
        s.vy += ay * dt;
        s.vz += az * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.z += s.vz * dt;

        // Keep the thread inextensible: project onto its fixed-length sphere
        // and remove all velocity that would pull the badge radially inward/outward.
        let qxNext = s.x - s.pivotX;
        let qyNext = s.y - s.pivotY;
        const radius = Math.hypot(qxNext, qyNext, s.z) || s.length;
        const scale = s.length / radius;
        qxNext *= scale;
        qyNext *= scale;
        s.z *= scale;
        s.x = s.pivotX + qxNext;
        s.y = s.pivotY + qyNext;
        const radialVelocity = (qxNext * s.vx + qyNext * s.vy + s.z * s.vz) / (s.length * s.length);
        s.vx -= qxNext * radialVelocity;
        s.vy -= qyNext * radialVelocity;
        s.vz -= s.z * radialVelocity;
      }

      draw();
      const settled =
        Math.abs(s.x - s.homeX) < 0.35 &&
        Math.abs(s.y - s.homeY) < 0.35 &&
        Math.abs(s.z) < 0.35 &&
        Math.hypot(s.vx, s.vy, s.vz) < 0.8;
      if (!s.dragging && settled) {
        snapHome();
        s.raf = 0;
        s.lastFrame = 0;
        return;
      }
      s.raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!s.raf) {
        s.lastFrame = 0;
        s.raf = requestAnimationFrame(tick);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      root.setPointerCapture(event.pointerId);
      const rect = hero.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      s.dragging = true;
      s.grabX = s.x - px;
      s.grabY = s.y - py;
      s.lastX = s.x;
      s.lastY = s.y;
      s.lastZ = s.z;
      s.lastPointerTime = event.timeStamp;
      s.vx = 0;
      s.vy = 0;
      s.vz = 0;
      wake();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!s.dragging || !root.hasPointerCapture(event.pointerId)) return;
      const rect = hero.getBoundingClientRect();
      const minX = card.offsetWidth * 0.52;
      const maxX = rect.width - minX;
      const minY = s.slotOffset + 12;
      const maxY = rect.height - card.offsetHeight + s.slotOffset - 12;
      let qx = clamp(event.clientX - rect.left + s.grabX, minX, maxX) - s.pivotX;
      let qy = clamp(event.clientY - rect.top + s.grabY, minY, maxY) - s.pivotY;
      const screenRadius = Math.hypot(qx, qy);
      if (screenRadius > s.length) {
        const scale = s.length / screenRadius;
        qx *= scale;
        qy *= scale;
      }
      const z = Math.sqrt(Math.max(0, s.length * s.length - qx * qx - qy * qy));
      const x = s.pivotX + qx;
      const y = s.pivotY + qy;
      const dt = Math.max((event.timeStamp - s.lastPointerTime) / 1000, 0.008);
      s.vx = clamp((x - s.lastX) / dt, -MAX_POINTER_SPEED, MAX_POINTER_SPEED);
      s.vy = clamp((y - s.lastY) / dt, -MAX_POINTER_SPEED, MAX_POINTER_SPEED);
      s.vz = clamp((z - s.lastZ) / dt, -MAX_POINTER_SPEED, MAX_POINTER_SPEED);
      const radialVelocity = (qx * s.vx + qy * s.vy + z * s.vz) / (s.length * s.length);
      s.vx -= qx * radialVelocity;
      s.vy -= qy * radialVelocity;
      s.vz -= z * radialVelocity;
      s.x = x;
      s.y = y;
      s.z = z;
      s.lastX = x;
      s.lastY = y;
      s.lastZ = z;
      s.lastPointerTime = event.timeStamp;
      draw();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!s.dragging) return;
      if (root.hasPointerCapture(event.pointerId)) root.releasePointerCapture(event.pointerId);
      s.dragging = false;
      wake();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const impulse = 280;
      if (event.key === "ArrowLeft") s.vx -= impulse;
      else if (event.key === "ArrowRight") s.vx += impulse;
      else if (event.key === "ArrowUp") s.vy -= impulse;
      else if (event.key === "ArrowDown") s.vy += impulse;
      else return;
      event.preventDefault();
      s.vx = clamp(s.vx, -MAX_POINTER_SPEED, MAX_POINTER_SPEED);
      s.vy = clamp(s.vy, -MAX_POINTER_SPEED, MAX_POINTER_SPEED);
      const qx = s.x - s.pivotX;
      const qy = s.y - s.pivotY;
      const radialVelocity = (qx * s.vx + qy * s.vy + s.z * s.vz) / (s.length * s.length);
      s.vx -= qx * radialVelocity;
      s.vy -= qy * radialVelocity;
      s.vz -= s.z * radialVelocity;
      wake();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (s.raf) cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.lastFrame = 0;
        if (!s.dragging) snapHome();
      }
    };

    measure();
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", onVisibilityChange);
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
      root.removeEventListener("keydown", onKeyDown);
    };
    // DOM refs are stable; simulation state lives in a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <svg ref={svgRef} aria-hidden className="badge-straps">
        <defs>
          <linearGradient id="lanyard-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#96999a" />
            <stop offset="0.3" stopColor="#f4f4f4" />
            <stop offset="0.58" stopColor="#c4c6c7" />
            <stop offset="1" stopColor="#727576" />
          </linearGradient>
          <linearGradient id="lanyard-metal-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f4f4f4" />
            <stop offset="0.5" stopColor="#bfc1c2" />
            <stop offset="1" stopColor="#777a7b" />
          </linearGradient>
        </defs>
        <path ref={leftStrapRef} className="badge-strap" stroke="#292b2a" fill="none" strokeLinecap="butt" />
        <path ref={rightStrapRef} className="badge-strap" stroke="#292b2a" fill="none" strokeLinecap="butt" />
        <g ref={assemblyRef} className="badge-clip-shadow">
          <path d="M 0 -3 L 0 12" stroke="#292b2a" strokeWidth="9" />
          <path d="M 0 -3 L 0 12" stroke="#474a48" strokeWidth="1.2" />
          <rect x="-7" y="-6" width="14" height="13" rx="2" fill="#303231" stroke="#626563" strokeWidth="0.8" />
          <path d="M -5.25 7 L -5.25 15 Q -5.25 20 0 20 Q 5.25 20 5.25 15 L 5.25 7" fill="none" stroke="#a4a8a9" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M -5.25 7 L -5.25 15 Q -5.25 20 0 20 Q 5.25 20 5.25 15 L 5.25 7" fill="none" stroke="url(#lanyard-metal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path ref={pinRef} fill="none" stroke="#a4a8a9" strokeWidth="3.6" strokeLinecap="round" />
          <path ref={pinHighlightRef} fill="none" stroke="url(#lanyard-metal)" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      </svg>

      <div
        ref={rootRef}
        role="img"
        aria-label="Hanging ID badge reading Mahir Malik, AI Engineer. Drag it freely in any direction; release it to swing back. Use the arrow keys to nudge it."
        tabIndex={0}
        className="badge-root"
      >
        <div ref={swingRef} className="badge-swing">
          <div ref={cardRef} className="badge-card">
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
