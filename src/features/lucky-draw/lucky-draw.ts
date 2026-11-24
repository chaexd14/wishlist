import { useMemo, useSyncExternalStore } from "react";
import { z } from "zod";

export const LUCKY_DRAW_KEY = "wish-journal-lucky-draw-v1";
export const LUCKY_DRAW_CHANGE_EVENT = "wish-journal-lucky-draw-change";
export const LUCKY_DRAW_OPEN_EVENT = "wish-journal-lucky-draw-open";

export type LuckyDrawGame = "claw" | "cups";

const luckyDrawSchema = z.object({
  stage: z.enum(["locked", "needs-code", "has-ticket", "choose-game", "playing", "out-of-tries", "won"]),
  game: z.enum(["claw", "cups"]).optional(),
  triesLeft: z.number().int().min(0).max(10).optional(),
  prizeId: z.string().optional(),
  wonAt: z.string().optional(),
});

export type LuckyDrawState = {
  stage: "locked" | "needs-code" | "choose-game" | "playing" | "out-of-tries" | "won";
  game?: LuckyDrawGame;
  triesLeft?: number;
  prizeId?: string;
  wonAt?: string;
};

const DEFAULT_STATE: LuckyDrawState = { stage: "locked" };

function parseState(raw: string | null): LuckyDrawState {
  if (!raw) return DEFAULT_STATE;
  try {
    const parsed = luckyDrawSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return DEFAULT_STATE;
    const data = parsed.data;
    // Migrate legacy "has-ticket" cleanly to "choose-game"
    if (data.stage === "has-ticket") return { stage: "choose-game" };
    return data as LuckyDrawState;
  } catch {
    return DEFAULT_STATE;
  }
}

function getSnapshot(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(LUCKY_DRAW_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot(): string {
  return "";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LUCKY_DRAW_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LUCKY_DRAW_CHANGE_EVENT, onStoreChange);
  };
}

export function readLuckyDrawState(): LuckyDrawState {
  return parseState(getSnapshot());
}

function writeLuckyDrawState(next: LuckyDrawState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LUCKY_DRAW_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors if blocked.
  }
  window.dispatchEvent(new Event(LUCKY_DRAW_CHANGE_EVENT));
}

export function openLuckyDrawModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LUCKY_DRAW_OPEN_EVENT, { detail: true }));
}

export function closeLuckyDrawModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(LUCKY_DRAW_OPEN_EVENT, { detail: false }));
}

export function triggerLuckyDrawIfFirstTime() {
  const current = readLuckyDrawState();
  if (current.stage !== "locked") return false;
  writeLuckyDrawState({ stage: "needs-code" });
  openLuckyDrawModal();
  return true;
}

export function grantLuckyDrawTicket() {
  const current = readLuckyDrawState();
  if (current.stage === "won") return;
  writeLuckyDrawState({ stage: "choose-game" });
}

export function selectLuckyDrawGame(game: LuckyDrawGame) {
  const current = readLuckyDrawState();
  if (current.stage !== "choose-game") return;
  writeLuckyDrawState({
    stage: "playing",
    game,
    triesLeft: game === "claw" ? 5 : 3,
  });
}

export function consumeLuckyDrawTry(): number {
  const current = readLuckyDrawState();
  if (current.stage !== "playing") return 0;
  const remaining = Math.max(0, (current.triesLeft ?? 1) - 1);
  if (remaining <= 0) {
    writeLuckyDrawState({ stage: "out-of-tries", game: current.game, triesLeft: 0 });
  } else {
    writeLuckyDrawState({ ...current, triesLeft: remaining });
  }
  return remaining;
}

export function requestLuckyDrawRematch() {
  const current = readLuckyDrawState();
  if (current.stage === "won") return;
  writeLuckyDrawState({ stage: "needs-code" });
}

export function recordLuckyDrawWin(prizeId: string) {
  const current = readLuckyDrawState();
  if (current.stage === "won" && current.prizeId) return;
  writeLuckyDrawState({ stage: "won", game: current.game, prizeId, wonAt: new Date().toISOString() });
}

export function useLuckyDrawState(): LuckyDrawState {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => parseState(raw), [raw]);
}
