export type StoreId = "bayside" | "everyday" | "petpantry";

export interface Item {
  id: string;
  name: string; // what you'd write on the list: "Coffee"
  product: string; // the exact thing you buy
  store: StoreId;
  price: number; // usual price, last paid
  intervalDays: number; // how long one purchase lasts
  lastBought: string; // ISO date
  neverSubstitute?: boolean;
  paused?: boolean;
}

export interface Listing {
  itemId: string;
  product: string;
  store: StoreId;
  price: number;
  inStock: boolean;
  restockDate?: string;
  isSubstitute: boolean;
  qty: number;
  sellerNote?: string;
}

export interface Rules {
  monthlyCap: number;
  pricePct: number; // buy alone if within this % of last price
  askBefore: { substitutes: boolean; newStores: boolean; biggerQuantities: boolean };
  perPurchaseLimit: number; // enforced by the spend lock, not the policy
}

export type Tier = "alone" | "ask" | "never";

export type AskKind = "out_of_stock" | "price" | "substitute" | "over_cap";

export interface Decision {
  tier: Tier;
  reason: string;
  ask?: AskKind;
}

export interface LockResult {
  ok: boolean;
  reason: string;
}
