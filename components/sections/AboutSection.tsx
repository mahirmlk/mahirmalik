import type { SVGProps } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

interface AboutSectionProps {
  standalone?: boolean;
}

type IconProps = SVGProps<SVGSVGElement>;

function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.24l-4.89-7.4L5.6 22H2.5l7.23-8.26L2.1 2h6.4l4.42 6.83L18.9 2Zm-1.09 18h1.72L7.57 3.9H5.73Z" />
    </svg>
  );
}

function EmailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3.75 6.75h16.5v10.5H3.75z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4.5 7.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AboutSection({ standalone = false }: AboutSectionProps) {
  return (
    <section id="about" className="site-container section-block">
      <Reveal>
        <p className="section-eyebrow">{standalone ? "Profile" : "About"}</p>
        {standalone ? (
          <h1 className="section-title" style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)" }}>
            i like making complicated stuff feel simple.
          </h1>
        ) : (
          <h2 className="section-title" style={{ fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)" }}>
            i like making complicated stuff feel simple.
          </h2>
        )}
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-7 max-w-[76rem] lg:mt-8">
          <p className="font-schoolbell max-w-[70rem] text-[1.02rem] leading-8 text-[var(--fg-muted)] sm:text-[1.1rem] sm:leading-9">
            i&apos;d rather understand how things work by building them. i
            spend my time with ml, large language models, ai agents, and
            full-stack software, turning ideas into working systems and
            learning a lot from everything that inevitably breaks along the
            way. lately, i&apos;ve been really into agentic systems and
            figuring out how software can become more capable, useful, and a
            little more autonomous.
          </p>
          <Image
            src="/assets/about-illustration.png"
            alt="minimal line illustration of a person working at a desk by a bright window"
            width={1672}
            height={592}
            sizes="(max-width: 768px) 100vw, 62rem"
            className="mt-1 block h-auto w-full max-w-[62rem] object-cover"
            priority={false}
          />
          <p className="font-schoolbell mt-1 max-w-[70rem] text-[1.02rem] leading-8 text-[var(--fg-muted)] sm:text-[1.1rem] sm:leading-9">
            got something on your mind? dm me on{" "}
            <a
              href="https://x.com/mahirmllk"
              target="_blank"
              rel="noreferrer"
              aria-label="dm me on x"
              className="mx-0.5 inline-flex items-center justify-center rounded-full border border-[var(--border-mid)] p-1.5 align-[-3px] text-[var(--fg-muted)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
            >
              <XIcon className="h-3.5 w-3.5 shrink-0" />
            </a>{" "}
            or drop me an{" "}
            <a
              href="mailto:mahirmalikx@gmail.com"
              aria-label="drop me an email"
              className="mx-0.5 inline-flex items-center justify-center rounded-full border border-[var(--border-mid)] p-1.5 align-[-3px] text-[var(--fg-muted)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
            >
              <EmailIcon className="h-3.5 w-3.5 shrink-0" />
            </a>
            .
          </p>
        </div>
      </Reveal>
    </section>
  );
}
