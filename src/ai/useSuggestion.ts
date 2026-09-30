import { useEffect, useState } from "react";
import type { Ask, State } from "../engine/sim";
import { liveEnabled, liveSuggestion, sampleSuggestion, type Suggestion } from "./suggest";

const cache = new Map<string, Suggestion>();

/** Sample reasoning immediately; replaced by Claude's when a local key is set. */
export function useSuggestion(ask: Ask | undefined, state: State): Suggestion | null {
  const [live, setLive] = useState<Suggestion | null>(ask ? (cache.get(ask.id) ?? null) : null);

  useEffect(() => {
    setLive(ask ? (cache.get(ask.id) ?? null) : null);
    if (!ask || !liveEnabled || cache.has(ask.id)) return;
    let cancelled = false;
    liveSuggestion(ask, state)
      .then((s) => {
        if (s) cache.set(ask.id, s);
        if (!cancelled && s) setLive(s);
      })
      .catch(() => {}); // any failure keeps the sample reasoning
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ask?.id]);

  if (!ask) return null;
  return live ?? sampleSuggestion(ask, state);
}
