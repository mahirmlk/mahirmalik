---
title: "Jev Explained: The Small Model That Decides Instead of Writing"
shortTitle: "Jev Explained"
description: "Jev by TypeSafe AI is a System One model for fast typed decisions: how its Choice, Score and Noul primitives work, what it costs, and where it fits beside an LLM."
date: "2026-09-20"
tldr: "Jev does not write text. You send it state plus typed questions, it returns Choice, Score or Noul answers with probabilities in 70-500ms at $0.042 per million input tokens. Use it next to an LLM to route, gate and check work."
tags:
  - ai-agents
  - llms
  - system-one-models
  - typesafe-ai
  - model-routing
---

# Jev Explained: The Small Model That Decides Instead of Writing

TypeSafe AI released Jev on September 15, 2026.

It cannot hold a chat. It cannot write code. It cannot explain itself in paragraphs.

That is on purpose.

Most agent runs are full of small judgments: is this urgent, which team owns it, is this command safe, did the last step work. Teams send each one to a big LLM, wait for tokens to stream out, parse the text, and retry when the shape is wrong.

Jev handles those calls. You send state and questions. It sends back typed answers with numbers you can use in code.

This post is for engineers deciding whether a small typed model belongs in their agent. It covers what Jev is, how the three question types work, what it costs, where it helps, and where you should skip it. The examples need Python 3.10 and a key from the TypeSafe console.

Verified against the sources below on 2026-09-20 (publication date); model IDs, pricing, and rate limits change — re-check before building.

---

## The problem Jev is solving

A normal agent loop looks like this:

```diagram:jev-problem
```

Each step around the loop can turn into another LLM call. Pick a tool. Judge a result. Check risk. Decide if the task is done. Pick the next model.

A generative model answers even a one-word decision one token at a time. You pay for input, wait, and often pay more for output. Structured output and tool calling made the shape predictable. The wait stayed.

Jev starts from a different idea. When code already knows the possible answers, generation is the wrong interface.

---

## What Jev actually is

TypeSafe calls Jev a System One model. The name comes from fast intuitive thinking, as opposed to slow deliberate reasoning.

The interface is small:

```diagram:jev-what
```

You send two things:

- State: text or JSON that describes the situation right now.
- Questions: the decisions you want, each with its answer shape fixed in advance.

There is one endpoint:

```text
POST https://api.typesafe.ai/v1/systemone
```

A request names a model and carries state plus questions. A response carries one answer per question. Questions in the same request run in parallel against the same state. A tenth question costs tokens and almost no extra time.

Current model IDs are `jev-1.13.0` and the alias `jev-latest`. Input is text only. No images, audio, or video. Pass those in as text or JSON first.

The company behind it is TypeSafe AI in San Francisco. CEO is Diogo Almeida, who worked on RLHF and InstructGPT at OpenAI. The lab says it spent about two years in stealth and raised $40M led by DCVC.

---

## The three question types

Jev has three primitives. That is the whole API surface.

```diagram:jev-primitives
```

### Choice picks one option

Choice selects one option from a list you define. Up to 255 options.

```json
{
  "model": "jev-latest",
  "state": "The deploy failed twice and customers are seeing 500s.",
  "questions": {
    "owner": {
      "type": "choice",
      "instructions": "Which team should handle this?",
      "criteria": {
        "engineering": "Product failures and outages",
        "billing": "Charges, invoices, and refunds",
        "sales": "Pricing and new accounts"
      }
    }
  }
}
```

The answer returns the winner, a probability for every option, and confidence:

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "owner": {
      "type": "choice",
      "choice": "engineering",
      "confidence": 0.82,
      "probabilities": {
        "engineering": 0.85,
        "billing": 0.08,
        "sales": 0.07
      }
    }
  },
  "usage": {
    "input_tokens": 392,
    "output_tokens": 65
  }
}
```

Write the full question in `instructions`. The question ID (`owner`) is only for your code. Jev does not see it. Always add an `other` option if the list might be incomplete, because Choice always picks a winner.

### Score places input on a scale

Score rates the input on an ordered scale you define, from 2 to 10 levels. The result can land between levels.

```json
{
  "frustration": {
    "type": "score",
    "instructions": "How frustrated does the customer sound?",
    "criteria": ["Calm, just stating facts", "Frustrated but civil", "Very angry, strong language"]
  }
}
```

A three-level Score returns 0 to 2. A result like 1.4 means mostly level 1, leaning toward level 2. You also get probabilities per level and confidence.

### Noul answers yes or no

Noul returns the probability that something is true, from 0 to 1. Near 1 means yes. Near 0 means no. Near 0.5 means unsure.

```json
{
  "urgent": {
    "type": "noul",
    "instructions": "Does this need attention right now?"
  }
}
```

Noul has no separate confidence field. The number is the belief. Code that reads `.confidence` on a Noul answer will break. Use the value directly:

```python
if urgent > 0.9:
    page_on_call()
elif urgent > 0.6:
    add_to_fast_queue()
else:
    add_to_queue()
```

---

## How to call it from Python

Install the official SDK. You need Python 3.10 or newer and a key from the TypeSafe console.

```bash
pip install typesafe-sdk
export TYPESAFE_API_KEY="sk-..."
```

One call can ask all three types at once:

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

client = TypeSafeClient(model="jev-1.13.0")

ticket = "Hi, I've been trying to connect Stripe for 3 days. Losing sales. Help ASAP."

response = client.system_one(
    state=ticket,
    questions={
        "department": Choice(
            instructions="Which team should handle this",
            criteria={
                "billing": "Payment or subscription issues",
                "technical": "Bugs or integration problems",
                "sales": "Pricing or account questions",
            },
        ),
        "frustration": Score(
            instructions="How frustrated the customer appears",
            criteria=["Calm, just stating facts", "Frustrated but civil", "Very angry, strong language"],
        ),
        "is_urgent": Noul(
            instructions="The message conveys urgency or time-sensitivity"
        ),
    },
)

print(response.answers["department"].choice)
print(response.answers["frustration"].score)
print(response.answers["is_urgent"].noul)
```

Pin `jev-1.13.0` in production and log `response.model`. The alias `jev-latest` moves when new versions ship, and your thresholds were tuned on one version.

Handle errors by status. 401 means bad key. 422 means bad request shape. 429 and 529 mean rate limit or overload, so back off and retry.

```python
from typesafe_sdk import TypeSafeAPIError

try:
    response = client.system_one(state=state, questions=questions)
except TypeSafeAPIError as e:
    print(e.status, e.request_id, e.body)
    raise
```

Without the SDK, it is plain HTTPS:

```python
import os, requests

r = requests.post(
    "https://api.typesafe.ai/v1/systemone",
    headers={"Authorization": f"Bearer {os.environ['TYPESAFE_API_KEY']}"},
    json={"model": "jev-latest", "state": state, "questions": questions},
    timeout=10,
)
r.raise_for_status()
print(r.json()["answers"]["department"]["choice"])
```

---

## LLM vs Jev

Both can classify a ticket. They reach the answer in different ways.

```diagram:jev-llm-vs-jev
```

TypeSafe reports 70 to 500ms end to end for Jev. Most queries land near 100ms from the US West Coast where the service runs, plus your network. Frontier LLMs take 3 to 329 seconds on the reasoning-heavy tasks TypeSafe compared against.

Price is $0.042 per million input tokens. Output is free because Jev returns small probability sets, not a token stream. Frontier inputs in the same comparison run $0.20 to $10 per million, with output around 5x input.

The headline multiples reach about 40 to 200x faster and up to 400x cheaper. Those come from TypeSafe's own workflow evals. Read them as a ceiling. Your speedup depends on how much of your run was generation, reasoning traces, and retries that a typed answer removes.

Rate limits during early access are 250,000 tokens per second and 1,200 requests per minute. TypeSafe says those can change while it adds capacity.

---

## Why probabilities matter

The label tells you what won. The distribution tells you how close the race was.

```diagram:jev-confidence
```

Billing won here at 0.52 against technical at 0.46. Confidence is low at 0.18. Auto-routing that ticket would be reckless.

A pattern that works in practice:

```python
answer = response.answers["department"]

if answer.confidence < 0.6:
    send_to_human_review(ticket)
elif answer.choice == "billing":
    add_to_queue("billing")
else:
    add_to_queue(answer.choice)
```

Thresholds belong in code where you can review them. A dashboard label can accept 0.6. A command that deletes data should need 0.9 or a human.

TypeSafe trains Jev with Reinforcement Learning for Calibrated Decisions, or RLCD. The goal is simple. When the model says 0.8 across many cases, about 80% of those cases should be right. Calibration is measured over many predictions. It says nothing certain about one case.

There is no large independent calibration study yet. Plot accuracy against confidence on your own labeled traffic before you trust a threshold.

---

## The hallucination claim, stated carefully

TypeSafe says Jev cannot hallucinate. That is true in a narrow sense.

Jev cannot return an option outside your schema. If you define billing, technical, and sales, it cannot invent legal. It cannot return broken JSON where your code expected a label.

It can still pick the wrong valid option with high confidence.

A safer sentence: Jev cannot break the declared output schema, but it can still be wrong. A schema-valid mistake can refund the wrong customer or approve a risky command. Keep deterministic checks where rules are exact. Use Jev where meaning is fuzzy.

---

## Where Jev fits inside an agent

Jev works best next to an LLM. The LLM plans, writes, and explains. Jev makes the frequent calls around that work — the same evaluate-and-decide slot described in [the context/harness/loop blueprint](/writing/context-vs-loop-vs-harness-engineering).

```diagram:jev-agent
```

### Route to the right model

A lookup does not need the same model as an architecture review.

```python
route = response.answers["route"].choice

model = fast_model if route == "fast" else powerful_model
```

The router never answers the user. It picks which model should.

### Gate risky tools

Before a shell command runs, classify it as read-only, reversible, or destructive. Ask separate questions for deletes files, rewrites Git history, touches production, or leaves the repo.

```python
risk = response.answers["risk"].choice
conf = response.answers["risk"].confidence

if risk == "read_only" and conf > 0.6:
    run_command(cmd)
elif risk == "destructive" or conf < 0.6:
    ask_human(cmd)
else:
    run_with_snapshot(cmd)
```

LangChain's Jev integration uses this shape as middleware that checks a tool call before it executes. The production version of this pattern — single-use consent plus human-in-the-loop approval for high-value actions — is how [Sellable gates risky orders](/work/sellable). The checks there are deliberately dull: budget, floor price, stock, and negotiation rounds, decided in code before money moves.

### Check the result

An agent can claim it is done while tests still fail. Ask bounded questions. Did tests pass. Is the agent repeating the same action. Does the output follow policy. Should a human review this.

Jev does not replace a hard test. It adds a semantic check where the rule depends on meaning.

---

## Real runs with real numbers

### Browser control

Browser Use put Jev inside a web agent in the `jev-ultrafast` repo. Each page observation becomes an element list. One Jev request picks the operation and target. A small LLM only writes text when the action is `TYPE_TEXT`.

The flight run found results in about 7 seconds for $0.0039. The recording shows 90,558 Jev input tokens. The clock starts after the first page observation and leaves out fresh post-run verification. It finds flights. It does not book tickets.

The matched comparison ran the same goal six times. Median task time fell from 9.45s to 7.09s, about 25% lower. Browser protocol calls fell from 1,092 to 101. The team credits one-shot page reads and skipping fresh predictions for irrelevant animations, not just a faster model.

Code: [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast)

### Paper triage

Hassan classified 1,018 AI papers with one Choice over 24 topics. Total cost $0.08. Median 256ms per paper. Summaries came from a generative model first. Jev only did the routing.

### Inbox triage

Riley Brown classified 500 emails in seconds for about $0.035. Email as state, Choice over reply, research, wait, and review, then folders or agents per answer.

### Safety checks

Vercel's fx team tested Jev as a command safety reviewer. They report about 5 to 18x faster classification than GPT Luna, with better accuracy on their checks. That is the classifier only, not a full agent run.

Across all four, the work stayed with the model or browser, and the choice moved to one typed call.

---

## Where Jev is the wrong choice

Skip Jev when the answer space is unknown.

- It cannot write, summarize, generate code, or explain reasoning.
- It is weak at arithmetic, counting, date comparison, and exact string work. Do that in code.
- It struggles when a decision needs several hidden reasoning steps. Split it into smaller questions or use a reasoning model.
- It cannot pull out an unknown value. Find candidates first, then let Jev choose among them.
- Extra context can hurt accuracy. Send only the fields the decision needs.
- Weights are closed, access is early, input is text only, and independent calibration data is thin. Do not give it blind trust.

One rule covers a lot: if plain code already solves it correctly, keep the code. An `if` statement is faster, cheaper, and easier to test than any model.

---

## A rollout that avoids new failures

A cheap model still costs money if its mistakes cause retries and incidents. Measure the whole task, not the token price.

1. Pick one bounded decision with clear answers.
2. Write the rubric first. Define what belongs in each option.
3. Collect real examples with expected answers, including ambiguous and hostile ones.
4. Run in shadow mode beside the current path. Log, do not enforce.
5. Plot accuracy against confidence. Set thresholds from your data.
6. Automate the safest branch first. Keep a human or stronger model for unsure cases.
7. Pin the model version and log questions, criteria, and thresholds. Replay them when anything changes.

Treat questions like code. Version them, review them, test them.

---

## The shift in one line

LLM creates the work. Jev decides what happens next. Code runs it.

Most builders will keep spending frontier tokens on every yes, no, route, and score. Even reading TypeSafe's numbers as the ceiling they are, the frequent small calls look like work for something cheaper.

Start with one repeated decision. Give Jev the minimum state, define the answers, log probabilities next to the current result. Let it earn one branch before you hand it the workflow.

---

## Sources

- [TypeSafe AI: Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
- [TypeSafe docs: Quickstart](https://docs.typesafe.ai/introduction/quickstart)
- [TypeSafe docs: Python SDK usage](https://docs.typesafe.ai/sdk/python/usage)
- [TypeSafe docs: Choice](https://docs.typesafe.ai/primitives/choice) · [Score](https://docs.typesafe.ai/primitives/score) · [Noul](https://docs.typesafe.ai/primitives/noul)
- [TypeSafe docs: Confidence](https://docs.typesafe.ai/confidence) · [Fan-out pattern](https://docs.typesafe.ai/patterns/fan-out)
- [Browser Use: jev-ultrafast code](https://github.com/browser-use/jev-ultrafast) · [Performance notes](https://github.com/browser-use/jev-ultrafast/blob/main/docs/performance.md)
- [LangChain: Building a harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev)
- [Flavio Copes: A deep dive into Jev](https://flaviocopes.com/jev/)
- [@0xCodila: Jev Engineering roadmap](https://x.com/0xCodila/status/2100984487802708306?s=20)
- [@akshay_pachaar: Jev Clearly Explained](https://x.com/akshay_pachaar/status/2101037514945597645?s=20)
