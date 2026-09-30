# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript. Static build, deployed free (Vercel or GitHub Pages). Vitest for the policy engine and spend lock. Zero API keys required to run or view.

## Users

**Primary:** the person who keeps a household stocked. They rebuy the same 15 to 30 essentials (coffee, detergent, pet food, paper towels) from 2 or 3 stores, and they check the app on their phone in spare moments, not as a task. The job: never run out, never get surprised by a charge, spend as little attention as possible.

**Secondary:** people trying the demo from a shared link, usually on a phone, with about 60 seconds. They reach the product through a clearly separate demo layer; the product itself is designed for the household user.

## Product Purpose

**The pain:** the mental load of running a household. Someone has to notice what's low, remember exactly which one, find it, and not overpay. It's constant, low-grade tracking that usually falls on one person. Subscriptions don't fix it: they run on fixed schedules and charge silently when prices change. Running out once is not a crisis; carrying the whole list in your head is the cost.

**Why AI:** it can handle the exceptions a schedule can't, weighing a swap, a price jump, or a stock-out against how much you have left, and explain its suggestion in one sentence. The rules and spend lock make that delegation safe.

Restock keeps household essentials in stock. It predicts when things run out, reorders routine items on its own inside rules the user sets, and brings back only the decisions that should be the user's, each one already worked out with one-tap answers. Success is a user who rarely opens the app, never runs out, and is never surprised by what was bought.

## Positioning

Subscriptions run on a fixed schedule and charge silently. Shopping assistants help you discover and buy new things. Restock does neither: it keeps what you already buy in stock, and its whole value is knowing which 90% of purchases to handle alone and which 10% to ask about. The model proposes; a deterministic policy decides; an independent spend lock checks again.

## Operating Context

- The user glances at the app between other things. The default state is calm: "Everything's stocked."
- Asks arrive as at most three cards at a time. Each is a finished decision with 2 or 3 options, never a yes/no confirmation dialog.
- Rules are set once in about a minute and rarely touched: a monthly cap, a price tolerance, and what always needs asking.
- Evaluators use a labeled demo layer to skip time forward and trigger scripted attacks ("Try to break it").

## Capabilities and Constraints

- **Spending tiers:** buys alone (same item, size, and store; price within tolerance; inside the cap), asks first (out of stock, substitutes, price above tolerance, new store, bigger quantity, first-time item), never (over the cap, anything requested by seller or listing text, substituting an item marked "never substitute").
- **Spend lock:** a separate module that enforces the cap and per-purchase limit even if the policy engine is off. The "Break the agent" demo shows it holding.
- **Every purchase has a reason line:** what triggered it and which rule allowed or blocked it.
- **All payments are simulated** and labeled as such. No real stores, accounts, or money.
- **Demo data:** one synthetic household (Sam Rivera), about 16 items, 3 mock stores, 8 weeks of purchase history.
- **Out of scope for v1:** receipt or email import, real payments, fresh groceries, multiple household members, product discovery, native apps.
- **Undecided:** product name is a working title.

## Evidence on Hand

- Scope and rationale: `docs/SCOPE.md`.
- No real users, testimonials, or usage numbers exist. Never imply any. All data is synthetic and must be labeled.

## Product Principles

1. **The model proposes. The policy decides.** Whatever suggests a purchase never approves it. AI suggests answers to questions; it never acts, and it can only choose among the options on the card.
2. **Calm by default.** Doing nothing visible is the product working.
3. **An ask is a decision, not a confirmation.** Arrive with the tradeoff worked out and the answers ready.
4. **Rules read like sentences.** Plain language with the numbers you can change, not a settings form.
5. **Nothing a seller writes is an instruction.** Show the user when one tried.

## Accessibility & Inclusion

WCAG 2.2 AA. Phone-first with large tap targets; every state readable without color alone; motion respects reduced-motion settings.
