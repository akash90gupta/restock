import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Ask, State } from "../engine/sim";
import { daysLeft, REORDER_AT_DAYS } from "../engine/sim";
import { addDays, shortDate } from "../engine/format";
import { useSuggestion } from "../ai/useSuggestion";

interface Props {
  state: State;
  onAnswer: (askId: string, optionId: string) => void;
}

const TEAR_MS = 300;

/** The top of the pad: one decision at a time, or the calm state. There is always a blank sheet underneath. */
export function Pad({ state, onAnswer }: Props) {
  const ask = state.asks[0];
  const next = state.asks[1];
  const [tearing, setTearing] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  const timer = useRef<number>(0);
  const padRef = useRef<HTMLElement>(null);
  const heightBefore = useRef<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Let the pad ease to its new height so the pantry below never jumps.
  useLayoutEffect(() => {
    const el = padRef.current;
    const from = heightBefore.current;
    heightBefore.current = null;
    if (!el || from === null) return;
    const to = el.offsetHeight;
    if (Math.abs(to - from) > 2 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 240, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }
  }, [ask?.id]);

  // After a tear, keyboard focus moves to the sheet that was revealed.
  useEffect(() => {
    if (focusKey) headingRef.current?.focus();
  }, [focusKey]);

  const choose = (a: Ask, optionId: string) => {
    if (tearing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTearing(a.id);
    timer.current = window.setTimeout(
      () => {
        heightBefore.current = padRef.current?.offsetHeight ?? null;
        onAnswer(a.id, optionId);
        setTearing(null);
        setFocusKey((k) => k + 1);
      },
      reduce ? 140 : TEAR_MS,
    );
  };

  const behind = Math.min(state.asks.length, 2); // at least one blank sheet always sits underneath

  return (
    <section className="pad" aria-labelledby="needs-you" aria-live="polite" ref={padRef}>
      <h2 id="needs-you" className="sr-only">
        Needs you
      </h2>
      <div className="magnet" aria-hidden="true" />
      <div className="under under-1" aria-hidden="true" />
      {behind >= 2 && <div className="under under-2" aria-hidden="true" />}

      {/* While a sheet tears away, the one beneath is already there. */}
      {tearing && (
        <div className="sheet beneath" aria-hidden="true" inert>
          {next ? <AskSheet ask={next} state={state} total={state.asks.length - 1} onChoose={() => {}} busy={false} /> : <Calm state={state} />}
        </div>
      )}

      <div key={ask ? ask.id : "calm"} className={`sheet ${tearing === ask?.id ? "tearing" : ""}`}>
        {ask ? (
          <AskSheet ask={ask} state={state} total={state.asks.length} onChoose={(o) => choose(ask, o)} busy={!!tearing} headingRef={headingRef} />
        ) : (
          <Calm state={state} headingRef={headingRef} />
        )}
      </div>
    </section>
  );
}

function AskSheet({
  ask,
  state,
  total,
  onChoose,
  busy,
  headingRef,
}: {
  ask: Ask;
  state: State;
  total: number;
  onChoose: (optionId: string) => void;
  busy: boolean;
  headingRef?: React.Ref<HTMLHeadingElement>;
}) {
  const suggestion = useSuggestion(ask, state);
  const picked = ask.options.find((o) => o.id === suggestion?.optionId);
  // The suggested answer goes first; the rest keep their order.
  const options = picked ? [picked, ...ask.options.filter((o) => o !== picked)] : ask.options;
  return (
    <>
      <h3 ref={headingRef} tabIndex={-1}>
        {ask.title}
      </h3>
      <p className="detail">{ask.detail}</p>
      {suggestion && picked && (
        <p className="suggest">
          <span className="suggest-head">Restock suggests: {picked.label.split(" · ")[0]}.</span> {suggestion.why}
          {suggestion.source === "sample" && <span className="suggest-source"> Sample reasoning.</span>}
        </p>
      )}
      <div className="answers">
        {options.map((o) => (
          <button key={o.id} className={`answer ${o === picked ? "primary" : ""}`} onClick={() => onChoose(o.id)} disabled={busy}>
            {o.label}
          </button>
        ))}
      </div>
      {total > 1 && (
        <p className="sheet-meta">
          {total - 1} more {total - 1 === 1 ? "decision" : "decisions"} under this one
        </p>
      )}
    </>
  );
}

function Calm({ state, headingRef }: { state: State; headingRef?: React.Ref<HTMLHeadingElement> }) {
  const next = state.items
    .filter((i) => !i.paused)
    .map((i) => ({ i, left: daysLeft(i, state.today) }))
    .sort((a, b) => a.left - b.left)[0];
  const on = next ? addDays(state.today, Math.max(next.left - REORDER_AT_DAYS, 1)) : null;
  return (
    <div className="calm">
      <h3 ref={headingRef} tabIndex={-1}>
        Everything's stocked.
      </h3>
      {next && on && (
        <p>
          Next up: {next.i.name.toLowerCase()}, around {shortDate(on)}.
        </p>
      )}
    </div>
  );
}
