"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, House, Menu, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MobileMenu } from "@/components/nav/MobileMenu";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setScrolled(window.scrollY > 16);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;

      if (currentScrollY <= 24) {
        setIsVisible(true);
      } else if (scrollingDown) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setScrolled(currentScrollY > 16);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = navLinks
      .filter((link) => link.href.startsWith("/#"))
      .map((link) => link.href.slice(2));

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(`#${visibleEntries[0].target.id}`);
          return;
        }

        const contactSection = document.getElementById("contact");
        if (contactSection) {
          const rect = contactSection.getBoundingClientRect();
          const inViewport = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.2;
          setActiveSection(inViewport ? "#contact" : "");
        }
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));

    const initialHash = window.location.hash;
    if (initialHash && sectionIds.includes(initialHash.slice(1))) {
      setActiveSection(initialHash);
    }

    return () => observer.disconnect();
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      const targetHash = href.slice(1);
      return pathname === "/" && activeSection === targetHash;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-[110%] opacity-0"
      )}
    >
      <div className={cn("nav-shell", scrolled && "nav-shell-scrolled")}>
        <div className="nav-frame">
          <Button variant="ghost" size="icon-sm" asChild className="nav-home-button">
            <Link href="/" aria-label="Go to home">
              <House className="size-4" strokeWidth={1.9} />
            </Link>
          </Button>

          <nav className="nav-links hidden lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  if (link.href.startsWith("/#")) {
                    setActiveSection(link.href.slice(1));
                  }
                }}
                className={cn("nav-link mono", isActiveLink(link.href) && "nav-link-active")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-actions">
            <Button variant="ghost" size="sm" asChild className="nav-search hidden lg:inline-flex">
              <Link href="/writing">
                <Search className="size-4" strokeWidth={1.9} />
                <span>Explore</span>
                <span className="nav-kbd">Ctrl</span>
                <span className="nav-kbd">K</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              asChild
              className="nav-icon-button hidden sm:inline-flex"
            >
              <a
                href="https://github.com/mahirmlk"
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub profile"
              >
                <Github className="size-4" strokeWidth={1.9} />
              </a>
            </Button>

            <span className="nav-divider hidden sm:block" />

            <AnimatedThemeToggler aria-label="Toggle theme" className="nav-icon-button inline-flex" />

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen((current) => !current)}
              className="nav-icon-button lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="size-4" strokeWidth={1.9} />
            </Button>
          </div>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
