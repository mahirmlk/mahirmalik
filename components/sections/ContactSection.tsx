import type { ReactElement, SVGProps } from "react";
import { ArrowUp, House } from "lucide-react";
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
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.6 3.5v17h-2.5v-17h2.5Zm2.6 9.1 6.1 7.9h-3.1l-5.4-7 5.9-6.9h3.2l-6.7 6Z" />
    </svg>
  );
}

type IconProps = { className?: string };

const socials: Array<{ label: string; href: string; render: (props: IconProps) => ReactElement }> = [
  {
    label: "GitHub",
    href: "https://github.com/mahirmlk",
    render: (p) => <GitHubIcon {...p} />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mahir-malik",
    render: (p) => <LinkedInIcon {...p} />,
  },
  {
    label: "X",
    href: "https://x.com/mahirmllk",
    render: (p) => <XIcon {...p} />,
  },
  {
    label: "Kaggle",
    href: "https://www.kaggle.com/mahirmlk",
    render: (p) => <KaggleIcon {...p} />,
  },
  {
    label: "Hugging Face",
    href: "https://huggingface.co/mahirmalik",
    render: (p) => (
      <img
        src="/assets/icons/si-huggingface-FFD21E.svg"
        alt=""
        aria-hidden
        loading="lazy"
        {...p}
      />
    ),
  },
  {
    label: "daily.dev",
    href: "https://daily.dev/mahirmalik",
    render: (p) => (
      <>
        <img
          src="/assets/icons/fav-daily.dev.png"
          alt=""
          aria-hidden
          loading="lazy"
          className={`object-contain dark:hidden ${p.className ?? ""}`}
        />
        <img
          src="/assets/icons/fav-daily.dev.png"
          alt=""
          aria-hidden
          loading="lazy"
          className={`hidden object-contain dark:block ${p.className ?? ""}`}
        />
      </>
    ),
  },
  {
    label: "Reddit",
    href: "https://www.reddit.com/user/nightmareofai/",
    render: (p) => (
      <>
        <img
          src="/assets/icons/si-reddit-FF4500.svg"
          alt=""
          aria-hidden
          loading="lazy"
          className={`object-contain dark:hidden ${p.className ?? ""}`}
        />
        <img
          src="/assets/icons/si-reddit-FF4500.svg"
          alt=""
          aria-hidden
          loading="lazy"
          className={`hidden object-contain dark:block ${p.className ?? ""}`}
        />
      </>
    ),
  },
  {
    label: "DEV",
    href: "https://dev.to/mahirmlk",
    render: (p) => (
      <>
        <img
          src="/assets/icons/si-devdotto-111111.svg"
          alt=""
          aria-hidden
          loading="lazy"
          className={`object-contain dark:hidden ${p.className ?? ""}`}
        />
        <img
          src="/assets/icons/si-devdotto-f6f7f8.svg"
          alt=""
          aria-hidden
          loading="lazy"
          className={`hidden object-contain dark:block ${p.className ?? ""}`}
        />
      </>
    ),
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="site-container section-block text-center">
      <Reveal>
        <p className="section-eyebrow">Beyond</p>
        <h2 className="section-title section-title-sm">
          More to build. More to figure out.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-7 text-[var(--fg-muted)] sm:text-base sm:leading-8">
          More systems, deeper work, better agents, and ideas I haven&apos;t figured out yet.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="contact-socials mt-10 flex flex-wrap justify-center gap-3.5">
          {socials.map(({ label, href, render }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              title={label}
              aria-label={label}
              className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-white/50 bg-white/40 text-[var(--fg-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_6px_20px_-8px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:text-[var(--fg)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_12px_28px_-8px_rgba(0,0,0,0.22)] dark:border-white/[0.14] dark:bg-white/[0.07] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_6px_20px_-8px_rgba(0,0,0,0.7)] dark:hover:bg-white/[0.12] dark:hover:text-[var(--fg)]"
            >
              {render({ className: "h-[19px] w-[19px] shrink-0" })}
            </a>
          ))}
        </div>
      </Reveal>

      <Reveal delay={200}>
        <footer className="mt-16 border-t border-[var(--border)] pt-7">
          <div className="flex flex-col items-center gap-5 text-center">
            <a
              href="/"
              aria-label="Go to home"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-mid)] text-[var(--fg-subtle)] transition hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
            >
              <House size={16} strokeWidth={2} />
            </a>

            <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
              <a href="/" className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)] transition hover:text-[var(--fg)]">
                Home
              </a>
              <a href="/work" className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)] transition hover:text-[var(--fg)]">
                Archive
              </a>
              <a href="/writing" className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)] transition hover:text-[var(--fg)]">
                Writing
              </a>
            </nav>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 pb-2">
            <p className="mono text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
              {new Date().getFullYear()} Mahir Malik
            </p>
            <a
              href="#"
              aria-label="Back to top"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-mid)] text-[var(--fg-subtle)] transition hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:text-[var(--fg)]"
            >
              <ArrowUp size={15} strokeWidth={2} />
            </a>
          </div>
        </footer>
      </Reveal>
    </section>
  );
}
