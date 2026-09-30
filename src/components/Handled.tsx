import { useState } from "react";
import { Ban, Check, Clock3, ShieldCheck } from "lucide-react";
import type { LogEntry, State } from "../engine/sim";
import { daysBetween, money, shortDate } from "../engine/format";

const ICONS = { bought: Check, ignored: ShieldCheck, blocked: Ban, decided: Clock3 };

export function Handled({ state }: { state: State }) {
  const [all, setAll] = useState(false);
  const thisWeek = state.log.filter((l) => daysBetween(l.date, state.today) < 7);
  const shown = all ? state.log : state.log.slice(0, 4);

  return (
    <section aria-labelledby="handled">
      <div className="zone-head">
        <h2 id="handled">Handled</h2>
        <span className="count">
          {thisWeek.length} {thisWeek.length === 1 ? "thing" : "things"} this week
        </span>
      </div>
      <ul className="handled">
        {shown.map((l) => (
          <Line key={l.id} entry={l} today={state.today} />
        ))}
      </ul>
      {state.log.length > 4 && (
        <button className="link-button more" onClick={() => setAll(!all)} aria-expanded={all}>
          {all ? "Show less" : `Show all ${state.log.length}`}
        </button>
      )}
    </section>
  );
}

function Line({ entry, today }: { entry: LogEntry; today: string }) {
  const Icon = ICONS[entry.kind];
  const when = entry.date === today ? "Today" : shortDate(entry.date);
  return (
    <li className={entry.kind}>
      <span className="mark" aria-hidden="true">
        <Icon size={16} strokeWidth={2} />
      </span>
      <span className="title">{entry.title}</span>
      <span className="amount">{entry.amount !== undefined ? money(entry.amount) : ""}</span>
      <span className="why">
        <span className="when">{when} · </span>
        {entry.detail}
      </span>
    </li>
  );
}
