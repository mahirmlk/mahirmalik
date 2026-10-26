"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, type ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const lenis = lenisRef.current?.lenis;
    const updateScrollTrigger = () => ScrollTrigger.update();
    const refreshScrollTriggers = () => {
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    lenis?.on("scroll", updateScrollTrigger);
    window.addEventListener("hashchange", refreshScrollTriggers);
    window.addEventListener("scrollend", refreshScrollTriggers);

    return () => {
      lenis?.off("scroll", updateScrollTrigger);
      window.removeEventListener("hashchange", refreshScrollTriggers);
      window.removeEventListener("scrollend", refreshScrollTriggers);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{ autoRaf: false, anchors: true, respectReducedMotion: true }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  );
}
