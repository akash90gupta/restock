import type { Ask, State } from "../engine/sim";
import { daysLeft } from "../engine/sim";
import { addDays, daysBetween, money, monthName, monthOf } from "../engine/format";
import { listingFor } from "../data/household";

/**
 * The AI's one job in Restock: when a question lands on the pad, suggest an
 * answer and say why in one sentence.
 *
 * It can only pick one of the options already on the card, and it never acts.
 * The person taps, and the purchase still goes through the policy and the
 * spend lock like any other. The model proposes; the policy decides.
 */
export interface Suggestion {
  optionId: string;
  why: string;
  source: "sample" | "claude";
}

// ---------------------------------------------------------------- facts the model reasons over

const ounces = (product: string) => {
  const lb = product.match(/(\d+(?:\.\d+)?)\s*lb/i);
  if (lb) return Number(lb[1]) * 16;
  const oz = product.match(/(\d+(?:\.\d+)?)\s*oz/i);
  return oz ? Number(oz[1]) : null;
};

const perOunce = (price: number, product: string) => {
  const oz = ounces(product);
  return oz ? price / oz : null;
};

export function facts(ask: Ask, state: State) {
  const item = state.items.find((i) => i.id === ask.itemId)!;
  const left = Math.max(daysLeft(item, state.today), 0);
  const listing = listingFor(item, state.today, state.overrides);
  const runsOut = addDays(state.today, left);
  const daysWithout = listing.restockDate ? Math.max(daysBetween(runsOut, listing.restockDate), 0) : 0;
  const usualPerOz = perOunce(item.price, item.product);
  const options = ask.options.map((o) => {
    const l = ask.listings[o.id];
    return { id: o.id, label: o.label, price: l ? l.price * l.qty : undefined, perOunce: l ? perOunce(l.price, l.product) : null };
  });
  const monthEnd = addDays(`${monthOf(addDays(`${monthOf(state.today)}-28`, 5))}-01`, -1);
  return {
    item: { name: item.name, product: item.product, usualPrice: item.price, usualPerOunce: usualPerOz, lastsDays: item.intervalDays },
    today: state.today,
    daysLeft: left,
    restockDate: listing.restockDate,
    daysWithoutIfWaiting: daysWithout,
    daysUntilNextMonth: daysBetween(state.today, monthEnd) + 1,
    monthSpent: state.spent[monthOf(state.today)] ?? 0,
    monthlyLimit: state.rules.monthlyCap,
    question: ask.title,
    detail: ask.detail,
    options,
  };
}

// ---------------------------------------------------------------- sample reasoning (the keyless demo)

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

export function sampleSuggestion(ask: Ask, state: State): Suggestion {
  const f = facts(ask, state);
  const sample = (optionId: string, why: string): Suggestion => ({ optionId, why, source: "sample" });

  if (ask.kind === "out_of_stock") {
    if (f.daysWithoutIfWaiting <= 0 && ask.options.some((o) => o.id === "wait")) {
      return sample("wait", "Your usual is back before you run out, so waiting costs nothing.");
    }
    const alts = f.options.filter((o) => o.id !== "wait" && o.price !== undefined);
    // Closest match first: the same size as usual, then the lowest price per ounce.
    const usualOz = ounces(f.item.product);
    const sameSize = alts.find((o) => ounces(ask.listings[o.id].product) === usualOz);
    const pick = sameSize ?? alts.sort((a, b) => (a.perOunce ?? 99) - (b.perOunce ?? 99))[0];
    const bulk = alts.find((o) => o !== pick && (ounces(ask.listings[o.id].product) ?? 0) > (usualOz ?? 0));
    let why = `You'd be out for about ${plural(f.daysWithoutIfWaiting, "day")} waiting, and this is the closest swap.`;
    if (bulk?.perOunce && f.item.usualPerOunce && bulk.perOunce > f.item.usualPerOunce) {
      why += ` The bigger bag looks like a bulk deal but costs more per ounce (${money(bulk.perOunce)} vs ${money(f.item.usualPerOunce)} for your usual).`;
    }
    return sample(pick.id, why);
  }

  if (ask.kind === "price") {
    const buy = f.options.find((o) => o.id === "buy");
    if (f.daysLeft <= 3 && buy?.price) {
      const extra = buy.price - f.item.usualPrice;
      return sample("buy", `You have ${plural(f.daysLeft, "day")} left, so checking again in 3 days means running out. It's ${money(extra)} more, this once.`);
    }
    return sample("later", `You have ${plural(f.daysLeft, "day")} left, so there's time to see if the price comes back down.`);
  }

  // over_cap
  if (f.daysLeft >= f.daysUntilNextMonth) {
    return sample("nextmonth", `You have ${plural(f.daysLeft, "day")} left and ${monthName(f.today)} ends in ${plural(f.daysUntilNextMonth, "day")}, so it can wait for the new month.`);
  }
  return sample("raise", `You'd run out before ${monthName(addDays(f.today, f.daysUntilNextMonth))} starts, so raising the limit once is the smaller cost.`);
}

// ---------------------------------------------------------------- live reasoning (your own key, local only)

/**
 * Only in local development, and only with VITE_ANTHROPIC_API_KEY in .env.local.
 * Never set this key for a production build: Vite would embed it in the bundle.
 */
const liveKey = import.meta.env.DEV ? (import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined) : undefined;
export const liveEnabled = Boolean(liveKey);

export async function liveSuggestion(ask: Ask, state: State): Promise<Suggestion | null> {
  if (!liveKey) return null;
  const [{ default: Anthropic }, { z }, { zodOutputFormat }] = await Promise.all([
    import("@anthropic-ai/sdk"),
    import("zod"),
    import("@anthropic-ai/sdk/helpers/zod"),
  ]);
  const ids = ask.options.map((o) => o.id) as [string, ...string[]];
  const Schema = z.object({ optionId: z.enum(ids), why: z.string() });

  const client = new Anthropic({ apiKey: liveKey, dangerouslyAllowBrowser: true });
  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 2000,
    system:
      "You help one household decide a single question about restocking an essential item. " +
      "Pick exactly one of the given options and explain why in one plain sentence under 30 words, " +
      "using only the numbers provided. Never invent prices, dates, or facts. Plain language, no jargon.",
    messages: [{ role: "user", content: JSON.stringify(facts(ask, state), null, 2) }],
    output_config: { format: zodOutputFormat(Schema) },
  });
  if (response.stop_reason === "refusal") return null;
  const out = response.parsed_output;
  // The model may only choose among the card's options.
  if (!out || !ids.includes(out.optionId)) return null;
  return { optionId: out.optionId, why: out.why, source: "claude" };
}
