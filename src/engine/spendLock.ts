import type { LockResult } from "./types";
import { money } from "./format";

/**
 * The spend lock. Deliberately separate from the policy: it knows nothing
 * about items, stores, or reasons, only amounts. Every purchase goes through
 * it, including ones the user approved, and it holds even when the policy
 * engine is switched off.
 */
export function authorize(
  amount: number,
  spentThisMonth: number,
  limits: { monthlyCap: number; perPurchaseLimit: number },
): LockResult {
  if (!(amount > 0) || !Number.isFinite(amount)) {
    return { ok: false, reason: "Invalid amount." };
  }
  if (amount > limits.perPurchaseLimit) {
    return { ok: false, reason: `${money(amount)} is over the ${money(limits.perPurchaseLimit)} single-order limit.` };
  }
  if (spentThisMonth + amount > limits.monthlyCap + 0.005) {
    return { ok: false, reason: `Would pass the ${money(limits.monthlyCap)} monthly limit.` };
  }
  return { ok: true, reason: "Within limits." };
}
