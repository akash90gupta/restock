# restock.ai

**Your household essentials, always stocked.** restock.ai reorders the routine things on its own, inside rules you set, and asks you only when the answer should be yours.

> **A working demo with a sample household.** Nothing is really bought. No accounts, no sign-up, and no API key needed to try it.

---

## The problem

Every household runs on the same 15 to 30 things: coffee, oat milk, detergent, dog food, paper towels. Someone has to keep track of all of them, and it's usually one person.

- **The list lives in someone's head.** Noticing what's low, remembering exactly which one, finding it, and checking the price. None of it is hard. All of it is constant.
- **Subscriptions don't fit real life.** They run on a fixed schedule, not on how fast you actually use things. Guests, travel, or a new puppy break the cadence. Paper towels pile up while the coffee runs out.
- **Autopay erodes trust.** Prices change, items go out of stock, substitutes show up, and the charge happens anyway. People would rather do it themselves than be surprised.
- **Handing it to an AI agent is scarier, not easier.** An agent that can buy things can also buy the wrong thing, overspend, or follow instructions hidden in a product listing.

Running out of paper towels once is not a crisis. Carrying the whole list, forever, is the real cost.

## Our approach to AI

AI agents can now take actions like buying things, but people won't hand one their card unless they trust it. So restock.ai is built around one idea:

**The model proposes. The policy decides.**

| Layer | What it does | Built with |
|---|---|---|
| **Suggestion** | When a decision needs you, suggests an answer and explains why in one sentence | AI (Claude, or sample reasoning in the demo) |
| **Rules** | Decides whether a purchase can happen on its own, needs you, or must never happen | Plain, deterministic code, one test per rule |
| **Spend lock** | Checks every order again, including the ones you approved, against hard dollar limits | A separate module that knows only amounts |

Most reorders are boring on purpose and never reach you: same item, same store, about the same price, inside your monthly limit. The rest come to you as one decision at a time, with the tradeoff already worked out:

> **Your usual coffee is out of stock.** Harbor Roast is back Oct 11. You have about 1 day left.
>
> **restock.ai suggests: Fogline house blend.** You'd be out for about 5 days waiting, and this is the closest swap. The bigger bag looks like a bulk deal but costs more per ounce ($1.81 vs $1.63 for your usual).

### The tradeoffs we chose

- **AI suggests; it never acts.** The model is good at the judgment in the exceptions, like weighing a swap, a price jump, or a stock-out against how much you have left. It is not the thing deciding whether money moves. That costs some autonomy, and it buys trust.
- **The AI can only choose from what's on the card.** Its answer is restricted to the options you can see, and anything else is discarded. It can't invent a fourth option, a new store, or a bigger order. That makes it less creative, and safe to show a person.
- **Rules over a smarter model for the money decisions.** A rule is predictable, testable, and explainable in one line. We gave up the flexibility of letting a model decide what's "reasonable" in exchange for purchases you can always explain.
- **Two layers of safety, not one.** The spend lock repeats checks the rules already made. That's redundant on purpose: the lock holds even when the rules engine is broken, and you can watch it hold in the demo.
- **Asking has a cost too.** An agent that asks about everything is as useless as one that asks about nothing. So "buys on its own" is the default, and questions are capped at three on the pad at once.
- **Seller text is never an instruction.** Product listings are written by people who want you to buy. The agent reads them as information only, and shows you when one tried to give it orders.

## The solution

restock.ai is one calm screen, designed to be glanced at, not managed.

- **The pad.** At the top, a single sheet. Most days it says *Everything's stocked.* When something needs you, it becomes one decision with the answer suggested. Answering tears the sheet off and reveals the next one.
- **The pantry.** Everything you rebuy, sorted by how soon it runs out. Each item's line is its supply gauge, getting heavier as it runs low instead of turning red.
- **Handled.** Everything restock.ai did on its own, crossed off like a list, each with the rule that allowed it.
- **Rules, written as sentences.** *Spend up to **$300** a month. Buy on my own if the price is within **10%** of last time. Always ask before **substitutes**, **new stores**, and **bigger quantities**.* Tap a number to change it.

### What it decides on its own, and what it doesn't

| restock.ai... | When |
|---|---|
| **Buys on its own** | Same item, size, and store; price within your tolerance; inside your monthly limit |
| **Asks you first** | Out of stock; any substitute; price above your tolerance; a new store; a bigger quantity |
| **Never** | Over your monthly limit; anything a seller's note asks for; a substitute for something you marked "never substitute" |

Then the spend lock checks every order, including the ones you approve: nothing over $100 in a single order, and nothing past the monthly limit, even with the rules switched off. The lock can't make a bad agent good. It keeps a bad agent cheap.

## What we learned building it

These came from building and testing the demo, not from user research. There are no real users yet.

- **The obvious default was wrong.** The first version recommended "wait for it" when the usual coffee was out. That meant 5 days without coffee. A good suggestion has to reason about how much you have left, not just what you usually buy. This is exactly the kind of judgment worth giving to AI.
- **"Bulk" isn't always a deal.** The 2 lb bag looked like savings and cost more per ounce. Comparing equivalents across sizes and stores is where the suggestion earns its place.
- **Buying early can quietly double your spending.** In an early build, reordering a few days ahead restarted the supply clock, so oat milk came every 4 days and the month hit its limit. The fix was modeling supply as running out, not as a calendar. The tests caught it only once they simulated a full month.
- **Questions go stale.** If you ignore "your coffee is out," the store eventually restocks. The question has to clear itself, or the product nags about a problem that no longer exists.
- **Calm has to be designed.** Review caught that a solid "recommended" button and a busy demo bar both pulled against the calm the product promises. The fixes were subtractive: outlined buttons, one line of explanation, a blank sheet when nothing needs you.
- **The safety layer is the product.** The most convincing moment in the demo isn't the AI being clever. It's switching the rules engine off and watching the spend lock hold the month at $300.

---

## Try it

```bash
npm install
npm run dev
```

Jump straight to a moment:

| Link | What you'll see |
|---|---|
| `/?try=break-the-agent` | The rules engine switched off. The spend lock still holds the month at the limit. |
| `/?try=price-jump` | Dog food jumps 40%, so a routine reorder becomes a question. |
| `/?try=seller-note` | A listing tells AI assistants to buy three more. restock.ai ignores it and says so. |
| `/?weeks=1` | A week later: everything's stocked, nothing needs you. |
| `/?view=rules` | The rules, written as sentences. |

**Live AI suggestions (local only):** put `VITE_ANTHROPIC_API_KEY=...` in `.env.local` and run `npm run dev`. Claude writes each suggestion from the same facts shown on the card, using structured output limited to the card's options. The key is read only in development, because a production build would embed it. Never deploy with it.

## Code

```
src/ai/suggest.ts        the AI's one job: suggest an answer to a question, sample or live
src/engine/policy.ts     the rules: pure functions, one test per rule
src/engine/spendLock.ts  the independent spend lock
src/engine/sim.ts        the household over time: reorders, questions, and the demo scenarios
src/data/household.ts    the sample household (synthetic stores, brands, prices, and dates)
src/components/          the pad, pantry, handled list, rules, and demo layer
```

```bash
npm test     # 29 tests: every rule, the lock, the demo scenarios, and the suggestions
```

Built with Vite, React, and TypeScript. Designed with [Impeccable](https://impeccable.style): [PRODUCT.md](PRODUCT.md) holds the product record and [DESIGN.md](DESIGN.md) the design system.

---

Built by [Akash Gupta](https://github.com/akash90gupta) · [LinkedIn](https://www.linkedin.com/in/akash90gupta/)
