import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Deliberately a server component: it only forwards layout classes and a
// transition delay. No client JS, no hydration — the animation was removed
// when the visual language went static, so the boundary went with it.
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={cn(
        "opacity-100",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
