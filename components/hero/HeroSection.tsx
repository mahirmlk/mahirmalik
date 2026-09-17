import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { TypeWriter } from "@/components/hero/TypeWriter";
import { HeroActions } from "@/components/hero/HeroActions";

export function HeroSection() {
  return (
    <section className="site-container min-h-[calc(100svh-4.5rem)] py-12 md:min-h-[calc(100svh-4rem)] md:py-16 md:flex md:flex-col md:justify-center">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-6">
        <div className="max-w-4xl">
          <Reveal delay={80}>
            <h1
              className="whitespace-nowrap text-[clamp(2.9rem,16vw,4.9rem)] font-black leading-[0.92] tracking-[-0.07em] text-[var(--fg)] max-md:whitespace-normal max-md:text-[clamp(2.6rem,13vw,4rem)] max-md:leading-[0.95] md:text-[clamp(3.1rem,8vw,6rem)] md:leading-[0.9]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Mahir Malik
              <span className="text-[var(--fg-muted)]">.</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-5 text-[1.08rem] text-[var(--fg)] sm:text-[1.2rem] md:mt-6 md:text-2xl">
              <TypeWriter />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p
              className="mt-5 text-[clamp(1.2rem,7vw,1.72rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--fg-muted)] md:mt-6 md:text-[clamp(1.5rem,3.5vw,2.2rem)] md:leading-[1.3]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
            making ai do more than just{" "}
            <strong className="font-semibold italic text-[var(--fg)]" style={{ fontFamily: "var(--font-serif)" }}>
              yap.
            </strong>
            </p>
          </Reveal>

          <Reveal delay={280}>
            <p
              className="mt-5 max-w-[34rem] text-[1.2rem] leading-[1.5] tracking-[0.01em] text-[var(--fg-muted)] md:mt-6 md:max-w-2xl md:text-[1.35rem] md:leading-[1.55]"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              I build AI systems, agents, and automations that handle the tedious stuff while I pretend I planned
              it that way.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="apple-glass mono rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                AI Systems
              </span>
              <span className="apple-glass mono rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                Agentic Workflows
              </span>
              <span className="apple-glass mono rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                Automations
              </span>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <HeroActions />
          </Reveal>
        </div>

        <Reveal delay={320} className="relative mx-auto w-full max-w-[260px] sm:max-w-[340px] lg:mx-0 lg:-mt-28 lg:max-w-[400px] lg:justify-self-end">
          <div className="relative">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--bg-elevated)_90%,transparent)_0%,transparent_70%)] blur-2xl"
            />
            <div
              aria-hidden
              className="absolute inset-6 rounded-[3rem] border border-dashed border-[var(--border-strong)] opacity-60 max-sm:inset-4"
            />
            <div className="relative z-10 px-8 py-6 max-sm:px-5 max-sm:py-4">
              <Image
                src="/hero-guy.webp"
                alt="Hand-drawn illustration of Mahir working on a laptop with a coffee on the side"
                width={835}
                height={1296}
                priority
                sizes="(max-width: 1024px) 340px, 400px"
                className="hidden h-auto w-full select-none rounded-[1.5rem] drop-shadow-[0_24px_48px_rgba(0,0,0,0.16)] dark:invert md:block"
              />
              <Image
                src="/hero-guy-mobile.webp"
                alt="Hand-drawn illustration of Mahir working on a laptop with a coffee on the side"
                width={520}
                height={448}
                priority
                sizes="260px"
                className="h-auto w-full select-none drop-shadow-[0_16px_32px_rgba(0,0,0,0.14)] md:hidden"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
