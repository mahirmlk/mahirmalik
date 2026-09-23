import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const lines = [
  {
    label: "Building",
    text: "AI systems, agent workflows, and software that does more than sit there waiting for a button.",
  },
  {
    label: "Learning",
    text: "LLMs, agent harnesses, retrieval, model tooling, and the engineering around making these systems actually useful.",
  },
  {
    label: "Looking for",
    text: "Machine Learning and AI engineering roles, internships, and people working on interesting problems.",
  },
];

export function SnapshotSection() {
  return (
    <section
      id="pulse"
      className="section-block bg-[#0a0a0c]"
      style={{ paddingBlock: "clamp(4.5rem, 9vw, 7.5rem)" }}
    >
      <div className="site-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="section-eyebrow" style={{ color: "rgba(255,255,255,0.55)" }}>
              At the Moment
            </p>
            <h2 className="section-title section-title-sm max-w-3xl text-balance text-white">
              Currently in the weeds.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-8 text-white/75 sm:text-base">
              Building things, pulling threads, and figuring out why they broke in the first
              place.
            </p>

            <div className="mt-9 space-y-6">
              {lines.map((line) => (
                <div key={line.label} className="flex gap-4 sm:gap-5">
                  <p className="mono w-24 shrink-0 pt-1 text-[11px] uppercase tracking-[0.18em] text-white sm:w-28">
                    {line.label}
                  </p>
                  <p className="min-w-0 max-w-xl text-sm leading-7 text-white/75 sm:text-[15px]">
                    {line.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="mailto:mahirmalikx@gmail.com"
                className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(255,255,255,0.35)]"
              >
                Say Hello <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:mx-0 lg:ml-auto lg:max-w-[440px]">
              <Image
                src="/assets/moment-illustration.png"
                alt="Illustration of current work in progress"
                width={800}
                height={1067}
                sizes="(max-width: 1024px) 80vw, 440px"
                className="h-auto w-full select-none object-contain drop-shadow-[0_24px_60px_rgba(255,255,255,0.14)]"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
