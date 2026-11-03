import { personEmail } from "@/lib/site";

interface AboutSectionProps {
  standalone?: boolean;
}

export function AboutSection({ standalone = false }: AboutSectionProps) {
  const Heading = standalone ? "h1" : "h2";

  return (
    <section id="about" className="about-profile" aria-labelledby="about-title">
      <div className="about-profile-inner">
        <div className="about-profile-lead">
          <Heading id="about-title" className="about-profile-title">
            <strong>I’m Mahir.</strong><br />I build software.
          </Heading>
          <p className="about-profile-contact">
            Reach me by <a href={`mailto:${personEmail}`}>email</a>, or find me on{" "}
            <a href="https://x.com/mahirmllk" target="_blank" rel="noreferrer">X</a> or{" "}
            <a href="https://www.linkedin.com/in/mahir-malik" target="_blank" rel="noreferrer">LinkedIn</a>.
          </p>
        </div>

        <div className="about-profile-copy">
          <p>
            I’m an <strong>AI engineer</strong>. I build <strong>AI agents, agentic systems, and automations</strong> that take care of real tasks. I do <strong>applied AI</strong> work too, adding <strong>language models</strong> to apps and software and making them work with the rest of the system.
          </p>
          <p>
            I <strong>train machine learning models</strong> and build the systems around them. I also work on <strong>fine-tuning, deep learning, and reinforcement learning</strong>. I like taking a model from an experiment to something that runs as part of a product.
          </p>
          <p>
            I build <strong>full-stack web apps with AI features</strong>, as well as apps in <strong>Rust</strong>. I work across the software stack, from the frontend and backend to APIs and databases. I also deploy and run my apps in the <strong>cloud, on virtual machines, and in Kubernetes clusters</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
