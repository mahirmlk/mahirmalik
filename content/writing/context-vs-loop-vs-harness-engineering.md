---
title: "Context vs Loop vs Harness Engineering: The New Stack Behind AI Agents"
shortTitle: "Context vs Loop vs Harness Engineering"
description: "Context engineering, harness engineering, and loop engineering sound similar. They are not. Here is what each one does, where they overlap, and how to build a simple production-style agent system."
date: "2026-09-13"
tldr: "Context engineering decides what the agent knows, harness engineering decides what it can do and under what rules, and loop engineering decides what happens next and when it stops. The prompt is no longer the whole product — the system around the model is."
tags:
  - ai-agents
  - context-engineering
  - harness-engineering
  - loop-engineering
  - agentic-ai
  - software-engineering
---

# Context vs Loop vs Harness Engineering

A few years ago, building with AI mostly meant one thing:

> **Write a better prompt.**

Then things got bigger.

AI stopped being just a chatbot that gives you an answer once. Models started reading files, calling tools, writing code, searching the web, querying databases, and working through tasks over many steps.

And suddenly, the prompt was only a small part of the problem.

Three new terms are now showing up everywhere:

- **Context engineering**
- **Harness engineering**
- **Loop engineering**

They sound like different names for the same thing.

They are not.

The easiest way to understand them is:

> **Context engineering decides what the agent knows.**  
> **Harness engineering decides what the agent can do and under what rules.**  
> **Loop engineering decides what happens next, how the agent keeps going, and when it stops.**

There is some overlap, especially between harness and loop engineering. The terminology is still evolving, and there is **no single industry-standard definition of "loop engineering" yet**.

But this mental model is useful.

Let's break it down.

---

# First: Why did these terms appear?

The old AI workflow looked roughly like this:

```diagram:old-workflow
Human
  ↓
Prompt
  ↓
LLM
  ↓
Answer
  ↓
Human decides what to do next
```

The human was basically the control system.

You would do this:

```text
"Fix this bug."
       ↓
AI fixes something
       ↓
You inspect it
       ↓
"That didn't work. Try this."
       ↓
AI changes more code
       ↓
You test it
       ↓
"Now fix the failing test."
```

You were manually driving the whole thing.

Modern coding agents changed this.

Now the system can look more like:

```diagram:agent-flow
Goal
 ↓
Agent
 ↓
Inspect files
 ↓
Edit code
 ↓
Run tests
 ↓
Read errors
 ↓
Fix code
 ↓
Run tests again
 ↓
Review
 ↓
Repeat
 ↓
Done
```

At that point, the hard engineering problems moved.

You are no longer just asking:

> "What prompt should I write?"

You are asking:

> "What information should the agent see?"

> "What tools should it have?"

> "What is it allowed to change?"

> "How does it know whether its work is correct?"

> "What should happen after a failure?"

> "When should it continue?"

> "When should it stop?"

> "When should a human take over?"

That is where context, harness, and loop engineering come in.

---

# The easiest mental model

Think of an AI coding agent as a developer inside a workshop.

```diagram:workshop
                ┌─────────────────────────────┐
                │          AI AGENT            │
                │          (the model)         │
                └──────────────┬──────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼

       CONTEXT ENGINEERING  HARNESS ENGINEERING  LOOP ENGINEERING

       What does it know?   What can it do?      What happens next?
       What should it see?  What tools exist?    Keep going?
       What should be       What is forbidden?   Retry?
       retrieved?           How is it checked?   Stop?
```

Or even simpler:

| Layer | Main question |
|---|---|
| **Context engineering** | What should the model know right now? |
| **Harness engineering** | What can the model do, and how do we keep it safe and useful? |
| **Loop engineering** | What should happen next, and when are we done? |

The interesting part is that these layers work together.

---

# 1. Context Engineering

## What is context engineering?

Context engineering is the practice of deciding **what information goes into the model at a particular moment**.

That includes much more than the user prompt.

For an agent, context can contain things like:

```text
System instructions
+
User request
+
Conversation history
+
Relevant files
+
Tool descriptions
+
Tool results
+
Database results
+
Previous decisions
+
Agent memory
+
Current task state
+
Examples
```

So context engineering is basically:

> **Give the model the right information, at the right time, in the right form.**

Not all available information.

The **right** information.

---

## Why not just dump everything into the context?

This sounds reasonable:

> "The model has a huge context window. Just give it the whole repository."

That is usually a bad idea.

More context does not automatically mean better reasoning.

Imagine asking a developer to fix one authentication bug and then handing them:

```text
800 files
+
300 pages of docs
+
2,000 old logs
+
every Slack message
+
every previous ticket
+
every database row
```

Technically, they have more information.

Practically, they're cooked.

The same basic idea applies to agents.

---

# The context engineering problem

Suppose your coding agent needs to fix:

```text
POST /api/login
```

The useful context might be:

```text
src/auth/login.ts
src/auth/session.ts
tests/auth/login.test.ts
API contract
recent failing test
authentication architecture docs
```

It probably does **not** need:

```text
marketing/homepage.tsx
old migration scripts
unrelated analytics queries
the entire dependency tree
every test in the repository
```

The job of context engineering is deciding that difference.

---

# Context is bigger than the prompt

This is one of the biggest mindset shifts.

A prompt might say:

```text
Fix the login bug.
```

But the actual context could look like:

```text
SYSTEM INSTRUCTIONS
        +
PROJECT RULES
        +
TASK
        +
RELEVANT CODE
        +
TEST RESULTS
        +
TOOL DEFINITIONS
        +
PREVIOUS WORK
        +
MEMORY
        +
CURRENT ENVIRONMENT STATE
```

The prompt is just one piece.

---

# Context engineering in practice

There are several major techniques.

## 1. Retrieval

Instead of putting everything into context upfront, retrieve information when it is actually needed.

For example:

```text
Agent:
"I need to understand payment retries."

        ↓

Search repository

        ↓

Find:
src/payments/retry.ts

        ↓

Read only that file

        ↓

Continue reasoning
```

That is basically progressive disclosure.

You don't read the entire library before looking for one function.

You navigate to what matters.

---

## 2. Compaction

Imagine an agent has been working for two hours.

Its conversation now contains:

```text
Thousands of tool calls
+
old errors
+
old file contents
+
intermediate reasoning
+
completed tasks
+
current task
```

Keeping everything forever is inefficient.

So the system can summarize older history into a smaller representation.

For example:

```text
BEFORE

20,000 tokens of history


AFTER

Current architecture:
- PostgreSQL
- Redis
- background worker

Completed:
- auth flow
- database migration

Known issue:
- retry logic fails on timeout

Next:
- update retry handler
- run integration tests
```

The point is simple:

> **Keep the useful state, throw away the noise.**

---

## 3. Persistent memory

Another approach is to save important state outside the model's context.

For example:

```text
NOTES.md

Current objective:
Build payment reconciliation.

Completed:
- Stripe importer
- transaction parser

Remaining:
- duplicate detection
- reconciliation report

Known issue:
Some refunds are represented differently.
```

The next agent session can read this file and continue.

This is especially useful for long-running tasks.

---

## 4. Sub-agents

Sometimes one giant context is the wrong design.

Instead:

```text
                 Main Agent
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
      Research     Testing     Security
       Agent        Agent        Agent
```

Each agent gets a clean, focused context.

The specialist can investigate something deeply and then return a compact result to the main agent.

---

# A real-world context engineering lesson

One useful pattern in modern coding-agent systems is to make the repository itself a kind of **navigation system for the agent**.

Instead of one giant instruction file saying:

```text
"Here are 200 rules..."
```

you can use:

```text
AGENTS.md
```

as a map:

```text
Project architecture → docs/architecture.md
Testing rules        → docs/testing.md
API conventions      → docs/api.md
Database rules       → docs/database.md
Deployment rules     → docs/deployment.md
```

Now the agent can fetch the deeper information when needed.

That is a much more scalable way to provide context.

---

# 2. Harness Engineering

Now we get to the bigger system around the model.

## What is a harness?

A harness is the **environment around the model that lets it actually operate**.

The model may decide:

```text
"I should run the tests."
```

The harness makes that possible.

It provides things like:

```text
Tools
File system
Shell
Browser
Database access
APIs
Sandbox
Permissions
Authentication
Memory
Logging
Tracing
Validation
Retries
State management
```

In simple terms:

> **The model decides. The harness gives it the machinery to act.**

---

# A simple analogy

Imagine you hire a very smart developer.

The developer knows how to solve problems.

But you put them in an empty room.

No:

- computer
- terminal
- files
- internet
- test environment
- documentation
- database

They are still intelligent.

They just can't do much.

Now give them:

```text
Laptop
+
Repository
+
Terminal
+
Browser
+
Tests
+
Git
+
Database
+
Logs
+
Safe sandbox
```

Now they're dangerous in a useful way.

That environment is basically the **harness**.

---

# What belongs inside a harness?

A production agent harness often contains some combination of:

```diagram:harness
┌──────────────────────────────────────────┐
│                 HARNESS                  │
│                                          │
│  Context assembly                        │
│  Tool access                             │
│  Permissions                             │
│  Sandbox                                 │
│  State & memory                          │
│  Validation                              │
│  Logging                                 │
│  Error handling                          │
│  Recovery                                │
│  Evaluation                              │
│  Human escalation                        │
│  Workflow / orchestration                │
│                                          │
└───────────────────┬──────────────────────┘
                    │
                    ▼
                 MODEL
```

And this is where things get slightly messy.

**Context engineering can be part of the harness.**

**Loop engineering can also be part of the harness.**

So why do we talk about them separately?

Because they answer different engineering questions.

Think of it as different views of the same system.

---

# Harness Engineering vs Context Engineering

### Context engineering asks:

> "What should the model see?"

### Harness engineering asks:

> "What environment should the model operate inside?"

Example:

```text
Context:
"Here are the payment API docs and the relevant source files."

Harness:
"Here is the repository, terminal, test environment,
database sandbox, Git, and permission policy."
```

Context is about **information**.

Harness is about the **runtime environment**.

---

# Harness Engineering vs Tool Calling

Tool calling alone is not the same thing as harness engineering.

For example:

```text
Model → call send_email()
```

is simply tool use.

Harness engineering asks much bigger questions:

```text
Can the model send email?

To whom?

Can it send automatically?

What domains are allowed?

Does it need confirmation?

Is the tool idempotent?

What happens if it fails?

Where is the request logged?

Can we replay the action?

Can a human approve it?
```

That is the harness mindset.

---

# The OpenAI Codex example

Recent agent-first engineering work shows that the environment around the coding model can become a major part of the product itself.

The core lesson isn't simply:

> "The model writes code."

It is:

> "The engineers built an environment in which the model could write, execute, inspect, test, and correct code."

That environment can include:

```text
Repository knowledge
+
Architecture rules
+
Custom linters
+
Structural tests
+
Browser automation
+
Logs
+
Metrics
+
Tracing
+
Worktrees
+
Review agents
+
Validation
+
Documentation
```

This is harness engineering.

---

# One of the biggest harness lessons: constraints

This sounds backwards.

You might think:

> "If agents are smart, give them maximum freedom."

In practice, strong agents often benefit from **clear boundaries**.

For example:

```text
Allowed:

src/
tests/
docs/

Not allowed:

production secrets
billing database
private credentials
```

Or:

```text
Architecture rule:

Types
 ↓
Config
 ↓
Repository
 ↓
Service
 ↓
Runtime
 ↓
UI
```

The agent can choose how to implement a service.

But it cannot randomly create dependency paths that violate the architecture.

That leads to a powerful rule:

> **Don't tell the agent every line it should write. Tell it what must remain true.**

That is much more scalable.

---

# Harness engineering is also about observability

A production agent should not operate like a black box.

You want to know:

```text
What did it do?

Why did it do it?

Which tool did it call?

What failed?

How many tokens did it use?

How long did it run?

Which files changed?

What tests failed?

Why did it stop?
```

This becomes even more important once the agent is running without a human watching every step.

The goal is not to collect random logs.

The goal is to make an agent run **debuggable**.

---

# 3. Loop Engineering

Now the newest term.

And also the least settled one.

## What is loop engineering?

The basic idea is:

> **Stop manually prompting the agent for every step. Build a system that prompts the agent for you.**

A normal workflow looks like:

```text
YOU
 ↓
Prompt
 ↓
Agent
 ↓
Result
 ↓
YOU
 ↓
Prompt
 ↓
Agent
 ↓
Result
```

You are the loop.

With loop engineering:

```diagram:loop
              ┌─────────────────┐
              │      LOOP       │
              │                 │
Goal ────────►│ Prompt agent    │
              │      ↓          │
              │ Observe result  │
              │      ↓          │
              │ Evaluate        │
              │      ↓          │
              │ Continue?       │
              └───────┬─────────┘
                      │
               yes ──►┘
               no  ──► DONE
```

The machine handles the repetition.

---

# The simplest loop

A basic agent loop looks like:

```pseudo
goal = "fix all failing tests"

while budget_remaining:

    result = agent(goal, current_state)

    if tests_pass(result):
        stop()

    if no_progress(result):
        escalate()

    update_state(result)
```

That's the core idea.

But a useful loop needs much more than "run it again."

---

# A loop is not just repetition

Bad loop:

```text
Agent
 ↓
Failed
 ↓
Try again
 ↓
Failed
 ↓
Try again
 ↓
Failed
 ↓
Try again
 ↓
$500 cloud bill
```

That's not intelligent automation.

That's an expensive hamster wheel.

A good loop needs:

```text
Goal
+
Trigger
+
Action
+
Feedback
+
State
+
Evaluation
+
Stop condition
+
Budget
+
Escalation
```

---

# What makes a good loop?

## 1. A clear goal

Bad:

```text
Improve the project.
```

Better:

```text
Reduce all P1 errors in the checkout service
until the integration test suite passes.
```

---

## 2. Feedback

The loop needs some way to tell whether the last action worked.

For coding:

```text
Unit tests
Type checker
Lint
Integration tests
Browser tests
Production metrics
```

For research:

```text
Source verification
Coverage checks
Fact checks
Citation checks
```

For customer support:

```text
Ticket resolution
Customer response
Escalation rate
```

Without feedback, the loop cannot really know whether it is improving.

---

## 3. A stop condition

This is probably the most important part.

A loop should know how to stop.

For example:

```text
✓ all tests pass
✓ no P0/P1 bugs remain
✓ evaluator score > 90
✓ requested feature exists
✓ budget is exhausted
✓ timeout reached
✓ human approval required
```

Notice something important:

> **"The model feels finished" is not a reliable stop condition.**

The system should ideally use something measurable.

---

## 4. A budget

Loops can burn resources.

A loop budget can include:

```text
Maximum iterations
Maximum tokens
Maximum runtime
Maximum tool calls
Maximum dollars
Maximum risk
```

Autonomy without a budget is basically giving your agent a company credit card and saying "vibes."

Not ideal.

---

# Loop Engineering vs Harness Engineering

A useful distinction is:

### Harness

> **How does the agent operate?**

### Loop

> **How does the agent keep operating?**

Imagine a coding agent.

The harness gives it:

```text
Terminal
Git
Browser
Filesystem
Tests
Sandbox
Permissions
Logs
Database
```

The loop says:

```text
Find a task
   ↓
Work on it
   ↓
Run tests
   ↓
Review result
   ↓
Fix failures
   ↓
Repeat
   ↓
Move to next task
```

So:

```text
HARNESS = environment + controls + capabilities

LOOP = ongoing execution strategy
```

---

# But here's the annoying part

The boundary isn't perfectly clean.

A loop is often implemented **inside the harness**.

For example:

```text
Agent Harness
│
├── Context manager
├── Tools
├── Sandbox
├── Memory
├── Evaluator
├── Permissions
└── Agent Loop
```

So you can reasonably say:

> "The loop is part of the harness."

And you can also say:

> "Loop engineering is a separate engineering concern."

Both can be correct.

The difference is one of **focus**.

---

# Context vs Harness vs Loop

Now let's put all three side by side.

| | Context Engineering | Harness Engineering | Loop Engineering |
|---|---|---|---|
| Main question | What should the model know? | What can the model do? | What happens next? |
| Main focus | Information | Environment | Process |
| Controls | Context selection | Tools, permissions, runtime | Iteration, evaluation, stopping |
| Typical work | Retrieval, memory, compaction | Sandbox, tools, logs, security | Retry, scheduling, checkpoints |
| Failure | Wrong or missing information | Unsafe or ineffective execution | Infinite loops or premature stopping |
| Example | Load only checkout files | Give access to tests + Git | Keep fixing until tests pass |
| Time horizon | Per model step | Across execution | Across many steps |
| Main resource | Context / attention | Runtime / capabilities | Time / tokens / iterations |

The shortest version:

```text
CONTEXT
"What should it see?"

HARNESS
"What can it do?"

LOOP
"What should it do next?"
```

---

# A real example: Build a SaaS dashboard

Let's say your goal is:

> "Build a SaaS analytics dashboard."

Looks simple.

But a production agent might need all three engineering layers.

## Context engineering

Give the agent:

```text
Product requirements
Database schema
Design system
Relevant API contracts
Existing components
Current task state
Coding conventions
```

Avoid flooding it with irrelevant files.

---

## Harness engineering

Give the agent:

```text
Repository access
Terminal
Browser
Database sandbox
Git
Test runner
Screenshot tool
Logs
Type checker
Permission rules
```

And make sure it cannot:

```text
delete production data
read secrets
modify protected infrastructure
```

---

## Loop engineering

Now define:

```text
1. Pick the highest-priority unfinished feature.
2. Implement it.
3. Run tests.
4. Launch the application.
5. Test the feature in the browser.
6. Review failures.
7. Fix them.
8. Re-run tests.
9. Repeat until acceptance criteria pass.
10. Commit the change.
11. Move to the next feature.
```

That is the complete system.

---

# What happens when one layer is weak?

## Good loop + bad context

The agent keeps working...

but it is working from the wrong information.

Result:

```text
Fast wrong decisions
+
lots of iteration
=
very efficient failure
```

---

## Good context + bad harness

The model understands exactly what needs to happen.

But:

```text
No terminal
No test runner
No browser
No permissions
No useful tools
```

Result:

```text
Great plan
+
no ability to execute
=
nice essay
```

---

## Good harness + bad loop

The agent has:

```text
Tools
Memory
Browser
Tests
Database
Everything
```

But the workflow is:

```text
Do one thing
 ↓
Stop
```

Result:

```text
Powerful environment
+
no sustained execution
=
underused agent
```

---

# Concrete Implementation Blueprint

Now let's stop talking theory and build one.

Imagine we want a small coding agent that can take a task like:

```text
"Fix the failing checkout tests."
```

and work on it without a human manually pushing it forward every 30 seconds.

The goal is not to build a sci-fi autonomous engineer.

The goal is to build a **small, understandable agent system**.

---

## The architecture

Start with five pieces:

```text
                ┌─────────────────────┐
                │      TASK QUEUE     │
                │                     │
                │ "Fix checkout test" │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │        LOOP         │
                │                     │
                │ Decide next action  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      CONTEXT        │
                │                     │
                │ Task + files +      │
                │ state + feedback    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │       MODEL         │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │      HARNESS        │
                │                     │
                │ shell / files /     │
                │ tests / git / logs  │
                └──────────┬──────────┘
                           │
                           ▼
                      ENVIRONMENT
                           │
                           ▼
                        FEEDBACK
                           │
                           └──────► LOOP
```

The feedback path is the secret sauce.

Without feedback, you don't really have a useful autonomous loop.

---

## Recommended folder structure

A tiny implementation can look like this:

```text
agent/
│
├── src/
│   ├── agent.ts
│   ├── loop.ts
│   ├── context.ts
│   ├── tools.ts
│   ├── evaluator.ts
│   ├── state.ts
│   └── policy.ts
│
├── workspace/
│   ├── AGENTS.md
│   ├── progress.md
│   └── ...
│
├── evals/
│   ├── checkout.test.ts
│   ├── auth.test.ts
│   └── regression.test.ts
│
└── package.json
```

Each file has one job.

That matters.

Do not put the whole agent into one 2,000-line `agent.ts` file.

Future-you will not thank current-you.

---

## Step 1: Define agent state

Your agent needs persistent state.

```ts
type AgentState = {
  taskId: string;
  goal: string;

  iteration: number;
  maxIterations: number;

  changedFiles: string[];

  lastAction?: string;
  lastResult?: string;

  failures: number;

  status:
    | "running"
    | "blocked"
    | "completed"
    | "failed";

  progressNotes: string[];
};
```

This state should survive context resets.

Why?

Because model context is temporary.

Agent state should not be.

---

## Step 2: Build the context layer

The context builder should answer:

> "What does the model need to know **right now**?"

```ts
type ContextInput = {
  goal: string;
  state: AgentState;
  relevantFiles: string[];
  testResults: string;
};

function buildContext(input: ContextInput) {
  return `
You are working on this task:

${input.goal}

Current iteration:
${input.state.iteration}

Relevant files:
${input.relevantFiles.join("\n")}

Recent test results:
${input.testResults}

Previous progress:
${input.state.progressNotes.join("\n")}

Rules:
- Make the smallest safe change.
- Do not modify secrets.
- Run relevant tests after editing.
- Do not claim success unless verification passes.
`;
}
```

This is context engineering in code.

Notice what is **not** here:

```text
Entire repository
+
Entire Git history
+
All previous conversations
+
Every log ever generated
```

Keep it focused.

---

## Step 3: Give the model a small toolset

Don't start with 47 tools.

Start with the smallest set that lets the agent actually work.

```ts
const tools = {
  readFile,
  searchCode,
  writeFile,
  runTests,
  runCommand,
  gitDiff,
};
```

For a first version, that may genuinely be enough.

The principle is:

> **Capability should be earned by evidence, not added because it sounds cool.**

If you later discover that the agent repeatedly needs browser access, add a browser tool.

If it never needs it, don't.

---

## Step 4: Put permissions around tools

This is part of the harness.

A simple policy could be:

```ts
const policy = {
  allowedCommands: [
    "npm test",
    "npm run lint",
    "npm run typecheck",
    "git diff",
  ],

  blockedPatterns: [
    "rm -rf",
    "DROP DATABASE",
    "production",
    ".env",
    "credentials",
  ],

  writablePaths: [
    "src/",
    "tests/",
    "docs/",
  ],
};
```

The exact implementation will vary, but the principle is universal:

```text
Model wants to act
        ↓
Policy checks action
        ↓
Allowed?
  ├── yes → execute
  └── no  → block + explain
```

This is why tool access is not just an API detail.

It's part of agent design.

I built this exact pattern in [Sellable](/work/sellable), where pricing rules, spend limits, consent, and audit logging all live outside the LLM — the model proposes, deterministic code decides.

---

## Step 5: Add an evaluator

The evaluator should answer:

> "Did the last action actually move us closer to the goal?"

For a coding agent, start simple.

```ts
async function evaluate(workspace: string) {
  const typecheck = await run("npm run typecheck", workspace);
  const tests = await run("npm test", workspace);
  const lint = await run("npm run lint", workspace);

  return {
    passed:
      typecheck.exitCode === 0 &&
      tests.exitCode === 0 &&
      lint.exitCode === 0,

    typecheck,
    tests,
    lint,
  };
}
```

Now the agent has something better than:

```text
"I think I'm done."
```

It has:

```text
"The checks passed."
```

That is a massive difference.

Hard checks come first; for fuzzy semantic judgments beside them, a [typed decider like Jev](/writing/jev-system-one-model-explained) can sit next to the test suite.

---

## Step 6: Build the loop

Now the three ideas finally come together.

```ts
async function runAgent(task: string) {
  const state: AgentState = {
    taskId: crypto.randomUUID(),
    goal: task,
    iteration: 0,
    maxIterations: 20,
    changedFiles: [],
    failures: 0,
    status: "running",
    progressNotes: [],
  };

  while (state.status === "running") {
    state.iteration++;

    if (state.iteration > state.maxIterations) {
      state.status = "failed";
      break;
    }

    const context = await buildAgentContext(state);

    const result = await callModel({
      context,
      tools,
    });

    const evaluation = await evaluate(process.cwd());

    state.lastAction = result.summary;
    state.lastResult = JSON.stringify(evaluation);

    if (evaluation.passed) {
      state.status = "completed";
      break;
    }

    if (isMakingNoProgress(state, evaluation)) {
      state.status = "blocked";
      break;
    }

    updateProgress(state, result, evaluation);
    persistState(state);
  }

  return state;
}
```

That's the basic loop.

It is not magical.

And that's the point.

A good agent system is often a bunch of boring engineering around a very capable model.

---

## Step 7: Add progress detection

This is where a basic loop becomes a better loop.

Imagine:

```text
Iteration 1 → 7 tests failing
Iteration 2 → 7 tests failing
Iteration 3 → 7 tests failing
Iteration 4 → 7 tests failing
```

The model is technically "working."

But nothing is improving.

You need a **no-progress detector**.

For example:

```ts
function isMakingNoProgress(state, evaluation) {
  const currentFailures = countFailures(evaluation);

  const previousFailures =
    extractPreviousFailures(state);

  if (currentFailures >= previousFailures) {
    state.failures++;
  } else {
    state.failures = 0;
  }

  return state.failures >= 3;
}
```

Now the loop can say:

```text
"No measurable progress after 3 attempts."

→ stop
→ summarize
→ ask for human help
```

That's far better than endlessly retrying.

---

## Step 8: Add explicit checkpoints

Not every action should be autonomous.

For example:

```text
Low risk
──────────────
Read files
Run tests
Edit local code
Run lint
Create patch
        ↓
Allowed automatically


High risk
──────────────
Delete database
Deploy production
Send customer email
Change billing config
        ↓
Require approval
```

You can model that directly:

```ts
type RiskLevel = "low" | "medium" | "high";

function requiresApproval(action: string, risk: RiskLevel) {
  return risk === "high";
}
```

This creates a **mixed-autonomy system**.

That is usually much saner than:

```text
AI = full admin
```

Single-use consent plus human-in-the-loop approval is how this looks in production — see how [Sellable gates high-value orders](/work/sellable).

---

## Step 9: Persist progress outside the model

Don't depend on the conversation history to remember everything.

Write a small progress file:

```md
# Progress

## Goal

Fix checkout integration tests.

## Completed

- Fixed cart serialization.
- Added missing refund mock.

## Remaining

- Payment timeout test still failing.

## Last result

7 tests → 2 tests failing.

## Next move

Inspect payment retry handling.
```

The file becomes part of the agent's external memory.

Now if the context gets reset, the work does not magically vanish.

---

## Step 10: Add context retrieval

You can improve the context builder by retrieving only relevant code.

A simple first version doesn't even need a fancy vector database.

You can use repository search:

```ts
async function findRelevantFiles(query: string) {
  return await searchCode({
    query,
    paths: ["src", "tests", "docs"],
  });
}
```

Then:

```ts
const relevantFiles = await findRelevantFiles(
  "checkout payment retry timeout"
);
```

Now the model gets:

```text
src/checkout/service.ts
src/payments/retry.ts
tests/checkout/payment.test.ts
docs/payments.md
```

rather than 1,000 unrelated files.

This is often a better starting point than throwing a vector database at the problem because you haven't yet proved you need one.

---

## Step 11: Give the agent a "map"

Create a small repository-level guide:

```md
# AGENTS.md

## Start here

- Architecture → docs/architecture.md
- Testing → docs/testing.md
- API rules → docs/api.md
- Database → docs/database.md

## Important rules

- Never modify production infrastructure.
- Run typecheck before committing.
- Run relevant tests after code changes.
- Keep changes focused.
```

This is an incredibly cheap form of context engineering.

It also gives the agent a predictable way to discover more information.

---

## Step 12: Add a review pass

A surprisingly useful pattern is:

```text
Builder agent
      ↓
Writes code
      ↓
Tests
      ↓
Reviewer
      ↓
Pass?
 ├── yes → done
 └── no  → back to builder
```

The reviewer can have a different prompt:

```text
You are reviewing another agent's changes.

Check for:

1. Correctness
2. Security problems
3. Test coverage
4. Architecture violations
5. Unnecessary complexity

Do not modify code.

Return:
- pass
- fail
- exact reasons
```

This reduces the risk of one agent becoming convinced that its own work is perfect.

Self-confidence is not a quality metric.

---

## The complete implementation

Put it all together:

```diagram:full-stack
                         TASK
                           │
                           ▼
                  ┌────────────────┐
                  │   TASK STATE   │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │     LOOP       │
                  │                │
                  │ Choose action  │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │    CONTEXT     │
                  │                │
                  │ task           │
                  │ relevant code  │
                  │ progress       │
                  │ feedback       │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │     MODEL      │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │    POLICY      │
                  │                │
                  │ allowed?       │
                  └───────┬────────┘
                          │
                          ▼
                  ┌────────────────┐
                  │     TOOLS      │
                  │                │
                  │ files          │
                  │ shell          │
                  │ tests          │
                  │ git            │
                  └───────┬────────┘
                          │
                          ▼
                     ENVIRONMENT
                          │
                          ▼
                  ┌────────────────┐
                  │   EVALUATOR    │
                  │                │
                  │ tests          │
                  │ lint           │
                  │ typecheck      │
                  │ review         │
                  └───────┬────────┘
                          │
                 ┌────────┴────────┐
                 │                 │
               PASS              FAIL
                 │                 │
                 ▼                 ▼
                DONE          update state
                                   │
                                   ▼
                                  LOOP
```

That is a concrete agent architecture.

---

## A production-ready version

Once the basic system works, you can add more advanced pieces.

```diagram:production
                    ┌───────────────┐
                    │   Scheduler   │
                    └───────┬───────┘
                            │
                            ▼
                     ┌────────────┐
                     │ Task Queue │
                     └─────┬──────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  Orchestrator    │
                  └────────┬─────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        Research       Builder       Reviewer
          Agent         Agent          Agent
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Shared State
                           │
                    ┌──────┴───────┐
                    ▼              ▼
               Evaluators      Memory
                    │              │
                    └──────┬───────┘
                           ▼
                       Progress
                           │
                           ▼
                         Loop
```

At this point you're no longer building:

> "a chatbot with tools."

You're building an **agent runtime**.

---

## Where each engineering concern lives

Here's the practical mapping.

## Context engineering

Own these:

```text
Prompt/context assembly
Relevant-file retrieval
Documentation discovery
Memory retrieval
Compaction
State summaries
Sub-agent handoffs
```

---

## Harness engineering

Own these:

```text
Tools
Sandbox
Filesystem
Shell
Browser
Permissions
Secrets
Networking
Authentication
Logging
Tracing
Execution environment
Evaluation infrastructure
```

---

## Loop engineering

Own these:

```text
Task scheduling
Iteration
Retries
Checkpoints
Progress detection
Failure recovery
Stop conditions
Escalation
Budgets
Agent handoffs
```

---

## Metrics you should actually track

Once agents run for a while, vibes are not enough.

Track a few basic metrics.

## Task success rate

```text
successful tasks
──────────────────
total tasks
```

This is your north-star metric.

---

## Iterations per successful task

```text
total iterations
──────────────────
successful tasks
```

A lower number isn't always better, but a huge increase usually signals friction.

---

## Cost per successful task

```text
total model + tool cost
───────────────────────
successful tasks
```

This becomes critical when you have long-running loops.

---

## Human intervention rate

```text
tasks requiring humans
───────────────────────
total tasks
```

The entire point of autonomy is not to move work around while secretly requiring you to babysit the agent.

---

## Regression rate

Ask:

> How often did an agent "fix" one thing and break another?

This is where tests and independent review become incredibly valuable.

---

## The most useful debugging framework

When an agent fails, don't immediately change the prompt.

Ask:

### Did it know the right thing?

```text
NO
↓
Context problem
```

### Could it do the right thing?

```text
NO
↓
Harness problem
```

### Did it keep going intelligently?

```text
NO
↓
Loop problem
```

### Did we know whether it succeeded?

```text
NO
↓
Evaluation problem
```

That gives you a much better debugging tree than:

> "Maybe GPT needs a better prompt."

---

## A practical rollout strategy

Do **not** start with a fully autonomous swarm of 20 agents.

Start tiny.

## Stage 1 — Single agent

```text
Task
 ↓
Model
 ↓
One or two tools
 ↓
Result
```

Goal:

> Prove the task itself is solvable.

---

## Stage 2 — Add context engineering

```text
Task
 ↓
Relevant files
 ↓
Documentation
 ↓
Model
```

Goal:

> Stop the model from drowning in irrelevant information.

---

## Stage 3 — Add a harness

```text
Model
 ↓
Tools
 ↓
Sandbox
 ↓
Tests
 ↓
Logs
```

Goal:

> Give the model a reliable environment.

---

## Stage 4 — Add the loop

```text
Act
 ↓
Evaluate
 ↓
Fix
 ↓
Evaluate
 ↓
Repeat
```

Goal:

> Remove manual prompting from the workflow.

---

## Stage 5 — Add guardrails

```text
Permissions
Budgets
Timeouts
Approval
Escalation
```

Goal:

> Prevent the agent from becoming an expensive chaos machine.

---

## Stage 6 — Add reviewers or sub-agents

```text
Builder
   ↓
Reviewer
   ↓
Evaluator
```

Goal:

> Improve reliability without making the main context enormous.

---

## Stage 7 — Add parallelism

Only now consider:

```text
Research agent
+
Implementation agent
+
Testing agent
+
Review agent
```

Goal:

> Increase throughput.

Parallelism before basic reliability usually just gives you **more ways to fail at the same time**.

---

## The "minimum viable agent" blueprint

You can actually boil the whole thing down to this:

```text
INPUT:
"Fix checkout tests."

CONTEXT:
- task description
- relevant files
- progress notes
- latest test output

HARNESS:
- read file
- write file
- search code
- run tests
- git diff

POLICY:
- workspace only
- no secrets
- no production access

LOOP:
1. inspect
2. edit
3. test
4. inspect result
5. repeat

STOP:
- all tests pass
- 10 iterations reached
- no progress detected
- human approval required

OUTPUT:
- summary
- changed files
- test results
- unresolved issues
```

That's enough to build something genuinely useful.

You don't need a giant agent framework on day one.

---

## The most important implementation principle

Here is the rule I would keep on a sticky note:

> **Optimize the system around the model before optimizing the words you say to the model.**

If an agent repeatedly fails because it cannot find the right file, improve retrieval.

If it repeatedly breaks architecture, add an invariant or structural check.

If it keeps retrying forever, improve the loop.

If it cannot execute the task, improve the harness.

If it doesn't know what happened yesterday, improve state and memory.

Only then ask whether the prompt itself needs work.

---

# Putting everything together

We can now describe the entire stack with one example.

Suppose the task is:

```text
"Fix the payment timeout bug."
```

### Context

The agent receives:

```text
payment service code
+
retry code
+
relevant tests
+
architecture docs
+
latest failure
+
progress notes
```

### Harness

The agent gets:

```text
filesystem
+
terminal
+
tests
+
Git
+
logs
+
safe sandbox
```

### Loop

The system does:

```text
inspect
 ↓
edit
 ↓
run test
 ↓
inspect failure
 ↓
edit
 ↓
run test
 ↓
review
 ↓
done
```

### Policy

The agent is blocked from:

```text
production
+
secrets
+
protected infrastructure
```

### Evaluator

The system checks:

```text
unit tests
+
integration tests
+
type checking
+
lint
+
review
```

### Stop condition

The agent stops when:

```text
all acceptance checks pass
```

or:

```text
no progress
+
iteration limit
+
budget limit
+
human approval needed
```

That is the full thing.

And now the words stop sounding like buzzwords.

They become engineering responsibilities.

---

# One more thing: "loop engineering" is still a moving target

This is worth saying because the internet is currently very confident about a term that is still pretty new.

**Context engineering has a stronger and clearer body of production guidance.**

**Harness engineering also has substantial real-world usage.**

**Loop engineering is newer.**

The core idea is useful even while the terminology continues to evolve:

> **Automate the repeated decision → action → feedback cycle instead of requiring a human to manually drive every step.**

So don't get too attached to the label.

The architecture matters more than the buzzword.

---

# The future isn't "prompt harder"

The bigger shift is this:

```text
Old mindset:

How do I make the model answer better?


New mindset:

How do I build a system in which the model
can repeatedly make useful progress?
```

That is a much bigger question.

And it changes what engineering looks like.

The model matters.

But so does:

```text
what it sees
+
what it can access
+
what it is allowed to do
+
how it gets feedback
+
how it remembers
+
how it recovers
+
how it knows it is finished
```

That is why context, harness, and loop engineering matter.

---

# Final mental model

Don't overcomplicate it.

Remember these three questions:

```text
CONTEXT
"What does the agent need to know right now?"

HARNESS
"What can the agent do, and what controls surround it?"

LOOP
"What should happen next, and when should it stop?"
```

Or the ultra-simple version:

> **Context gives the agent the right information.**

> **The harness gives the agent the ability and boundaries to act.**

> **The loop gives the agent a way to keep moving toward the goal.**

Put all three together and you get something much more powerful than a chatbot.

You get an **agent system**.

And that's probably the real shift happening in AI engineering right now.

---

## TL;DR

```diagram:tldr
Prompt Engineering
        ↓
What should I say?


Context Engineering
        ↓
What should the model see?


Harness Engineering
        ↓
What should the model be able to do?


Loop Engineering
        ↓
How should the system keep working?


Agent Engineering
        ↓
How do all of these work together?
```

The prompt is no longer the whole product.

The **system around the model** is becoming the product.

And honestly?

That's where things are getting interesting.

## Sources

- Anthropic — *Effective context engineering for AI agents*
- Anthropic — *Building effective agents*
- Anthropic — *Effective harnesses for long-running agents*
- Anthropic — *Harness design for long-running application development*
- Anthropic — *Building a C compiler with a team of parallel Claudes*
- Anthropic — *Demystifying evals for AI agents*
- OpenAI — *Harness engineering: leveraging Codex in an agent-first world*
- Addy Osmani — *Loop Engineering*
- Lulla et al. — *Loop Engineering: Building Blocks, Adoption, and Impact*
- Zhang et al. — *Agentic Context Engineering*
- Ye et al. — *Meta Context Engineering via Agentic Skill Evolution*
