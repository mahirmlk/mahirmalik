"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DescentMap,
  EmbeddingOrbit,
  AgentLoop,
  MatrixField,
  NeuralMap,
  SignalCurve,
} from "@/components/sections/AboutArtwork";

const milestones = [
  {
    title: "i learn by building.",
    detail: "A working version teaches me more than a perfect plan ever could.",
    position: "above",
  },
  {
    title: "ideas become systems.",
    detail: "ML, language models, and full-stack software are how I make them real.",
    position: "below",
  },
  {
    title: "the rough edges count.",
    detail: "When something breaks, I get a closer look at how it really works.",
    position: "above",
  },
  {
    title: "lately, it’s agents.",
    detail: "I’m exploring software that can use tools and take on more on its own.",
    position: "below",
  },
  {
    title: "make it useful.",
    detail: "The best systems turn complexity into something people can work with.",
    position: "above",
  },
] as const;

function makeTimelinePath(progress: number) {
  const nodes = [605, 1050, 1495, 1941, 2386];
  const phase = progress * Math.PI * 5;
  const amplitude = 38 + 12 * Math.sin(phase * 0.4);
  const points: Array<[number, number]> = [[0, 96]];

  nodes.forEach((x, index) => {
    const previousX = points[points.length - 1][0];
    const midpoint = (previousX + x) / 2;
    points.push([midpoint, 96 + amplitude * Math.sin(index * 1.65 + phase)]);
    points.push([x, 96]);
  });
  points.push([2890, 292 + 14 * Math.sin(5 * 1.65 + phase)]);
  points.push([3400, 292]);

  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point[0]} ${point[1]}`;
    const previous = points[index - 1];
    const beforePrevious = points[Math.max(0, index - 2)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const spanX = point[0] - previous[0];
    const control1: [number, number] = [
      previous[0] + spanX / 3,
      previous[1] + ((point[1] - beforePrevious[1]) * spanX) / (6 * (point[0] - beforePrevious[0] || spanX)),
    ];
    const control2: [number, number] = [
      point[0] - spanX / 3,
      point[1] - ((next[1] - previous[1]) * spanX) / (6 * (next[0] - previous[0] || spanX)),
    ];
    return `${path} C${control1[0]} ${control1[1]} ${control2[0]} ${control2[1]} ${point[0]} ${point[1]}`;
  }, "");
}

export function AboutJourney({ standalone = false }: { standalone?: boolean }) {
  const IntroHeading = standalone ? "h1" : "h2";
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollDistance]);
  const timelinePathRef = useRef<SVGPathElement>(null);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    timelinePathRef.current?.setAttribute("d", makeTimelinePath(progress));
  });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(mobile);
    if (mobile) {
      setScrollDistance(0);
      return;
    }
    setScrollDistance(Math.max(0, track.scrollWidth - window.innerWidth));
  }, []);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const sectionHeight = isMobile
    ? "auto"
    : scrollDistance
      ? `calc(100svh + ${scrollDistance}px)`
      : "200svh";

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about-journey${standalone ? " about-journey-standalone" : ""}`}
      style={{ height: sectionHeight }}
      aria-label="About"
    >
      <div className="about-mobile">
        <div className="about-mobile-intro">
          <h2>build it.<br />understand it.</h2>
          <p>i learn best with a working version in front of me.</p>
        </div>
        <div className="about-mobile-art" aria-hidden="true"><NeuralMap /></div>
        <div className="about-mobile-timeline">
          {milestones.map((milestone) => (
            <article className="about-mobile-milestone" key={milestone.title}>
              <span className="about-mobile-dot" aria-hidden="true" />
              <div>
                <h3>{milestone.title}</h3>
                <p>{milestone.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="about-mobile-ending">
          <h2>building AI people can actually use.</h2>
          <p>
            i build AI systems, agents, and automations, and like taking an idea from an early experiment to useful software. want to talk through a project or trade ideas? find me on{" "}
            <a className="about-contact-pill about-contact-x" href="https://x.com/mahirmllk" target="_blank" rel="noreferrer">X (Twitter)<ArrowUpRight aria-hidden="true" /></a>{" "}
            or email me at{" "}
            <a className="about-contact-pill about-contact-email" href="mailto:mahirmalikx@gmail.com">mahirmalikx@gmail.com<ArrowUpRight aria-hidden="true" /></a>.
          </p>
        </div>
      </div>
      <div className="about-journey-sticky">
        <motion.div ref={trackRef} className="about-journey-track" style={{ x }}>
          <header className="about-journey-header">
          </header>

          <div className="about-journey-intro">
            <IntroHeading>build it.<br />understand it.</IntroHeading>
            <span>i learn best with a working version in front of me.</span>
          </div>

          <div className="about-art about-art-orbit"><EmbeddingOrbit /></div>
          <div className="about-art about-art-matrix"><MatrixField /></div>
          <div className="about-art about-art-descent"><DescentMap /></div>
          <div className="about-art about-art-signal"><SignalCurve /></div>
          <div className="about-art about-art-network-lower"><NeuralMap /></div>
          <div className="about-art about-art-loop-lower"><AgentLoop /></div>

          <div className="about-timeline" aria-label="How I approach building software">
            <motion.svg
              className="about-timeline-line"
              viewBox="0 0 3400 180"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path ref={timelinePathRef} d={makeTimelinePath(0)} />
            </motion.svg>

            {milestones.map((milestone, index) => (
              <article
                className={`about-milestone about-milestone-${milestone.position}`}
                style={{ left: `${17.8 + index * 13.1}%` }}
                key={milestone.title}
              >
                <span className="about-milestone-stem" aria-hidden="true" />
                <span className="about-milestone-dot" aria-hidden="true" />
                <div className="about-milestone-copy">
                  <h3>{milestone.title}</h3>
                  <p>{milestone.detail}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="about-journey-ending">
            <h2>building AI people can actually use.</h2>
            <p>
              i build AI systems, agents, and automations, and like taking an idea from an early experiment to useful software. want to talk through a project or trade ideas? find me on{" "}
              <a className="about-contact-pill about-contact-x" href="https://x.com/mahirmllk" target="_blank" rel="noreferrer">
                X (Twitter)<ArrowUpRight aria-hidden="true" />
              </a>{" "}
              or email me at{" "}
              <a className="about-contact-pill about-contact-email" href="mailto:mahirmalikx@gmail.com">
                mahirmalikx@gmail.com<ArrowUpRight aria-hidden="true" />
              </a>.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
