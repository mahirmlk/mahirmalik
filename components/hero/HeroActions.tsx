"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export function HeroActions() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = form.subject || "Portfolio inquiry";
    const body = [
      `Name: ${form.name || "-"}`,
      `Email: ${form.email || "-"}`,
      "",
      form.message || ""
    ].join("\n");

    window.location.href =
      `mailto:mahir@email.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setOpen(false);
  };

  return (
    <>
      <div className="hero-actions mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex w-full items-center justify-between gap-3 rounded-none bg-[var(--fg)] px-6 py-4 text-[0.9rem] font-semibold text-[var(--bg)] transition hover:opacity-85 sm:w-auto sm:justify-center sm:px-8"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.985 }}
        >
          <span>Start a conversation</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </motion.button>

        <Link
          href="/#projects"
          className="glass-transparent inline-flex w-full items-center justify-between gap-3 rounded-none px-6 py-4 text-[0.9rem] font-semibold text-[var(--fg)] transition sm:w-auto sm:justify-center sm:px-8"
        >
          <span>Explore work</span>
          <ArrowRight size={18} strokeWidth={1.8} />
        </Link>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[80] overflow-y-auto bg-black/38 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="mx-auto my-auto w-full max-w-[32rem] rounded-[1.1rem] border border-[var(--border-mid)] bg-[color-mix(in_srgb,var(--bg-card)_92%,transparent)] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl backdrop-saturate-150 max-md:backdrop-blur-lg sm:rounded-[1.35rem] sm:p-6"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="max-h-[min(86vh,44rem)] overflow-y-auto overscroll-contain pr-1 max-md:max-h-[min(86svh,44rem)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[1.35rem] font-black leading-none tracking-[-0.05em] text-[var(--fg)] sm:text-[1.75rem]">
                    Send a Message
                  </h3>
                  <p className="mt-3 text-[0.98rem] text-[var(--fg-subtle)] sm:text-[1rem]">
                    I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] p-2 text-[var(--fg)] transition hover:opacity-70"
                  aria-label="Close conversation modal"
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              </div>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-base font-semibold text-[var(--fg)]">Name</span>
                    <input
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Your Name"
                      className="w-full rounded-[0.9rem] border border-[var(--border-mid)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-3 text-base text-[var(--fg)] outline-none transition placeholder:text-[var(--fg-subtle)] focus:border-[var(--fg)]"
                    />
                    <span className="mt-2 block text-sm text-[var(--fg-subtle)]">Please enter your full name.</span>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-base font-semibold text-[var(--fg)]">Email</span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      placeholder="email@example.com"
                      className="w-full rounded-[0.9rem] border border-[var(--border-mid)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-3 text-base text-[var(--fg)] outline-none transition placeholder:text-[var(--fg-subtle)] focus:border-[var(--fg)]"
                    />
                    <span className="mt-2 block text-sm text-[var(--fg-subtle)]">I&apos;ll use this email to contact you.</span>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-base font-semibold text-[var(--fg)]">Subject</span>
                  <input
                    value={form.subject}
                    onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                    placeholder="Subject"
                    className="w-full rounded-[0.9rem] border border-[var(--border-mid)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-3 text-base text-[var(--fg)] outline-none transition placeholder:text-[var(--fg-subtle)] focus:border-[var(--fg)]"
                  />
                  <span className="mt-2 block text-sm text-[var(--fg-subtle)]">Please enter a subject.</span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-base font-semibold text-[var(--fg)]">Message</span>
                  <textarea
                    value={form.message}
                    onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                    placeholder="Your message..."
                    rows={5}
                    className="w-full resize-none rounded-[0.9rem] border border-[var(--border-mid)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] px-4 py-3 text-base text-[var(--fg)] outline-none transition placeholder:text-[var(--fg-subtle)] focus:border-[var(--fg)]"
                  />
                  <span className="mt-2 block text-sm text-[var(--fg-subtle)]">Please enter your message.</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-3 rounded-[0.8rem] bg-[var(--cta-bg)] px-6 py-3 text-base font-semibold text-[var(--cta-fg)] transition hover:bg-[var(--cta-hover)]"
                >
                  <span>Send it!</span>
                  <ArrowRight size={18} strokeWidth={1.8} />
                </button>
              </form>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
