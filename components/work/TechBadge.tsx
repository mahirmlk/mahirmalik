import type { ReactNode } from "react";

const TECH_ICONS: Record<string, { light: string; dark: string }> = {
  Python: {
    light: "/assets/icons/si-python-3776AB.svg",
    dark: "/assets/icons/si-python-3776AB.svg"
  },
  FastAPI: {
    light: "/assets/icons/si-fastapi-009688.svg",
    dark: "/assets/icons/si-fastapi-009688.svg"
  },
  "Next.js 16": {
    light: "/assets/icons/si-nextdotjs-111111.svg",
    dark: "/assets/icons/si-nextdotjs-f6f7f8.svg"
  },
  "Next.js 15": {
    light: "/assets/icons/si-nextdotjs-111111.svg",
    dark: "/assets/icons/si-nextdotjs-f6f7f8.svg"
  },
  Supabase: {
    light: "/assets/icons/si-supabase-3FCF8E.svg",
    dark: "/assets/icons/si-supabase-3FCF8E.svg"
  },
  Razorpay: {
    light: "/assets/icons/si-razorpay-111111.svg",
    dark: "/assets/icons/si-razorpay-f6f7f8.svg"
  },
  "scikit-learn": {
    light: "/assets/icons/si-scikit-learn-F7931E.svg",
    dark: "/assets/icons/si-scikit-learn-F7931E.svg"
  },
  TypeScript: {
    light: "/assets/icons/si-typescript-3178C6.svg",
    dark: "/assets/icons/si-typescript-3178C6.svg"
  },
  Redis: {
    light: "/assets/icons/si-redis-DC382D.svg",
    dark: "/assets/icons/si-redis-DC382D.svg"
  },
  Docker: {
    light: "/assets/icons/si-docker-2496ED.svg",
    dark: "/assets/icons/si-docker-2496ED.svg"
  }
};

interface TechBadgeProps {
  children: ReactNode;
}

export function TechBadge({ children }: TechBadgeProps) {
  const icon = typeof children === "string" ? TECH_ICONS[children] : undefined;

  return (
    <span className="glass-chip mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
      {icon ? (
        <>
          <img
            src={icon.light}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-3.5 w-3.5 object-contain dark:hidden"
          />
          <img
            src={icon.dark}
            alt=""
            aria-hidden
            loading="lazy"
            className="hidden h-3.5 w-3.5 object-contain dark:block"
          />
        </>
      ) : null}
      {children}
    </span>
  );
}
