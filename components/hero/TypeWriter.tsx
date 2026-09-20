"use client";

import { useEffect, useState } from "react";

const roles = [
  "AI Engineer",
  "LLM Systems Builder",
  "Machine Learning Architect",
  "Agentic Workflow Developer"
];

export function TypeWriter() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let timeout: number;
    let deleting = false;
    let currentRoleIndex = 0;
    let currentText = "";

    const tick = () => {
      const currentRole = roles[currentRoleIndex];

      if (!deleting) {
        currentText = currentRole.slice(0, currentText.length + 1);
        setDisplay(currentText);
        setRoleIndex(currentRoleIndex);

        if (currentText === currentRole) {
          deleting = true;
          timeout = window.setTimeout(tick, 1400);
          return;
        }

        timeout = window.setTimeout(tick, 75);
        return;
      }

      currentText = currentRole.slice(0, currentText.length - 1);
      setDisplay(currentText);
      setRoleIndex(currentRoleIndex);

      if (currentText.length === 0) {
        deleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        setRoleIndex(currentRoleIndex);
        timeout = window.setTimeout(tick, 180);
        return;
      }

      timeout = window.setTimeout(tick, 40);
    };

    tick();

    return () => window.clearTimeout(timeout);
  }, [reducedMotion]);

  // Reduced motion: static full first role, no typing loop, no caret blink.
  if (reducedMotion) {
    return (
      <span className="mono inline-flex min-h-[1.4em] items-center text-[1.05em] font-extrabold text-[var(--fg)]">
        {roles[0]}
      </span>
    );
  }

  return (
    <span className="mono inline-flex min-h-[1.4em] items-center text-[1.05em] font-extrabold text-[var(--fg)]">
      {display || roles[roleIndex].slice(0, 1)}
      <span className="ml-1 inline-block h-5 w-px animate-pulse bg-[var(--fg)] align-middle" />
    </span>
  );
}
