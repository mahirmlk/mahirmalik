"use client";

import { useState } from "react";

const metrics = [
  {
    id: "math500",
    label: "MATH-500",
    description: "Math benchmark accuracy. Higher is better.",
    values: [7.9, 12.3, 14.1, 48.1],
  },
  {
    id: "gsm8k",
    label: "GSM8K",
    description: "Grade-school math benchmark accuracy. Higher is better.",
    values: [13.8, 25.7, 25.1, 67.1],
  },
  {
    id: "ifeval",
    label: "IFEval",
    description: "Instruction-following accuracy. Higher is better.",
    values: [21, 49, 39.9, 62.3],
  },
  {
    id: "cutoff",
    label: "Hit token limit",
    description: "Share of MATH-500 answers cut off at 32,768 tokens. Lower is better.",
    values: [93, 87.2, 86.4, 33.1],
  },
] as const;

const runNames = ["Base", "10 passes", "25 passes", "50 passes"] as const;

export function WeightSpaceScoreChart() {
  const [selectedId, setSelectedId] = useState<(typeof metrics)[number]["id"]>("math500");
  const selected = metrics.find((metric) => metric.id === selectedId) ?? metrics[0];
  const spokenValues = runNames
    .map((run, index) => `${run}: ${selected.values[index]} percent`)
    .join(". ");

  return (
    <section className="wsp-chart" aria-labelledby="wsp-chart-title">
      <div className="wsp-chart-heading">
        <h3 id="wsp-chart-title">Compare the reported results</h3>
        <p>{selected.description}</p>
      </div>

      <div className="wsp-chart-controls" role="group" aria-label="Choose a benchmark">
        {metrics.map((metric) => (
          <button
            key={metric.id}
            type="button"
            aria-pressed={selected.id === metric.id}
            onClick={() => setSelectedId(metric.id)}
          >
            {metric.label}
          </button>
        ))}
      </div>

      <div
        className="wsp-chart-rows"
        role="img"
        aria-label={`${selected.label}. ${spokenValues}`}
      >
        {runNames.map((run, index) => {
          const value = selected.values[index];
          return (
            <div className="wsp-chart-row" key={run}>
              <span className="wsp-chart-run">{run}</span>
              <span className="wsp-chart-track" aria-hidden="true">
                <span
                  className={index === 0 ? "wsp-chart-bar wsp-chart-bar-base" : "wsp-chart-bar"}
                  style={{ width: `${value}%` }}
                />
              </span>
              <strong>{value}%</strong>
            </div>
          );
        })}
      </div>

      <p className="wsp-chart-footnote" aria-live="polite">
        {selected.label}: {spokenValues}. {selected.description}
      </p>
    </section>
  );
}
