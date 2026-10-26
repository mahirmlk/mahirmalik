import { AboutJourney } from "@/components/sections/AboutJourney";

interface AboutSectionProps {
  standalone?: boolean;
}

export function AboutSection({ standalone = false }: AboutSectionProps) {
  return <AboutJourney standalone={standalone} />;
}
