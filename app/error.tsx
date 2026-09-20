"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Render-side logging only: server errors are already logged by Next.
  // This surfaces client-side render errors (and the digest to correlate
  // with server logs) in the browser console and the ingestible console.
  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <section className="site-container section-block flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="section-eyebrow">Something went wrong</p>
      <h1 className="section-title mt-4">An unexpected error occurred.</h1>
      <p className="section-copy mt-5 max-w-[40rem]">
        The page failed to render. Try again, or head back to the homepage.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center rounded-full border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--fg)] transition hover:bg-[var(--bg-card)]"
      >
        Try again
      </button>
    </section>
  );
}
