"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";

export function HeroAboutTransition() {
  const transitionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const hero = transitionRef.current?.querySelector<HTMLElement>(".hero-stage");
        const about = transitionRef.current?.querySelector<HTMLElement>("#about");
        if (!hero || !about) return;

        const transition = gsap.fromTo(
          about,
          { yPercent: 75 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () => `+=${hero.offsetHeight}`,
              scrub: 0.7,
              pin: hero,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          },
        );

        return () => {
          transition.scrollTrigger?.kill();
          transition.kill();
        };
      });

      return () => media.revert();
    }, transitionRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={transitionRef} className="hero-about-transition">
      <HeroSection />
      <AboutSection />
    </div>
  );
}
