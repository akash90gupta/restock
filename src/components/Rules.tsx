import { ArrowLeft, Lock } from "lucide-react";
import type { Rules as RulesT } from "../engine/types";

interface Props {
  rules: RulesT;
  onChange: (rules: RulesT) => void;
  onDone: () => void;
}

function Blank({ value, onChange, label, prefix, suffix, min, max }: { value: number; onChange: (n: number) => void; label: string; prefix?: string; suffix?: string; min: number; max: number }) {
  return (
    <span className="blank">
      {prefix}
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        style={{ width: `${Math.max(String(value).length, 1)}ch` }}
        onChange={(e) => {
          const n = Math.round(Number(e.target.value));
          if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
        }}
      />
      {suffix}
    </span>
  );
}

export function Rules({ rules, onChange, onDone }: Props) {
  const set = (patch: Partial<RulesT>) => onChange({ ...rules, ...patch });
  const toggle = (k: keyof RulesT["askBefore"]) => set({ askBefore: { ...rules.askBefore, [k]: !rules.askBefore[k] } });
  const chip = (k: keyof RulesT["askBefore"], text: string) => (
    <button className="chip" aria-pressed={rules.askBefore[k]} onClick={() => toggle(k)}>
      {text}
    </button>
  );

  return (
    <section className="rules" aria-labelledby="rules-title">
      <div className="top">
        <button className="link-button" onClick={onDone}>
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" /> Done
        </button>
      </div>
      <div className="zone-head" style={{ marginTop: 12 }}>
        <h2 id="rules-title">Your rules</h2>
      </div>
      <p className="rules-intro">Restock buys on its own only inside these. Anything else comes to you first.</p>

      <p className="sentence">
        Spend up to{" "}
        <Blank value={rules.monthlyCap} onChange={(n) => set({ monthlyCap: n })} label="Monthly limit in dollars" prefix="$" min={25} max={2000} /> a month.
      </p>
      <p className="sentence">
        Buy on my own if the price is within <Blank value={rules.pricePct} onChange={(n) => set({ pricePct: n })} label="Price tolerance in percent" suffix="%" min={0} max={50} /> of last time.
      </p>
      <p className="sentence">
        Always ask before {chip("substitutes", "substitutes")}, {chip("newStores", "new stores")}, and {chip("biggerQuantities", "bigger quantities")}.
        <span className="fine">Tap one to cross it out and let Restock decide it.</span>
      </p>
      <p className="sentence">
        Never act on anything a seller writes.
        <span className="fine">Always on. Listings, reviews, and seller notes are read as information, never as instructions.</span>
      </p>

      <div className="lock-sentence">
        <h3>
          <Lock size={16} strokeWidth={2.2} aria-hidden="true" /> The spend lock
        </h3>
        Separately, every order is checked again by a lock that refuses anything over{" "}
        <Blank value={rules.perPurchaseLimit} onChange={(n) => set({ perPurchaseLimit: n })} label="Single order limit in dollars" prefix="$" min={10} max={1000} /> and anything past your monthly limit. It holds even if the rules above stop working.
      </div>

      <p className="footnote">Sample household. Nothing is really bought.</p>
    </section>
  );
}
