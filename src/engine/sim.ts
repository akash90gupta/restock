import {
  ALTERNATIVES,
  DEFAULT_RULES,
  ITEMS,
  RECKLESS_ORDERS,
  SELLER_NOTE,
  START_DATE,
  STORES,
  listingFor,
  type CatalogOverrides,
} from "../data/household";
import { decide } from "./policy";
import { authorize } from "./spendLock";
import { addDays, daysBetween, money, monthName, monthOf, shortDate } from "./format";
import type { AskKind, Item, Listing, Rules } from "./types";

export const REORDER_AT_DAYS = 3;
export const MAX_ASKS = 3;

const firstOfNextMonth = (date: string) => `${monthOf(addDays(`${monthOf(date)}-28`, 5))}-01`;

export interface AskOption {
  id: string;
  label: string;
}

export interface Ask {
  id: string;
  itemId: string;
  kind: AskKind;
  title: string;
  detail: string;
  options: AskOption[];
  listings: Record<string, Listing>;
}

export type LogKind = "bought" | "ignored" | "blocked" | "decided";

export interface LogEntry {
  id: string;
  date: string;
  kind: LogKind;
  title: string;
  detail: string;
  amount?: number;
}

export interface Notice {
  title: string;
  detail: string;
}

export interface State {
  today: string;
  items: Item[];
  rules: Rules;
  overrides: CatalogOverrides;
  spent: Record<string, number>; // by month, "2026-10"
  asks: Ask[];
  log: LogEntry[]; // newest first
  waiting: Record<string, string>; // itemId -> don't check again before this date
  policyOn: boolean;
  notice?: Notice;
  seq: number;
}

// ---------------------------------------------------------------- helpers

export const daysLeft = (item: Item, today: string) => item.intervalDays - daysBetween(item.lastBought, today);

export const spentThisMonth = (s: State) => s.spent[monthOf(s.today)] ?? 0;

const nextId = (s: State, prefix: string) => `${prefix}${++s.seq}`;

const clone = (s: State): State => ({
  ...s,
  items: s.items.map((i) => ({ ...i })),
  rules: { ...s.rules, askBefore: { ...s.rules.askBefore } },
  overrides: { prices: { ...s.overrides.prices }, notes: { ...s.overrides.notes } },
  spent: { ...s.spent },
  asks: [...s.asks],
  log: [...s.log],
  waiting: { ...s.waiting },
});

const itemById = (s: State, id: string) => s.items.find((i) => i.id === id)!;

function log(s: State, entry: Omit<LogEntry, "id" | "date">) {
  s.log.unshift({ id: nextId(s, "l"), date: s.today, ...entry });
}

/** Every purchase, from any path, goes through the spend lock. */
function purchase(s: State, item: Item, listing: Listing, why: string): boolean {
  const total = listing.price * listing.qty;
  const lock = authorize(total, spentThisMonth(s), s.rules);
  if (!lock.ok) {
    log(s, { kind: "blocked", title: `Stopped: ${item.name.toLowerCase()}`, detail: `Spend lock. ${lock.reason}`, amount: total });
    return false;
  }
  const m = monthOf(s.today);
  s.spent[m] = Math.round(((s.spent[m] ?? 0) + total) * 100) / 100;
  // The new supply starts when the current one runs out, so buying early never shortens the cycle.
  item.lastBought = addDays(s.today, Math.max(daysLeft(item, s.today), 0));
  if (!listing.isSubstitute) item.price = listing.price;
  delete s.waiting[item.id];
  log(s, {
    kind: "bought",
    title: listing.isSubstitute ? `${item.name}: ${listing.product}` : `Reordered ${item.name.toLowerCase()}`,
    detail: why,
    amount: total,
  });
  return true;
}

// ---------------------------------------------------------------- the agent's daily check

function askFor(s: State, item: Item, listing: Listing, kind: AskKind, reason: string): Ask {
  const id = nextId(s, "a");
  if (kind === "out_of_stock") {
    const alts = ALTERNATIVES[item.id] ?? [];
    const listings: Record<string, Listing> = {};
    const options: AskOption[] = [];
    if (listing.restockDate) {
      options.push({ id: "wait", label: "Wait for it" });
    }
    alts.forEach((alt, i) => {
      listings[`alt${i}`] = alt;
      options.push({ id: `alt${i}`, label: `${alt.product.split(",")[0]}${alt.product.includes("2 lb") ? ", 2 lb" : ""} · ${money(alt.price)}` });
    });
    const left = Math.max(daysLeft(item, s.today), 0);
    return {
      id,
      itemId: item.id,
      kind,
      title: `Your usual ${item.name.toLowerCase()} is out of stock.`,
      detail: `${item.product.split(",")[0]} is back ${listing.restockDate ? shortDate(listing.restockDate) : "soon"}. You have about ${left} ${left === 1 ? "day" : "days"} left.`,
      options,
      listings,
    };
  }
  if (kind === "price") {
    return {
      id,
      itemId: item.id,
      kind,
      title: `${item.name} went up to ${money(listing.price)}.`,
      detail: `${reason} Last time it was ${money(item.price)} at ${STORES[item.store]}.`,
      options: [
        { id: "buy", label: `Buy at ${money(listing.price)}` },
        { id: "later", label: "Check again in 3 days" },
      ],
      listings: { buy: listing },
    };
  }
  // over_cap
  const need = spentThisMonth(s) + listing.price * listing.qty;
  const raised = Math.ceil(need / 25) * 25;
  return {
    id,
    itemId: item.id,
    kind,
    title: `${item.name} would put ${monthName(s.today)} over your limit.`,
    detail: `${reason}`,
    options: [
      { id: "raise", label: `Raise ${monthName(s.today)}'s limit to ${money(raised)}` },
      { id: "nextmonth", label: `Wait until ${monthName(addDays(`${monthOf(s.today)}-28`, 5))} 1` },
    ],
    listings: { raise: listing },
  };
}

function checkItem(s: State, item: Item) {
  if (item.paused) return;
  if (daysLeft(item, s.today) > REORDER_AT_DAYS) return;
  if (s.waiting[item.id] && s.waiting[item.id] > s.today) return;

  const listing = listingFor(item, s.today, s.overrides);

  // An open question goes stale when the world answers it: the usual item is back.
  const open = s.asks.find((a) => a.itemId === item.id);
  if (open) {
    if (open.kind !== "out_of_stock" || !listing.inStock) return;
    s.asks = s.asks.filter((a) => a !== open);
  }

  if (listing.sellerNote) {
    // What the note asks for is evaluated like any request, and seller text never qualifies.
    const asked = decide(item, { ...listing, qty: 3 }, s.rules, spentThisMonth(s), true);
    log(s, {
      kind: "ignored",
      title: `Ignored a note in the ${item.name.toLowerCase()} listing`,
      detail: `It said: "${listing.sellerNote}" ${asked.reason}`,
    });
  }

  if (!s.policyOn) {
    if (listing.inStock) purchase(s, item, listing, "Rules engine off. Approved only by the spend lock.");
    return;
  }

  const d = decide(item, listing, s.rules, spentThisMonth(s));
  if (d.tier === "alone") {
    purchase(s, item, listing, d.reason);
  } else if (d.ask) {
    const capAskOpen = d.ask === "over_cap" && s.asks.some((a) => a.kind === "over_cap");
    if (capAskOpen || s.asks.length >= MAX_ASKS) {
      // Never pile up questions: hold this one and look again tomorrow (or next month, for the limit).
      s.waiting[item.id] = d.ask === "over_cap" ? firstOfNextMonth(s.today) : addDays(s.today, 1);
      if (d.ask === "over_cap") log(s, { kind: "blocked", title: `Held ${item.name.toLowerCase()} for next month`, detail: d.reason });
      return;
    }
    s.asks.push(askFor(s, item, listing, d.ask, d.reason));
  } else {
    log(s, { kind: "blocked", title: `Didn't buy ${item.name.toLowerCase()}`, detail: d.reason });
  }
}

function runDay(s: State) {
  // A new month resets the limit, so any "over your limit" question is moot.
  if (s.today.endsWith("-01")) s.asks = s.asks.filter((a) => a.kind !== "over_cap");
  for (const item of s.items) checkItem(s, item);
}

// ---------------------------------------------------------------- public actions

export function initialState(): State {
  const s: State = {
    today: START_DATE,
    items: ITEMS.map((i) => ({ ...i })),
    rules: { ...DEFAULT_RULES, askBefore: { ...DEFAULT_RULES.askBefore } },
    overrides: { prices: {}, notes: {} },
    spent: {},
    asks: [],
    log: [],
    waiting: {},
    policyOn: true,
    seq: 0,
  };
  // Last week's routine purchases, reconstructed from the purchase history.
  const recent = s.items
    .filter((i) => daysBetween(i.lastBought, START_DATE) <= 7)
    .sort((a, b) => a.lastBought.localeCompare(b.lastBought));
  for (const i of recent) {
    s.log.unshift({
      id: nextId(s, "l"),
      date: i.lastBought,
      kind: "bought",
      title: `Reordered ${i.name.toLowerCase()}`,
      detail: "Usual item, usual store, same price.",
      amount: i.price,
    });
    const m = monthOf(i.lastBought);
    s.spent[m] = Math.round(((s.spent[m] ?? 0) + i.price) * 100) / 100;
  }
  runDay(s);
  return s;
}

export function advance(prev: State, days: number): State {
  const s = clone(prev);
  for (let i = 0; i < days; i++) {
    s.today = addDays(s.today, 1);
    runDay(s);
  }
  return s;
}

export function answer(prev: State, askId: string, optionId: string): State {
  const s = clone(prev);
  const ask = s.asks.find((a) => a.id === askId);
  if (!ask) return prev;
  s.asks = s.asks.filter((a) => a.id !== askId);
  const item = itemById(s, ask.itemId);
  const listing = ask.listings[optionId];

  if (optionId === "wait") {
    const back = listingFor(item, s.today, s.overrides).restockDate ?? addDays(s.today, 3);
    s.waiting[item.id] = back;
    log(s, { kind: "decided", title: `Waiting for your usual ${item.name.toLowerCase()}`, detail: `You chose to wait. I'll order it when it's back ${shortDate(back)}.` });
  } else if (optionId === "later") {
    s.waiting[item.id] = addDays(s.today, 3);
    log(s, { kind: "decided", title: `Held off on ${item.name.toLowerCase()}`, detail: `You chose to wait. I'll check the price again ${shortDate(s.waiting[item.id])}.` });
  } else if (optionId === "nextmonth") {
    s.waiting[item.id] = firstOfNextMonth(s.today);
    log(s, { kind: "decided", title: `Held ${item.name.toLowerCase()} for next month`, detail: `You chose to stay under this month's limit.` });
  } else if (optionId === "raise" && listing) {
    const need = spentThisMonth(s) + listing.price * listing.qty;
    s.rules.monthlyCap = Math.ceil(need / 25) * 25;
    purchase(s, item, listing, `You raised ${monthName(s.today)}'s limit to ${money(s.rules.monthlyCap)}.`);
  } else if (listing) {
    purchase(s, item, listing, `You chose this.`);
  }
  return s;
}

export function setRules(prev: State, rules: Rules): State {
  const s = clone(prev);
  s.rules = { ...rules, askBefore: { ...rules.askBefore } };
  return s;
}

export function setItem(prev: State, itemId: string, patch: Partial<Pick<Item, "neverSubstitute" | "paused">>): State {
  const s = clone(prev);
  Object.assign(itemById(s, itemId), patch);
  return s;
}

/** Make an item due for a reorder today, as if it just ran low. */
function makeDue(s: State, itemId: string) {
  const item = itemById(s, itemId);
  item.lastBought = addDays(s.today, -(item.intervalDays - 2));
  delete s.waiting[itemId];
}

export type Attack = "seller_note" | "price_spike" | "break_agent";

export function attack(prev: State, kind: Attack): State {
  const s = clone(prev);
  if (kind === "seller_note") {
    s.overrides.notes.dishsoap = SELLER_NOTE;
    makeDue(s, "dishsoap");
    checkItem(s, itemById(s, "dishsoap"));
    delete s.overrides.notes.dishsoap;
  } else if (kind === "price_spike") {
    const dog = itemById(s, "dogfood");
    s.overrides.prices.dogfood = Math.round(dog.price * 1.4 * 100) / 100;
    makeDue(s, "dogfood");
    checkItem(s, dog);
  } else {
    s.policyOn = false;
    const before = spentThisMonth(s);
    let tried = 0;
    let stoppedCount = 0;
    let stoppedTotal = 0;
    for (const o of RECKLESS_ORDERS) {
      const item = itemById(s, o.itemId);
      const listing: Listing = { itemId: o.itemId, product: o.product, store: item.store, price: o.price, inStock: true, isSubstitute: true, qty: o.qty };
      tried += o.price * o.qty;
      if (!purchase(s, item, listing, "Rules engine off. Approved only by the spend lock.")) {
        stoppedCount++;
        stoppedTotal += o.price * o.qty;
      }
    }
    const spentNow = spentThisMonth(s);
    s.notice = {
      title: "The rules engine is off.",
      detail: `The agent tried ${RECKLESS_ORDERS.length} bulk orders worth ${money(tried)}. The spend lock stopped ${stoppedCount} of them (${money(stoppedTotal)}). ${monthName(s.today)} went from ${money(before)} to ${money(spentNow)}, and can't pass ${money(s.rules.monthlyCap)}.`,
    };
  }
  return s;
}

export function repair(prev: State): State {
  const s = clone(prev);
  s.policyOn = true;
  s.notice = undefined;
  return s;
}
