import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for was moved, removed, or never existed.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="site-container section-block flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="section-eyebrow">Error 404</p>
      <h1 className="section-title mt-4">This page doesn&apos;t exist.</h1>
      <p className="section-copy mt-5 max-w-[40rem]">
        The page you are looking for was moved, removed, or never existed in the
        first place.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--bg-card)]"
      >
        Back to home
      </Link>
    </section>
  );
}
