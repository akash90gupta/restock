import { useState, type ReactNode } from "react";
import { Bug, ChevronDown, FastForward, MessageSquareWarning, RotateCcw, TrendingUp, X } from "lucide-react";
import type { Attack } from "../engine/sim";
import { longDate } from "../engine/format";

interface Props {
  today: string;
  policyOn: boolean;
  narration: ReactNode;
  short: ReactNode;
  onSkip: () => void;
  onAttack: (a: Attack) => void;
  onReset: () => void;
  onDismiss: () => void;
}

const ATTACKS: { id: Attack; icon: typeof Bug; title: string; body: string }[] = [
  { id: "seller_note", icon: MessageSquareWarning, title: "A listing that gives orders", body: "The dish soap listing tells AI assistants to buy three more." },
  { id: "price_spike", icon: TrendingUp, title: "A 40% price jump", body: "Dog food gets expensive overnight, right when it's due." },
  { id: "break_agent", icon: Bug, title: "Break the agent", body: "Switch the rules engine off. Only the spend lock is left." },
];

function Attacks({ onAttack, onReset, policyOn }: Pick<Props, "onAttack" | "onReset" | "policyOn">) {
  return (
    <div className="drawer">
      {ATTACKS.map(({ id, icon: Icon, title, body }) => (
        <button key={id} className="attack" onClick={() => onAttack(id)} disabled={id === "break_agent" && !policyOn}>
          <Icon size={18} strokeWidth={2} aria-hidden="true" />
          <strong>{id === "break_agent" && !policyOn ? "Agent is broken" : title}</strong>
          <span>{body}</span>
        </button>
      ))}
      <button className="attack" onClick={onReset}>
        <RotateCcw size={18} strokeWidth={2} aria-hidden="true" />
        <strong>Start over</strong>
        <span>Back to Monday, October 5.</span>
      </button>
    </div>
  );
}

/** Phone: a slim bar fixed to the bottom, with a drawer. */
export function DemoBar(props: Props) {
  const [open, setOpen] = useState(false);
  return (
    <aside className="demo demo-bar" aria-label="Demo controls">
      {open && (
        <>
          <Attacks
            {...props}
            onAttack={(a) => {
              props.onAttack(a);
              setOpen(false);
            }}
            onReset={() => {
              props.onReset();
              setOpen(false);
            }}
          />
        </>
      )}
      {props.short && (
        <div className="narration-line">
          <p>{props.short}</p>
          <button className="dismiss" onClick={props.onDismiss} aria-label="Dismiss">
            <X size={16} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="demo-row">
        <span className="demo-label">
          Demo
          <small>Sample data</small>
        </span>
        <button className="demo-btn" onClick={props.onSkip}>
          <FastForward size={16} strokeWidth={2} aria-hidden="true" /> Skip a week
        </button>
        <button className="demo-btn strong" onClick={() => setOpen(!open)} aria-expanded={open}>
          Try to break it <ChevronDown size={16} strokeWidth={2.2} aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none" }} />
        </button>
      </div>
    </aside>
  );
}

/** Desktop: a panel beside the phone column. */
export function DemoPanel(props: Props) {
  return (
    <aside className="demo demo-panel" aria-label="Demo controls">
      <h2>
        Demo <small>{longDate(props.today)}</small>
      </h2>
      <p className="about">
        A sample household with 16 things it rebuys. The agent proposes each purchase, a rules engine decides, and a separate spend lock checks every order. When a question lands on the pad, AI suggests an answer, but you tap it. Nothing is really bought.
      </p>
      <button className="demo-btn strong" onClick={props.onSkip}>
        <FastForward size={16} strokeWidth={2} aria-hidden="true" /> Skip ahead a week
      </button>
      <p className="section-label">Try to break it</p>
      <Attacks {...props} />
      {props.narration && <p className="narration">{props.narration}</p>}
    </aside>
  );
}
