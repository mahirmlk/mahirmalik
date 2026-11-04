import { WeightSpaceScoreChart } from "@/components/writing/WeightSpaceScoreChart";

function ProcessDiagram() {
  const steps = [
    { x: 14, title: "Goal", lines: ["Improve Qwen", "at math"] },
    { x: 168, title: "Astra", lines: ["plans and writes", "Python code"] },
    { x: 322, title: "Research tools", lines: ["inspect weights", "test on practice"] },
    { x: 476, title: "Weight edit", lines: ["change selected", "matrix columns"] },
    { x: 630, title: "Held-back tests", lines: ["measure answers", "after the edit"] },
  ];

  return (
    <div className="w-diagram-scroll">
      <svg
        className="dg-svg wsp-process-svg"
        viewBox="0 0 780 174"
        role="img"
        aria-label="Astra turns a plain-language goal into Python analysis, tests possible edits on practice questions, changes selected model weights, and the researchers then measure held-back benchmarks."
      >
        {steps.map((step, index) => (
          <g key={step.title}>
            <rect x={step.x} y="40" width="136" height="72" rx="2" className={index === 3 ? "wsp-node wsp-node-active" : "wsp-node"} />
            <text x={step.x + 68} y="68" textAnchor="middle" className="dg-title">{step.title}</text>
            {step.lines.map((line, lineIndex) => (
              <text key={line} x={step.x + 68} y={85 + lineIndex * 14} textAnchor="middle" className="dg-note">{line}</text>
            ))}
            {index < steps.length - 1 && (
              <g className="dg-line">
                <line x1={step.x + 136} y1="76" x2={steps[index + 1].x - 8} y2="76" />
                <polygon points={`${steps[index + 1].x - 8},72 ${steps[index + 1].x - 8},80 ${steps[index + 1].x},76`} className="dg-head" />
              </g>
            )}
          </g>
        ))}
        <path d="M 390 118 C 390 151, 236 151, 236 118" className="wsp-feedback" />
        <polygon points="232,121 240,121 236,114" className="wsp-feedback-head" />
        <text x="313" y="166" textAnchor="middle" className="dg-note">Practice results go back to Astra. The final test questions stay hidden.</text>
      </svg>
    </div>
  );
}

function LayerEditDiagram() {
  const layers = Array.from({ length: 24 }, (_, index) => index);
  const left = 20;
  const gap = 10;
  const width = 24;

  return (
    <div className="w-diagram-scroll">
      <svg
        className="dg-svg wsp-layer-svg"
        viewBox="0 0 660 236"
        role="img"
        aria-label="Qwen has 24 language model layers. Astra's final edit touched the MLP output matrices in layers 15 and 19, selecting 64 of 3,584 columns in each."
      >
        <text x="20" y="22" className="dg-title">Qwen3.5-0.8B language model: 24 layers</text>
        {layers.map((layer) => {
          const row = layer < 12 ? 0 : 1;
          const column = layer % 12;
          const x = left + column * (width + gap);
          const y = 38 + row * 40;
          const active = layer === 15 || layer === 19;
          return (
            <g key={layer}>
              <rect x={x} y={y} width={width} height="26" rx="2" className={active ? "wsp-layer-active" : "wsp-layer"} />
              <text x={x + width / 2} y={y + 17} textAnchor="middle" className={active ? "wsp-layer-number wsp-layer-number-active" : "wsp-layer-number"}>{layer}</text>
            </g>
          );
        })}
        <path d="M 134 108 L 226 135" className="wsp-callout" />
        <path d="M 270 108 L 434 135" className="wsp-callout" />
        <rect x="26" y="138" width="608" height="62" rx="2" className="wsp-matrix" />
        <text x="330" y="160" textAnchor="middle" className="dg-title">Two MLP output matrices edited</text>
        <text x="330" y="181" textAnchor="middle" className="dg-note">Layers 15 and 19 · 64 of 3,584 columns in each</text>
        <text x="330" y="222" textAnchor="middle" className="dg-note">Each selected column has 1,024 values. Schematic, not to scale.</text>
      </svg>
    </div>
  );
}

export const WEIGHT_SPACE_DIAGRAMS: Record<string, { caption: string; Component: () => React.JSX.Element }> = {
  "wsp-process": {
    caption: "The Qwen edit used a Python research harness and practice runs. Astra did not see the held-back benchmark questions.",
    Component: ProcessDiagram,
  },
  "wsp-layers": {
    caption: "The final edit changed the MLP output matrices in layers 15 and 19. The layer diagram is schematic.",
    Component: LayerEditDiagram,
  },
  "wsp-results": {
    caption: "Authors’ reported scores. Select a measure to compare the base model with edits made after 10, 25, and 50 practice forward passes.",
    Component: WeightSpaceScoreChart,
  },
};
