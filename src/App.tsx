import { useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Pad } from "./components/Pad";
import { Pantry } from "./components/Pantry";
import { Handled } from "./components/Handled";
import { Rules } from "./components/Rules";
import { DemoBar, DemoPanel } from "./components/Demo";
import { advance, answer, attack, initialState, repair, setItem, setRules, spentThisMonth, type Attack, type State } from "./engine/sim";
import { longDate, money, monthName } from "./engine/format";

const SHORT: Record<Attack, ReactNode> = {
  seller_note: <><b>Seller text is data,</b> never an instruction.</>,
  price_spike: <><b>Past your 10% rule,</b> so it became a question.</>,
  break_agent: <><b>The lock can't make a bad agent good.</b> It keeps a bad agent cheap.</>,
};

const NARRATION: Record<Attack, ReactNode> = {
  seller_note: (
    <>
      <b>The listing told the agent to buy three more.</b> Seller text is data, never an instruction, so Restock bought the usual one and logged what it ignored under Handled.
    </>
  ),
  price_spike: (
    <>
      <b>Dog food jumped 40%.</b> That's past the 10% rule, so a routine reorder became a question on the pad instead of a surprise charge.
    </>
  ),
  break_agent: (
    <>
      <b>The rules engine is off.</b> The agent tried to buy everything in bulk. The spend lock doesn't know about items or reasons, only amounts, so it stopped every order over the single-order limit and everything past the monthly limit. The lock can't make a bad agent good. It keeps a bad agent cheap.
    </>
  ),
};

// Shareable demo links: ?try=break-the-agent, ?try=price-jump, ?try=seller-note, ?weeks=2, ?view=rules
const LINKS: Record<string, Attack> = { "seller-note": "seller_note", "price-jump": "price_spike", "break-the-agent": "break_agent" };

function fromUrl(): { state: State; view: "home" | "rules"; narration: ReactNode; short: ReactNode } {
  const q = new URLSearchParams(window.location.search);
  let state = initialState();
  const weeks = Math.min(Math.max(Number(q.get("weeks")) || 0, 0), 8);
  if (weeks) state = advance(state, weeks * 7);
  const tried = LINKS[q.get("try") ?? ""];
  if (tried) state = attack(state, tried);
  return { state, view: q.get("view") === "rules" ? "rules" : "home", narration: tried ? NARRATION[tried] : null, short: tried ? SHORT[tried] : null };
}

export default function App() {
  const [initial] = useState(fromUrl);
  const [state, setState] = useState<State>(initial.state);
  const [view, setView] = useState<"home" | "rules">(initial.view);
  const [narration, setNarration] = useState<ReactNode>(initial.narration);
  const [short, setShort] = useState<ReactNode>(initial.short);

  const spent = spentThisMonth(state);
  const cap = state.rules.monthlyCap;

  const onSkip = () => {
    const before = state.log.length;
    const next = advance(state, 7);
    const handled = next.log.length - before;
    const newAsks = next.asks.filter((a) => !state.asks.some((b) => b.id === a.id)).length;
    setState(next);
    setView("home");
    const text = (
      <>
        <b>A week went by.</b> Restock handled {handled} {handled === 1 ? "thing" : "things"} on its own
        {newAsks ? ` and left ${newAsks} ${newAsks === 1 ? "question" : "questions"} on the pad.` : ". Nothing needed you."}
      </>
    );
    setNarration(text);
    setShort(text);
  };

  const demoProps = {
    today: state.today,
    policyOn: state.policyOn,
    narration,
    short,
    onSkip,
    onAttack: (a: Attack) => {
      setState(attack(state, a));
      setView("home");
      setNarration(NARRATION[a]);
      setShort(SHORT[a]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onDismiss: () => setShort(null),
    onReset: () => {
      setState(initialState());
      setView("home");
      setNarration(null);
      setShort(null);
    },
  };

  return (
    <div className="frame">
      <main className="app">
        {view === "rules" ? (
          <Rules rules={state.rules} onChange={(r) => setState(setRules(state, r))} onDone={() => setView("home")} />
        ) : (
          <>
            <header>
              <div className="top">
                <div>
                  <h1 className="wordmark">Restock</h1>
                  <p className="today">{longDate(state.today)}</p>
                </div>
                <button className="link-button" onClick={() => setView("rules")}>
                  <SlidersHorizontal size={17} strokeWidth={2} aria-hidden="true" /> Rules
                </button>
              </div>
              <div className="budget">
                <p className="budget-line">
                  <span>
                    <strong>{money(spent)}</strong> of {money(cap)} in {monthName(state.today)}
                  </span>
                  <span>{money(Math.max(cap - spent, 0))} left</span>
                </p>
                <div className="gauge" role="img" aria-label={`${Math.round((spent / cap) * 100)}% of this month's limit used`}>
                  <span style={{ transform: `scaleX(${Math.min(spent / cap, 1)})`, height: 2 }} />
                </div>
              </div>
            </header>

            <Pad state={state} onAnswer={(askId, optionId) => setState(answer(state, askId, optionId))} />

            {state.notice && (
              <section className="notice" aria-live="polite">
                <div className="magnet" aria-hidden="true" />
                <h3>{state.notice.title}</h3>
                <p>{state.notice.detail}</p>
                <button
                  className="answer primary"
                  onClick={() => {
                    setState(repair(state));
                    setNarration(<><b>Rules back on.</b> Routine reorders go through the policy again, and the lock keeps checking every order.</>);
                    setShort(<><b>Rules back on.</b></>);
                  }}
                >
                  Turn the rules back on
                </button>
              </section>
            )}

            <Pantry state={state} onItem={(id, patch) => setState(setItem(state, id, patch))} />
            <Handled state={state} />
          </>
        )}
      </main>
      <DemoPanel {...demoProps} />
      <DemoBar {...demoProps} />
    </div>
  );
}
