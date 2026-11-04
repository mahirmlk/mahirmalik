---
title: "Weight-Space Programming: How GPT-6 Astra Edited Qwen’s Weights"
shortTitle: "Weight-Space Programming"
description: "A plain-language guide to GPT-6 Astra’s reported Qwen3.5-0.8B weight edit: the Python tools it used, the reasoning loop it targeted, the benchmark results, and the limits of the claim."
date: "2026-11-04"
category: "AI Research"
tldr: "MIT CSAIL researchers report that GPT-6 Astra used Python and up to 50 model runs to remove a repetition-related signal from two Qwen3.5-0.8B MLP layers. The edit touched 131,072 weight positions, and the authors’ MATH-500 score rose from 7.9% to 48.1%. The main gain was that more answers finished instead of looping. This is an early, narrow result, not proof that an LLM can generally train or improve other models."
tags:
  - ai
  - llms
  - machine-learning
  - model-editing
  - interpretability
---

# Weight-Space Programming: How GPT-6 Astra Edited Qwen’s Weights

On November 2, 2026, four MIT CSAIL researchers published a [report about a model changing another model](https://rikiyat.github.io/blog/weight-space-programming/). They asked GPT-6 Astra to make Qwen3.5-0.8B better at math. The authors say Astra changed a tiny part of Qwen’s weights, and the model got far more answers right on several tests.

The headline needs some context. Astra did not read all 800 million numbers in a chat window and magically know the fix. It wrote Python code to inspect and change the weights. It also tested Qwen on practice questions up to 50 times. The researchers did not allow training or gradient descent. They call this approach **weight-space programming**.

This article explains what those words mean, how the edit worked, what improved, and what the experiment still cannot tell us. The original work is an early research report with public logs, not a peer-reviewed paper.

```diagram:wsp-process
```

## First, what is a model’s “weight”?

A language model is a large set of learned numbers. These numbers are called **weights**. They sit inside the model’s layers and shape how it turns one token into the next.

Think of a weight like a dial in a very large machine. One dial by itself usually means little. Together, the dials let the model recognise patterns and produce text. Qwen3.5-0.8B has about 800 million weights in its language model.

During normal training, software changes many weights using examples and an error score. The software calculates a **gradient**, which estimates how each weight should move to lower that error. An optimizer such as Adam applies those updates, often over many rounds.

In this experiment, Astra did not calculate gradients or run an optimizer. Instead, it used Python to inspect tensors, compare model behavior, and write a targeted change into the weight files. The weight change was still carried out by code. “No training” means there was no gradient-based learning loop.

## The problem inside Qwen

Qwen3.5-0.8B can answer math questions, but its [model card](https://huggingface.co/Qwen/Qwen3.5-0.8B) warns that its thinking mode is more prone to loops than larger Qwen3.5 models. A loop can look like a model repeating the same doubt or calculation instead of reaching a final answer. It may use its whole token budget without finishing.

In the researchers’ test setup, they gave Qwen up to 32,768 new tokens to answer each question. On the MATH-500 benchmark, 93% of the base model’s answers hit that limit. The model card recommends tuning sampling settings for the use case and using streaming, when available, to notice and stop unusual generations.

The researchers asked a narrow question: could Astra reduce this failure by editing Qwen’s learned numbers, without training the model?

## What Astra could do

Astra worked through a research-built harness. It had:

- A CPU-only Python notebook with the model’s weight tensors loaded. It had no internet access and no GPU.
- A separate tool that could run Qwen on practice examples or inspect its internal activations. The total budget was 10, 25, or 50 **forward passes**, depending on the run.
- Math problems from the training portions of GSM8K and MATH. These were practice material, not the held-back benchmark questions.
- A way to save selected edits to the model weights.

A forward pass here means running the model to produce an output or inspect internal signals. One pass could cover a batch of up to 512 practice questions. It was a chance to gather evidence, not an update from a gradient.

The harness prohibited gradient descent, backpropagation, optimizers, and fitting weights to a loss. Astra was not allowed to see the final benchmark questions or scores while it worked. The [public experiment logs](https://github.com/RikiyaT/lm_understand-logs/tree/main/exp8_math) record the prompts, Python code, tool results, and the edit files.

This distinction matters. Astra did not get all 800 million raw values pasted into its prompt. It wrote code that inspected the values and ran carefully chosen tests. A fair description is that Astra planned and authored a weight-editing procedure, and Python carried out the numerical operations.

## How the edit worked

The researchers compared useful reasoning with repetitive reasoning. Astra used the model’s activations, the temporary numbers created as Qwen processes text, to look for a pattern that appeared in looping text.

They found a shared **direction** linked to repetition. A direction is a pattern across the model’s internal values. If a model keeps adding that same pattern to its working state, it can make similar text more likely again. The loop can then feed itself. The logs say Astra compared four matched pairs of useful and repetitive continuations, using Qwen’s shared working state after layers 16 and 20 to estimate the two directions.

Two feed-forward parts of Qwen, called MLPs, were strong writers of that repetition-linked direction. They were in layers 15 and 19. Each MLP has an output matrix: a grid of numbers that turns its internal neuron activity into a change to the model’s shared representation.

Astra targeted the part of selected MLP outputs that pointed along the repetition direction. It left other directions in those outputs alone. The operation was applied to 64 output columns in each layer. Each column contains 1,024 numbers, so the edit targeted:

```text
2 layers × 64 columns × 1,024 numbers = 131,072 weight positions
```

That is about 0.016% of the model’s roughly 800 million weights. The released edit changes only two tensors. The researchers count 131,072 positions that the operation targeted. After saving the values in bfloat16, 130,188 were bit-for-bit different from the originals; a few tiny changes rounded back to the same stored value. The count is small, but the edit was not a tiny nudge: the two matrices changed by about 10.6% and 8.1% in overall size, measured with a matrix norm.

```diagram:wsp-layers
```

This was not a patch that taught Qwen a new math rule. It counteracted one pattern that seemed to keep the model repeating. In a final confirmation on 1,152 fresh practice problems, the edit rescued 579 answers and lost five. Of the 579 rescued answers, 576 had previously been cut off at the token limit. Accuracy on answers that had already finished was unchanged overall. These were held-out practice problems, not benchmark scores.

In a simplified picture, take one selected output column, `w`, and a unit vector, `u`, that points along the repetition pattern. Astra’s final edit used `w_new = w_old − 6 (u · w_old)u`. The dot product `u · w_old` measures how much of the column points along the pattern. The edit subtracts six times that part. If a column had a component of `+1` along `u`, it would end up at `−5` along `u`. So this is not simply zeroing out a feature. It is a scaled change in a specific direction, while leaving each selected column’s other directions intact. The [released report and code](https://github.com/RikiyaT/lm_understand-logs/tree/main/exp8_math) contain the full tensor operation.

## What changed in the results?

The researchers tested the base model and three edits made with different practice-run budgets. Astra did not see these benchmark questions while editing. The tests used the same sampling settings before and after each edit. The table and detailed evaluation files are in the [authors’ post and logs](https://github.com/RikiyaT/lm_understand-logs/tree/main/exp8_math).

Choose a measure to compare the four runs:

```diagram:wsp-results
```

With the 50-pass edit, the reported MATH-500 score rose from 7.9% to 48.1%. GSM8K rose from 13.8% to 67.1%. IFEval, a test of following written instructions, rose from 21.0% to 62.3%. The share of MATH-500 answers that hit the 32,768-token limit fell from 93.0% to 33.1%.

For this evaluation, thinking was enabled and each answer could use up to 32,768 new tokens. Sampling used temperature 0.6, top-p 0.95, top-k 20, and a presence penalty of 1.5. Scores average multiple samples: four per MATH-500 problem, two per GSM8K and IFEval item. The held-back questions were not part of Astra’s practice set.

The smaller edit runs did not reach the same result. Ten passes raised MATH-500 to 12.3%; 25 passes raised it to 14.1%. Their loop rates stayed high. The large jump appeared in the 50-pass run, which took about 20 hours of wall time across 158 model turns and 80 Python runs.

The authors also tried a different model, Gemma 3 270M, which rarely looped in their setup. The 50-pass edit did not improve its MATH-500 result in a meaningful way: 6.8% before and 7.0% after. This supports a limited explanation: removing a failure can let a model show an ability it already had, but it does not necessarily give the model a new ability.

## Does this mean Astra made Qwen smarter?

The scores improved, but most of the gain appears to come from Qwen finishing answers it had already started to solve. When an answer stops at the token limit, a correct calculation inside it may not count as a correct final answer. Reducing loops can raise benchmark accuracy by letting the answer reach its end.

So the careful reading is: **the edit helped Qwen complete more answers under this test setup.** The experiment does not show that Astra taught Qwen new mathematics, or that the same edit would help a larger Qwen model or a different model.

There is also a sampling detail to keep in mind. The experiment used temperature 0.6. Qwen’s model card gives temperature 1.0 in its thinking-mode example and says to tune settings for the task. The researchers kept settings consistent before and after editing, which makes their comparison useful. It does not prove that the base model had already been tested with every good decoding setup.

The [edited checkpoint is public](https://huggingface.co/RikiyaT/Qwen3.5-0.8B-weight-space-programming), and its two changed tensors have published hashes. A separate run reported 51.0% on MATH-500 for that edited checkpoint. That run tested the edited model on all 500 problems, but its base-model comparison was only a 25-problem smoke test. It is useful evidence that the checkpoint can be reproduced and run, but it is not a full independent before-and-after replication.

## What the result does and does not show

It shows that a frontier model can work through an engineering task involving model weights: form a hypothesis, write Python to inspect the model, test possible edits, and save one that improves a held-back evaluation. The work also produced an exact edit that other people can inspect and apply.

It does **not** show that Astra read the full Qwen model directly as raw numbers. In the Qwen experiment, it used Python and a model-running tool. The original report also groups several different experiments under one idea. Some small-network experiments asked Astra to identify behavior from raw weights with no tools. Those are different from the Python-assisted Qwen repair.

Matthew Honnibal’s [response](https://honnibal.dev/blog/astra-read-write-misleading) makes this distinction its main point: reading small networks’ weights and writing code to diagnose a large language model are separate skills. That is a useful criticism of broad headlines. It does not erase the Qwen result; it narrows what the result demonstrates. The Qwen experiment is best understood as an AI doing a guided machine-learning engineering workflow, not as a model staring at 800 million values and instantly understanding them.

Other limits remain. This is one model editing one Qwen checkpoint, with one frontier editor model, in a study by the authors. It is not peer reviewed. The authors released detailed logs and the edit, but not the full harness needed to rerun every step exactly. The public checkpoint makes the final result easier to inspect; it does not settle how often the method will work or what unrelated behaviors may change.

## How this fits with older model editing

Researchers have edited model weights for years. Methods such as ROME and MEMIT change weights to add or update factual associations. They use a planned mathematical procedure to locate and modify parameters. They are useful context, but they are not the same as the Astra experiment: here, a general-purpose language model used Python and test runs to choose and apply a change to a looping behavior.

There is also **activation steering**. That changes internal signals while a model is answering, without saving a new weight file. Some recent work studies how steering vectors can affect reasoning behaviors or break self-loops. Weight-space programming changes the saved model itself, so the change remains when it is loaded again.

These approaches share a broad idea: a model’s behavior can depend on patterns that are spread across its internal numbers. They differ in what does the editing, when the edit is applied, and how it is tested.

## A small glossary

| Term | Plain meaning |
| --- | --- |
| Weight | A learned number inside a neural network. |
| Tensor | A grid or multi-dimensional block of numbers, such as an MLP weight matrix. |
| MLP | A feed-forward part of a transformer layer that transforms the model’s internal representation. |
| Activation | A temporary value produced inside the model while it processes a prompt. |
| Direction | A pattern across activation values. Adding or reducing it can change which behaviors are more likely. |
| Forward pass | Running the model on input to see its output or internal values. |
| Gradient descent | A training method that uses gradients and an optimizer to adjust weights to reduce an error score. |
| Weight-space programming | Using a general-purpose LLM to reason about, generate, or edit another network’s weights from a goal. |

## Further reading and artifacts

### The experiment and its files

- [The MIT CSAIL research post](https://rikiyat.github.io/blog/weight-space-programming/): the authors’ full explanation of all eight experiments.
- [Experiment 8 logs](https://github.com/RikiyaT/lm_understand-logs/tree/main/exp8_math): prompts, Python code, forward-pass records, benchmark outputs, and the weight diff.
- [The exact final edit](https://github.com/RikiyaT/lm_understand-logs/blob/main/exp8_math/runs/p50c/final_answer.md) and [the rebuild script](https://github.com/RikiyaT/lm_understand-logs/blob/main/exp8_math/code/apply_edit.py): inspect how the edit is described and reconstructed.
- [The edited Qwen checkpoint](https://huggingface.co/RikiyaT/Qwen3.5-0.8B-weight-space-programming): includes the authors’ scores, tensor hashes, and a later checkpoint run.
- [Try the base and edited models](https://huggingface.co/spaces/ML-Intern-lab/weight-space-programming-demo): a small browser demo, hosted by the checkpoint contributor.
- [Qwen3.5-0.8B model card](https://huggingface.co/Qwen/Qwen3.5-0.8B): model details and Qwen’s note about thinking loops.
- [Rikiya Takehi’s X thread](https://x.com/rikiyatakehi/status/2117313742891327994): the research team’s short public summary.
- [Matthew Honnibal’s critique](https://honnibal.dev/blog/astra-read-write-misleading): explains why tool-free weight reading and Python-assisted model editing should be described separately.

### Related papers

- [ROME: Locating and Editing Factual Associations in GPT](https://arxiv.org/abs/2202.05262): a method for changing specific factual associations by editing feed-forward weights.
- [MEMIT: Mass-Editing Memory in a Transformer](https://arxiv.org/abs/2210.07229): extends factual weight edits to many associations at once.
- [Understanding Reasoning in Thinking Language Models via Steering Vectors](https://arxiv.org/abs/2506.18167): studies reasoning patterns that can be changed through activation steering.
- [Can We Break LLMs Out of Self-Loops?](https://arxiv.org/abs/2607.18100): studies a separate, inference-time method for detecting and steering reasoning loops.

The Astra and Qwen result is an interesting first case of an LLM using an engineer’s toolkit to change model weights. Its most useful lesson so far is modest: a carefully chosen edit can remove one obstacle to a model finishing its work. The next step is independent replication across models, tasks, and unintended side effects.
