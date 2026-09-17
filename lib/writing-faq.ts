import type { FaqItem } from "@/lib/schema";

/**
 * Visible FAQs per writing post. Rendered on-page by `ArticleFaq` and
 * mirrored 1:1 into `FAQPage` JSON-LD — schema never claims Q&A that
 * isn't visible. Answers are kept self-contained (40–60 words) so they
 * double as featured-snippet / AI-Overview candidates.
 */
export const writingFaqs: Record<string, FaqItem[]> = {
  "context-vs-loop-vs-harness-engineering": [
    {
      question: "What is the difference between context, harness, and loop engineering?",
      answer:
        "Context engineering decides what the agent knows. Harness engineering decides what the agent can do and under what rules. Loop engineering decides what happens next, how the agent keeps going, and when it stops. Together they form the system around the model that turns a chatbot into an agent system.",
    },
    {
      question: "How should I structure a production-style agent system?",
      answer:
        "Define agent state first, then build the context layer, give the model a small permissioned toolset, add an evaluator, build the loop with progress detection and checkpoints, persist progress outside the model, and finish with a review pass before anything ships.",
    },
    {
      question: "How do I debug a failing agent system?",
      answer:
        "Ask four questions in order: did it know the right thing, could it do the right thing, did it keep going intelligently, and did we know whether it succeeded? Each question isolates one layer — context, harness, loop, or evaluation — so you fix the right one.",
    },
  ],
  "i-made-a-visualization-tool-for-ml-algorithms": [
    {
      question: "What is Confluence?",
      answer:
        "Confluence is a playground for learning ML by watching it run: 38 real scikit-learn algorithms, decision boundaries you can poke at, training you can scrub through frame by frame, 25 datasets, and auto-generated Python code for every experiment.",
    },
    {
      question: "Does Confluence reimplement ML algorithms in JavaScript?",
      answer:
        "No. Every algorithm is real scikit-learn doing the compute on a FastAPI backend, so the numbers on screen are sklearn's numbers. Each experiment also hands you the Python code to reproduce it, so nothing you learn depends on the website staying up.",
    },
    {
      question: "What is the fastest way to build intuition with Confluence?",
      answer:
        "Open k-NN on the spiral dataset and drag k from 1 to 50. Chaos settles into calm in about thirty seconds, and bias and variance click in a way textbook chapters never manage.",
    },
  ],
};

export function getWritingFaqs(slug: string): FaqItem[] {
  return writingFaqs[slug] ?? [];
}
