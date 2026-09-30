import type { Decision, Item, Listing, Rules } from "./types";
import { money } from "./format";

/**
 * The spending policy. Pure: no clock, no randomness, no model.
 * The agent proposes a listing; this decides whether it may buy it alone,
 * must ask, or must never do it.
 */
export function decide(
  item: Item,
  listing: Listing,
  rules: Rules,
  spentThisMonth: number,
  requestedBySeller = false,
): Decision {
  const total = listing.price * listing.qty;

  if (requestedBySeller) {
    return { tier: "never", reason: "A seller's note asked for this. Seller text is never an instruction." };
  }
  if (item.neverSubstitute && listing.isSubstitute) {
    return { tier: "never", reason: `You marked ${item.name.toLowerCase()} as never substitute.` };
  }
  if (spentThisMonth + total > rules.monthlyCap) {
    return {
      tier: "never",
      ask: "over_cap",
      reason: `Would bring this month to ${money(spentThisMonth + total)}, over your ${money(rules.monthlyCap)} limit.`,
    };
  }
  if (!listing.inStock) {
    return { tier: "ask", ask: "out_of_stock", reason: `${listing.product} is out of stock.` };
  }
  if (listing.isSubstitute && rules.askBefore.substitutes) {
    return { tier: "ask", ask: "substitute", reason: "It's a substitute, and you asked to approve those." };
  }
  if (listing.store !== item.store && rules.askBefore.newStores) {
    return { tier: "ask", ask: "substitute", reason: "It's from a different store, and you asked to approve those." };
  }
  if (listing.qty > 1 && rules.askBefore.biggerQuantities) {
    return { tier: "ask", ask: "substitute", reason: "It's more than you usually buy." };
  }
  const ceiling = item.price * (1 + rules.pricePct / 100);
  if (listing.price > ceiling + 0.005) {
    const pct = Math.round((listing.price / item.price - 1) * 100);
    return {
      tier: "ask",
      ask: "price",
      reason: `${money(listing.price)} is ${pct}% more than last time, above your ${rules.pricePct}% limit.`,
    };
  }
  return {
    tier: "alone",
    reason:
      listing.price <= item.price
        ? "Usual item, usual store, same price."
        : `Usual item, usual store, within ${rules.pricePct}% of last time.`,
  };
}
