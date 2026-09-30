import { useState } from "react";
import type { State } from "../engine/sim";
import { daysLeft } from "../engine/sim";
import { money, shortDate } from "../engine/format";
import { STORES } from "../data/household";
import type { Item } from "../engine/types";

interface Props {
  state: State;
  onItem: (itemId: string, patch: Partial<Pick<Item, "neverSubstitute" | "paused">>) => void;
}

/** Five ink densities and three weights: supply is drawn, never color-coded. */
function gaugeStyle(left: number, interval: number) {
  const ratio = Math.max(0, Math.min(1, left / interval));
  const weight = left <= 3 ? 3 : left <= 7 ? 2 : 1;
  const density = ratio <= 0.2 ? 1 : ratio <= 0.4 ? 0.82 : ratio <= 0.6 ? 0.66 : ratio <= 0.8 ? 0.5 : 0.36;
  return { transform: `scaleX(${Math.max(ratio, 0.015)})`, height: `${weight}px`, opacity: density };
}

export function Pantry({ state, onItem }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const rows = state.items
    .map((item) => ({ item, left: daysLeft(item, state.today) }))
    .sort((a, b) => a.left - b.left || a.item.name.localeCompare(b.item.name));

  return (
    <section aria-labelledby="pantry">
      <div className="zone-head">
        <h2 id="pantry">Pantry</h2>
        <span className="count">{state.items.length} things you rebuy</span>
      </div>
      <ul className="pantry">
        {rows.map(({ item, left }) => {
          const asked = state.asks.some((a) => a.itemId === item.id);
          const waitingUntil = state.waiting[item.id];
          const isOpen = open === item.id;
          let status: { text: string; cls: string };
          if (item.paused) status = { text: "Paused", cls: "muted" };
          else if (asked) status = { text: "Needs you", cls: "flag" };
          else if (waitingUntil && waitingUntil > state.today) status = { text: `Waiting, ${shortDate(waitingUntil)}`, cls: "muted" };
          else if (left <= 0) status = { text: "Out", cls: "" };
          else status = { text: `${left} ${left === 1 ? "day" : "days"}`, cls: "" };

          return (
            <li key={item.id}>
              <button className="row-button" aria-expanded={isOpen} aria-controls={`detail-${item.id}`} onClick={() => setOpen(isOpen ? null : item.id)}>
                <span className="row-name">{item.name}</span>
                <span className={`row-days ${status.cls}`}>{status.text}</span>
                <span className="row-sub">
                  {item.product.split(",")[0]} · {STORES[item.store]}
                </span>
              </button>
              <div className="gauge" aria-hidden="true">
                <span style={gaugeStyle(left, item.intervalDays)} />
              </div>
              {isOpen && (
                <div className="row-detail" id={`detail-${item.id}`}>
                  <p>
                    {item.product}. Lasts about {item.intervalDays} days. Last bought {shortDate(item.lastBought)} for {money(item.price)} at {STORES[item.store]}.
                  </p>
                  <label className="switch">
                    <span>Never substitute this</span>
                    <input type="checkbox" role="switch" checked={!!item.neverSubstitute} onChange={(e) => onItem(item.id, { neverSubstitute: e.target.checked })} />
                  </label>
                  <label className="switch">
                    <span>Pause reorders</span>
                    <input type="checkbox" role="switch" checked={!!item.paused} onChange={(e) => onItem(item.id, { paused: e.target.checked })} />
                  </label>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
