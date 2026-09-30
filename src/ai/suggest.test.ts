import { describe, expect, it } from "vitest";
import { sampleSuggestion, facts } from "./suggest";
import { attack, initialState } from "../engine/sim";

describe("suggestions", () => {
  it("coffee: doesn't suggest waiting when that means days without coffee", () => {
    const s = initialState();
    const ask = s.asks[0];
    const f = facts(ask, s);
    expect(f.daysWithoutIfWaiting).toBe(5);
    const sug = sampleSuggestion(ask, s);
    expect(sug.optionId).toBe("alt0"); // the same-size swap
    expect(sug.why).toContain("5 days");
  });

  it("coffee: catches that the 'bulk' bag costs more per ounce", () => {
    const s = initialState();
    const sug = sampleSuggestion(s.asks[0], s);
    expect(sug.why).toContain("more per ounce ($1.81 vs $1.63");
  });

  it("price jump with 2 days left: buy this once rather than run out", () => {
    const s = attack(initialState(), "price_spike");
    const ask = s.asks.find((a) => a.itemId === "dogfood")!;
    expect(sampleSuggestion(ask, s).optionId).toBe("buy");
  });

  it("every suggestion is one of the card's own options", () => {
    const s = attack(initialState(), "price_spike");
    for (const ask of s.asks) {
      expect(ask.options.map((o) => o.id)).toContain(sampleSuggestion(ask, s).optionId);
    }
  });
});
