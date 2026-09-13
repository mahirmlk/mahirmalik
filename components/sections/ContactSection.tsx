import type { SVGProps } from "react";
import { ArrowUpRight, House } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";

type BrandIconProps = SVGProps<SVGSVGElement>;

function GitHubIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.49 1 .11-.78.42-1.31.76-1.61-2.66-.31-5.47-1.33-5.47-5.91 0-1.3.46-2.36 1.22-3.19-.12-.31-.53-1.56.11-3.25 0 0 1-.32 3.3 1.22a11.42 11.42 0 0 1 6 0c2.29-1.54 3.29-1.22 3.29-1.22.65 1.69.24 2.94.12 3.25.76.83 1.22 1.89 1.22 3.19 0 4.59-2.81 5.59-5.49 5.89.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3Zm7 0h3.82v1.64h.05c.53-1.01 1.84-2.08 3.79-2.08C21.14 8.56 22 10.84 22 14.03V21h-4v-6.18c0-1.47-.03-3.36-2.05-3.36-2.05 0-2.37 1.6-2.37 3.25V21h-4Z" />
    </svg>
  );
}

function XIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.24l-4.89-7.4L5.6 22H2.5l7.23-8.26L2.1 2h6.4l4.42 6.83L18.9 2Zm-1.09 18h1.72L7.57 3.9H5.73Z" />
    </svg>
  );
}

function KaggleIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M7 3.5v17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m16.8 6.2-6.9 6 7.1 5.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m11.3 11.2 5.4-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3.75 6.75h16.5v10.5H3.75z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4.5 7.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const socials = [
  { label: "GitHub", href: "https://github.com/mahirmlk", icon: GitHubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mahir-malik", icon: LinkedInIcon },
  { label: "X", href: "https://x.com/mahirmllk", icon: XIcon },
  { label: "Kaggle", href: "https://www.kaggle.com/mahirmlk", icon: KaggleIcon },
  { label: "Email", href: "mailto:mahirmalikx@gmail.com", icon: EmailIcon }
];

export function ContactSection() {
  return (
    <section id="contact" className="site-container section-block text-center">
      <Reveal>
        <p className="section-eyebrow">What's Next?</p>
        <h2 className="section-title">Let's build something together.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-7 text-[var(--fg-muted)] sm:text-base sm:leading-8">
          Actively building ML systems, LLM pipelines, and agentic AI — open to roles,
          internships, and meaningful collaborations.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-8 flex justify-center">
          <MagneticButton href="mailto:mahirmalikx@gmail.com" className="w-full justify-center sm:w-auto">
            Say Hello
          </MagneticButton>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <a
          href="mailto:mahirmalikx@gmail.com"
          className="mono mt-8 inline-block break-all border-b border-dashed border-[var(--border-mid)] pb-1 text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
        >
          mahirmalikx@gmail.com
        </a>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="mono inline-flex min-w-[8.5rem] items-center justify-center gap-2 rounded-md border border-[var(--border-mid)] px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
            >
              <Icon className="h-[14px] w-[14px] shrink-0" />
              {label}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={240}>
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 text-center md:flex-row md:items-center md:text-left">
          <a
            href="/"
            aria-label="Go to home"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-mid)] text-[var(--fg-subtle)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
          >
            <House size={16} strokeWidth={2} />
          </a>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a href="/" className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              Home
            </a>
            <a href="/work" className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              Archive
            </a>
            <a
              href="/writing"
              className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]"
            >
              Writing
            </a>
          </div>
          <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            {new Date().getFullYear()} Mahir Malik
          </p>
        </footer>
      </Reveal>
    </section>
  );
}
