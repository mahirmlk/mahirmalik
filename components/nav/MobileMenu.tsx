"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" }
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="mx-auto max-h-[calc(100svh-5.5rem)] w-[min(1180px,calc(100%-1.5rem))] overflow-y-auto overscroll-contain rounded-b-[1.25rem] border-x border-b border-[var(--nav-line)] bg-[color-mix(in_srgb,var(--nav-shell)_78%,transparent)] px-4 pb-4 pt-3 shadow-[0_26px_70px_rgba(0,0,0,0.18)] backdrop-blur-[20px] backdrop-saturate-[180%] max-md:backdrop-blur-[12px] lg:hidden"
        >
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "mono rounded-2xl border border-transparent px-4 py-3.5 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition",
                  "hover:border-[var(--border-mid)] hover:bg-[var(--nav-pill)] hover:text-[var(--fg)]"
                )}
                onClick={onClose}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--nav-line)] pt-4">
            <Link
              href="/writing"
              className="mono inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-mid)] bg-[var(--nav-pill)] px-4 py-3.5 text-[11px] uppercase tracking-[0.16em] text-[var(--fg)] transition hover:border-[var(--border-hover)]"
              onClick={onClose}
            >
              Explore <ArrowUpRight className="size-3.5" />
            </Link>
            <a
              href="https://github.com/mahirmlk"
              target="_blank"
              rel="noreferrer"
              className="mono inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-mid)] px-4 py-3.5 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
            >
              GitHub <Github className="size-3.5" />
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
