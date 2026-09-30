import { describe, expect, it } from "vitest";
import { decide } from "./policy";
import { authorize } from "./spendLock";
import { advance, answer, attack, daysLeft, initialState, repair, spentThisMonth } from "./sim";
import { DEFAULT_RULES, ITEMS } from "../data/household";
import type { Listing } from "./types";

const coffee = ITEMS.find((i) => i.id === "coffee")!;
const usual = (patch: Partial<Listing> = {}): Listing => ({
  itemId: "coffee",
  product: coffee.product,
  store: coffee.store,
  price: coffee.price,
  inStock: true,
  isSubstitute: false,
  qty: 1,
  ...patch,
});

// One test per row of the spending policy (SPENDING_POLICY.md).
describe("policy: buys alone", () => {
  it("same item, same store, same price", () => {
    expect(decide(coffee, usual(), DEFAULT_RULES, 0).tier).toBe("alone");
  });
  it("price up but within tolerance", () => {
    expect(decide(coffee, usual({ price: 21.45 }), DEFAULT_RULES, 0).tier).toBe("alone"); // exactly +10%
  });
});

describe("policy: asks first", () => {
  it("out of stock", () => {
    expect(decide(coffee, usual({ inStock: false }), DEFAULT_RULES, 0)).toMatchObject({ tier: "ask", ask: "out_of_stock" });
  });
  it("any substitute", () => {
    expect(decide(coffee, usual({ isSubstitute: true }), DEFAULT_RULES, 0).tier).toBe("ask");
  });
  it("price above tolerance", () => {
    expect(decide(coffee, usual({ price: 21.5 }), DEFAULT_RULES, 0)).toMatchObject({ tier: "ask", ask: "price" });
  });
  it("new store", () => {
    expect(decide(coffee, usual({ store: "everyday" }), DEFAULT_RULES, 0).tier).toBe("ask");
  });
  it("bigger quantity", () => {
    expect(decide(coffee, usual({ qty: 2 }), DEFAULT_RULES, 0).tier).toBe("ask");
  });
  it("turning off 'ask before substitutes' lets a substitute through", () => {
    const rules = { ...DEFAULT_RULES, askBefore: { ...DEFAULT_RULES.askBefore, substitutes: false } };
    expect(decide(coffee, usual({ isSubstitute: true }), rules, 0).tier).toBe("alone");
  });
});

describe("policy: never", () => {
  it("over the monthly limit", () => {
    expect(decide(coffee, usual(), DEFAULT_RULES, 290)).toMatchObject({ tier: "never", ask: "over_cap" });
  });
  it("anything a seller's note asks for", () => {
    expect(decide(coffee, usual(), DEFAULT_RULES, 0, true).tier).toBe("never");
  });
  it("a substitute for an item marked never-substitute, even if substitutes are allowed", () => {
    const rules = { ...DEFAULT_RULES, askBefore: { ...DEFAULT_RULES.askBefore, substitutes: false } };
    expect(decide({ ...coffee, neverSubstitute: true }, usual({ isSubstitute: true }), rules, 0).tier).toBe("never");
  });
});

describe("spend lock", () => {
  const limits = { monthlyCap: 300, perPurchaseLimit: 100 };
  it("allows a purchase inside both limits", () => expect(authorize(50, 100, limits).ok).toBe(true));
  it("blocks a single order over the per-order limit", () => expect(authorize(100.01, 0, limits).ok).toBe(false));
  it("blocks anything that passes the monthly limit", () => expect(authorize(20, 290, limits).ok).toBe(false));
  it("allows landing exactly on the limit", () => expect(authorize(10, 290, limits).ok).toBe(true));
  it("rejects nonsense amounts", () => {
    expect(authorize(-5, 0, limits).ok).toBe(false);
    expect(authorize(Number.NaN, 0, limits).ok).toBe(false);
  });
});

describe("the demo household", () => {
  it("opens with exactly one decision: the coffee", () => {
    const s = initialState();
    expect(s.asks).toHaveLength(1);
    expect(s.asks[0]).toMatchObject({ itemId: "coffee", kind: "out_of_stock" });
  });

  it("waiting for the coffee reorders it automatically when it's back", () => {
    let s = initialState();
    s = answer(s, s.asks[0].id, "wait");
    s = advance(s, 7);
    const bought = s.log.find((l) => l.kind === "bought" && l.title === "Reordered coffee");
    expect(bought?.date).toBe("2026-10-11");
  });

  it("an unanswered out-of-stock question clears itself when the usual item is back", () => {
    const s = advance(initialState(), 7);
    expect(s.asks.some((a) => a.itemId === "coffee")).toBe(false);
    expect(s.log.find((l) => l.title === "Reordered coffee")?.date).toBe("2026-10-11");
  });

  it("choosing the substitute buys it once, through the lock", () => {
    let s = initialState();
    const before = spentThisMonth(s);
    s = answer(s, s.asks[0].id, "alt0");
    expect(spentThisMonth(s)).toBeCloseTo(before + 22, 2);
    expect(daysLeft(s.items.find((i) => i.id === "coffee")!, s.today)).toBe(13); // 1 day left + a new 12-day bag
  });

  it("buying early never shortens the cycle: oat milk is bought about every 7 days", () => {
    let s = initialState();
    s = advance(s, 28);
    const oat = s.log.filter((l) => l.title === "Reordered oat milk" && l.date > "2026-10-05");
    expect(oat.length).toBe(4);
  });

  it("a month of skipping ahead never passes the limit and never piles up more than three asks", () => {
    let s = initialState();
    for (let w = 0; w < 4; w++) {
      s = advance(s, 7);
      expect(s.asks.length).toBeLessThanOrEqual(3);
      for (const total of Object.values(s.spent)) expect(total).toBeLessThanOrEqual(s.rules.monthlyCap);
    }
  });

  it("ignores a seller's note and buys the usual one", () => {
    const s = attack(initialState(), "seller_note");
    expect(s.log[1]).toMatchObject({ kind: "ignored" });
    expect(s.log[0]).toMatchObject({ kind: "bought", title: "Reordered dish soap", amount: 4.29 });
  });

  it("turns a 40% price jump into a question", () => {
    const s = attack(initialState(), "price_spike");
    expect(s.asks.find((a) => a.itemId === "dogfood")).toMatchObject({ kind: "price" });
  });

  it("with the rules engine off, the spend lock still holds the month at the limit", () => {
    const s = attack(initialState(), "break_agent");
    expect(s.policyOn).toBe(false);
    expect(spentThisMonth(s)).toBeLessThanOrEqual(300);
    expect(s.log.some((l) => l.kind === "blocked" && l.title.includes("coffee"))).toBe(true); // $174 single order
    expect(repair(s).policyOn).toBe(true);
  });
});
