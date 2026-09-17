## Agentic commerce infrastructure

Sellable is a commerce layer built for AI buyers. Agents discover products through machine-readable endpoints, request and negotiate quotes, clear deterministic policy checks, issue single-use consent, pay over real payment rails, and leave a complete audit trail behind.

The core design rule: pricing rules, spend limits, consent, order state, payment verification, and audit logging all live outside the LLM. The model can propose an action, but it never decides whether that action is allowed.

## How a transaction flows

- Discovery through agent manifests, llms.txt, and a machine-readable catalog
- Bounded quote negotiation between LangGraph seller and buyer agents
- Policy engine verdicts on budget, floor price, stock, and negotiation rounds
- Single-use consent, human-in-the-loop approval for high-value orders
- Razorpay test-mode payment with webhook reconciliation and refunds
- Every material action recorded in the append-only XAI Ledger

## What this proves

- Agentic commerce with deterministic guardrails around non-deterministic models
- Real payment rails with idempotency, reconciliation, and refund support
- Evaluation-driven development with 7 deterministic transaction scenarios
