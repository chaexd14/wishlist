"use client";

import { Doodle, toast } from "@plop-ui/react";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { JournalButton, JournalHeading, JournalSheet, JournalTag, JournalTextField } from "@/components/journal";
import { ClawMachineGame } from "@/components/storefront/claw-machine-game";
import { CupShuffleGame } from "@/components/storefront/cup-shuffle-game";
import { getLuckyDrawPrize, type LuckyDrawPrize } from "@/content/lucky-draw";
import {
  consumeLuckyDrawTry,
  grantLuckyDrawTicket,
  LUCKY_DRAW_OPEN_EVENT,
  recordLuckyDrawWin,
  requestLuckyDrawRematch,
  selectLuckyDrawGame,
  useLuckyDrawState,
} from "@/features/lucky-draw/lucky-draw";

export function LuckyDrawModal() {
  const state = useLuckyDrawState();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [gameBusy, setGameBusy] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const onOpenEvent = (event: Event) => {
      const custom = event as CustomEvent<boolean>;
      setOpen(Boolean(custom.detail));
    };
    window.addEventListener(LUCKY_DRAW_OPEN_EVENT, onOpenEvent);
    return () => window.removeEventListener(LUCKY_DRAW_OPEN_EVENT, onOpenEvent);
  }, []);

  const close = useCallback(() => {
    if (gameBusy) return;
    setOpen(false);
  }, [gameBusy]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verifying) return;
    const trimmed = code.trim();
    if (!trimmed) {
      setCodeError("Enter the secret code I sent you first!");
      return;
    }
    setVerifying(true);
    setCodeError("");
    try {
      const response = await fetch("/api/lucky-draw/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok) {
        setCodeError(result.error || "Hmm, that code didn't unlock the ticket—try again!");
        return;
      }
      setCode("");
      grantLuckyDrawTicket();
      toast.success("1 Lucky Draw ticket unlocked! Pick your game!", { buddy: "congrats", burst: "hearts" });
    } catch {
      setCodeError("Couldn't check the code just now—give it one more try!");
    } finally {
      setVerifying(false);
    }
  }

  const handleWin = useCallback((prize: LuckyDrawPrize) => {
    recordLuckyDrawWin(prize.id);
    toast.success(`You won: ${prize.title}!`, { buddy: "congrats", burst: "hearts" });
  }, []);

  const handleMiss = useCallback(() => {
    consumeLuckyDrawTry();
  }, []);

  if (!open || state.stage === "locked") return null;

  const wonPrize = getLuckyDrawPrize(state.prizeId);
  const triesLeft = state.triesLeft ?? 0;

  return (
    <div
      className="handmade-notice-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lucky-draw-title"
    >
      <JournalSheet
        tape="mustard"
        spacing="roomy"
        className={`lucky-draw-dialog${state.stage === "playing" || state.stage === "choose-game" ? " lucky-draw-dialog--wide" : ""}`}
      >
        {state.stage === "needs-code" && (
          <>
            <div className="lucky-draw-dialog__head">
              <Doodle kind="sparkle" tone="mustard" size={68} />
              <JournalTag tone="bubblegum" seed="lucky-tag">Surprise unlocked!</JournalTag>
              <JournalHeading id="lucky-draw-title" level={2} size="section">
                You unlocked a Lucky Draw!
              </JournalHeading>
            </div>
            <p className="lucky-draw-dialog__copy">
              Since you picked a gift, you get a shot at winning <strong>1 of 3 surprise prizes</strong>!
              First, complete one tiny quest: <strong>message me (the developer!)</strong> and ask for your secret ticket code.
            </p>

            <form className="lucky-draw-form" onSubmit={verifyCode} noValidate>
              <JournalTextField
                id="lucky-draw-code"
                label="Secret ticket code"
                placeholder="Enter the code I sent you"
                value={code}
                error={codeError || undefined}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (codeError) setCodeError("");
                }}
              />
              <div className="lucky-draw-actions">
                <JournalButton type="submit" intent="romantic" size="md" disabled={verifying} seed="lucky-claim-ticket">
                  {verifying ? "Checking your code…" : "Claim my 1 ticket"}
                </JournalButton>
                <button type="button" className="welcome-text-button" onClick={close}>
                  I&apos;ll enter it later
                </button>
              </div>
            </form>
          </>
        )}

        {state.stage === "choose-game" && (
          <>
            <div className="lucky-draw-dialog__head">
              <JournalTag tone="mint" seed="lucky-ticket-tag">1 Lucky Ticket Ready</JournalTag>
              <JournalHeading id="lucky-draw-title" level={2} size="section">
                Pick your challenge!
              </JournalHeading>
            </div>
            <p className="lucky-draw-dialog__copy">
              Spend your ticket on <strong>one</strong> mini-game to try winning 1 of 3 surprise prizes. Choose wisely!
            </p>

            <div className="lucky-draw-choices">
              <article className="lucky-game-card">
                <JournalTag tone="bubblegum" seed="choice-claw">5 Tries</JournalTag>
                <h3>Claw Machine</h3>
                <p>3 prize orbs buried beneath 12 empty decoys—steady the wobbly claw and watch out for sneaky mid-lift slips!</p>
                <JournalButton
                  type="button"
                  intent="romantic"
                  size="md"
                  onClick={() => selectLuckyDrawGame("claw")}
                  seed="pick-claw-game"
                >
                  Play Claw Machine
                </JournalButton>
              </article>

              <article className="lucky-game-card">
                <JournalTag tone="periwinkle" seed="choice-cups">3 Tries</JournalTag>
                <h3>Cup Shuffle</h3>
                <p>7 identical cups (3 prizes, 4 empty)—keep your eyes locked during the rapid 2-row shuffle and lift a winner!</p>
                <JournalButton
                  type="button"
                  intent="secondary"
                  size="md"
                  onClick={() => selectLuckyDrawGame("cups")}
                  seed="pick-cups-game"
                >
                  Play Cup Shuffle
                </JournalButton>
              </article>
            </div>

            <div className="lucky-draw-actions">
              <button type="button" className="welcome-text-button" onClick={close}>
                Save my ticket for later
              </button>
            </div>
          </>
        )}

        {state.stage === "playing" && (
          <>
            <div className="lucky-draw-dialog__head">
              <div className="arcade-hud-row">
                <JournalTag tone={triesLeft <= 1 ? "tomato" : "mint"} seed="lucky-tries-tag">
                  {triesLeft} {triesLeft === 1 ? "try" : "tries"} left
                </JournalTag>
                <JournalButton
                  type="button"
                  intent="quiet"
                  size="sm"
                  onClick={() => setMuted((m) => !m)}
                  aria-pressed={muted}
                  seed="arcade-sound-toggle"
                >
                  {muted ? "🔇 Sound off" : "🔊 Sound on"}
                </JournalButton>
              </div>
              <JournalHeading id="lucky-draw-title" level={2} size="section">
                {state.game === "claw" ? "Scrapbook Claw Machine" : "Desk Cup Shuffle"}
              </JournalHeading>
            </div>

            {state.game === "claw" ? (
              <ClawMachineGame
                triesLeft={triesLeft}
                muted={muted}
                onWin={handleWin}
                onMiss={handleMiss}
                onBusyChange={setGameBusy}
              />
            ) : (
              <CupShuffleGame
                triesLeft={triesLeft}
                muted={muted}
                onWin={handleWin}
                onMiss={handleMiss}
                onBusyChange={setGameBusy}
              />
            )}

            {!gameBusy && (
              <div className="lucky-draw-actions">
                <button type="button" className="welcome-text-button" onClick={close}>
                  Pause &amp; come back later
                </button>
              </div>
            )}
          </>
        )}

        {state.stage === "out-of-tries" && (
          <>
            <div className="lucky-draw-dialog__head">
              <Doodle kind="sparkle" tone="tomato" size={72} />
              <JournalTag tone="mustard" seed="lucky-out-tag">So close!</JournalTag>
              <JournalHeading id="lucky-draw-title" level={2} size="section">
                Oh no, out of tries!
              </JournalHeading>
            </div>
            <p className="lucky-draw-dialog__copy">
              That one was tricky! Want another shot at winning a surprise prize? Message me nicely and ask for a rematch code!
            </p>
            <div className="lucky-draw-actions">
              <JournalButton
                type="button"
                intent="romantic"
                size="md"
                onClick={requestLuckyDrawRematch}
                seed="lucky-rematch"
              >
                Enter a rematch code
              </JournalButton>
              <button type="button" className="welcome-text-button" onClick={close}>
                Back to browsing
              </button>
            </div>
          </>
        )}

        {state.stage === "won" && wonPrize && (
          <>
            <div className="lucky-draw-dialog__head">
              {wonPrize.imageUrl ? (
                <div className="lucky-draw-prize-photo">
                  <Image src={wonPrize.imageUrl} alt={wonPrize.title} fill sizes="160px" unoptimized />
                </div>
              ) : (
                <Doodle kind="heart" tone="bubblegum" size={76} />
              )}
              <JournalTag tone={wonPrize.tone} seed="lucky-won-tag">Lucky Draw Winner!</JournalTag>
              <JournalHeading id="lucky-draw-title" level={2} size="section">
                {wonPrize.title}
              </JournalHeading>
            </div>
            <div className="lucky-draw-prize-card">
              <p>{wonPrize.description}</p>
              <small>Tucked safely onto your wishlist—I&apos;ll see this right alongside your picks!</small>
            </div>
            <div className="lucky-draw-actions">
              <JournalButton
                type="button"
                intent="romantic"
                size="md"
                buddy="peek"
                buddyMood="congrats"
                burst="hearts"
                onClick={close}
                seed="lucky-done"
              >
                Yay! Keep browsing
              </JournalButton>
            </div>
          </>
        )}
      </JournalSheet>
    </div>
  );
}
