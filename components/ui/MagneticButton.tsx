"use client";

import type { PointerEventHandler, ReactNode } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline";
  external?: boolean;
}

export function MagneticButton({
  href,
  children,
  className,
  variant = "primary",
  external = false
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.3 });

  const handlePointerMove: PointerEventHandler<HTMLAnchorElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.18);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.18);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(
          "mono inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs tracking-[0.18em] uppercase transition duration-200",
          variant === "primary"
            ? "border-transparent bg-[var(--btn-bg)] text-[var(--btn-fg)] shadow-[0_16px_38px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:opacity-90"
            : "glass-button text-[var(--fg)] hover:-translate-y-0.5",
          className
        )}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </Link>
    </motion.div>
  );
}
