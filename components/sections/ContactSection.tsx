import type { ReactElement, SVGProps } from "react";
import Image from "next/image";

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
    label: "DEV.to",
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
];

type SocialLinkItem = (typeof socials)[number];

function SocialLink({ social }: { social: SocialLinkItem }) {
  const { label, href, render } = social;

  return (
    <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="contact-social-link">
      <span className="contact-social-icon">{render({ className: "h-[18px] w-[18px] shrink-0" })}</span>
      <span className="contact-social-label">{label}</span>
    </a>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="contact-footer">
      <footer className="contact-footer-content site-container">
        <div className="contact-footer-main">
          <div className="contact-footer-intro">
            <p className="section-eyebrow">Find me elsewhere</p>
            <h2>Good work starts with a conversation.</h2>
            <a className="contact-footer-email" href="mailto:mahirmalikx@gmail.com">
              mahirmalikx@gmail.com
            </a>
          </div>
        </div>

        <div className="contact-footer-image">
          <Image
            src="/assets/footer.webp"
            alt=""
            fill
            sizes="100vw"
            className="contact-footer-image-photo"
            loading="lazy"
          />
          <div className="contact-footer-image-shade" />
          <div className="contact-footer-image-content">
            <nav className="contact-socials" aria-label="Social profiles">
              <div className="contact-socials-topline">
                {socials.slice(0, 4).map((social) => <SocialLink key={social.label} social={social} />)}
              </div>
              <div className="contact-socials-flank contact-socials-left">
                {socials.slice(4, 6).map((social) => <SocialLink key={social.label} social={social} />)}
              </div>
              <div className="contact-socials-flank contact-socials-right">
                {socials.slice(6, 8).map((social) => <SocialLink key={social.label} social={social} />)}
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </section>
  );
}
