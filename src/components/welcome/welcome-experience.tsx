"use client";

import { CheckIcon, Doodle, StatusTimeline } from "@plop-ui/react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useRouter } from "next/navigation";
import { FormEvent, PointerEvent, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { z } from "zod";

import { JournalButton, JournalHeading, JournalTag, JournalTextField } from "@/components/journal";
import {
  burstPieces,
  copyVariants,
  deskPropVariants,
  foldBottomVariants,
  foldTopVariants,
  keepsakeEase,
  letterVariants,
  sceneVariants,
} from "@/components/welcome/welcome-motion";
import type { WelcomeLetterContent } from "@/content/welcome-letter";

const STORAGE_KEY = "birthday-wishlist-welcome-v1";
const CHANGE_EVENT = "birthday-wishlist-welcome-change";
const emailSchema = z.string().trim().toLowerCase().email("Enter a complete email address, like name@example.com.");

type WelcomeProgress = {
  letterOpened: boolean;
  email?: string;
  emailDecision?: "saved" | "skipped";
  completed: boolean;
  updatedAt: string;
};

type WelcomeStage = "sealed" | "reading" | "peeled";
type WelcomeStep = "letter" | "note" | "reveal";

const welcomeSteps: { id: WelcomeStep; label: string }[] = [
  { id: "letter", label: "Letter" },
  { id: "note", label: "Note" },
  { id: "reveal", label: "Reveal" },
];

const emptyProgress: WelcomeProgress = {
  letterOpened: false,
  completed: false,
  updatedAt: "",
};

function parseProgress(stored: string | null): WelcomeProgress {
  try {
    if (!stored) return emptyProgress;
    const parsed = JSON.parse(stored) as Partial<WelcomeProgress>;
    return {
      letterOpened: parsed.letterOpened === true,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      emailDecision: parsed.emailDecision === "saved" || parsed.emailDecision === "skipped" ? parsed.emailDecision : undefined,
      completed: parsed.completed === true,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return emptyProgress;
  }
}

function getProgressSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function readProgress() {
  return parseProgress(getProgressSnapshot());
}

function writeProgress(patch: Partial<WelcomeProgress>) {
  const next = { ...readProgress(), ...patch, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The welcome remains usable when storage is blocked or unavailable.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function useWelcomeProgress() {
  const snapshot = useSyncExternalStore(subscribe, getProgressSnapshot, () => "");
  return useMemo(() => parseProgress(snapshot), [snapshot]);
}

export function WelcomeExperience({ content }: { content: WelcomeLetterContent }) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const progress = useWelcomeProgress();
  const [stage, setStage] = useState<WelcomeStage>("sealed");
  const [step, setStep] = useState<WelcomeStep>("letter");
  const [letterPage, setLetterPage] = useState<0 | 1>(0);
  const [transitioning, setTransitioning] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [drag, setDrag] = useState(0);
  const dragStart = useRef(0);
  const didDrag = useRef(false);
  const suppressClick = useRef(false);
  const letterRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLElement>(null);

  function openLetter() {
    writeProgress({ letterOpened: true });
    setLetterPage(0);
    setStage("reading");
    requestAnimationFrame(() => letterRef.current?.focus({ preventScroll: true }));
  }

  function resetLetter() {
    setTransitioning(false);
    setLetterPage(0);
    setStep("letter");
    setStage("sealed");
  }

  function showLetterPage(nextPage: 0 | 1) {
    setLetterPage(nextPage);
    requestAnimationFrame(() => {
      if (!letterRef.current) return;
      letterRef.current.scrollTop = 0;
      letterRef.current.focus({ preventScroll: true });
    });
  }

  function moveToStep(nextStep: WelcomeStep) {
    if (transitioning || nextStep === step) return;
    setTransitioning(true);
    setStep(nextStep);
    if (shouldReduceMotion) requestAnimationFrame(() => finishStepMotion(nextStep));
  }

  function finishStepMotion(completedStep: WelcomeStep) {
    if (step !== completedStep && !shouldReduceMotion) return;
    setTransitioning(false);
    const focusTarget = completedStep === "letter" ? letterRef : completedStep === "note" ? noteRef : revealRef;
    focusTarget.current?.focus({ preventScroll: true });
  }

  function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = emailSchema.safeParse(String(form.get("email") ?? ""));
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    setEmailError("");
    setEditingEmail(false);
    writeProgress({ email: result.data, emailDecision: "saved" });
    moveToStep("reveal");
  }

  function skipEmail() {
    setEmailError("");
    writeProgress({ emailDecision: "skipped" });
    moveToStep("reveal");
  }

  function removeEmail() {
    writeProgress({ email: undefined, emailDecision: undefined });
    setEditingEmail(true);
  }

  function completePeel() {
    setDrag(84);
    setStage("peeled");
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    dragStart.current = event.clientX;
    didDrag.current = false;
    suppressClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const next = Math.max(0, Math.min(84, event.clientX - dragStart.current));
    didDrag.current ||= next > 4;
    setDrag(next);
  }

  function handlePointerUp() {
    if (!didDrag.current) return;
    suppressClick.current = true;
    if (drag >= 60) completePeel();
    else setDrag(0);
  }

  function enterWishlist() {
    writeProgress({ completed: true });
    router.push("/gifts", { transitionTypes: ["page-peel-forward"] });
  }

  const showLetter = stage === "reading" || stage === "peeled";
  const currentStepIndex = welcomeSteps.findIndex((item) => item.id === step);
  const pageParagraphs = letterPage === 0 ? content.paragraphs.slice(0, 4) : content.paragraphs.slice(4);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="welcome-experience">
      {progress.completed && (
        <aside className="welcome-return" aria-label="Welcome back">
          <div>
            <strong>Welcome back to your wish journal.</strong>
            <span>Your favorite picks are waiting right where you left them.</span>
          </div>
          <div className="welcome-return__actions">
            <JournalButton intent="romantic" onClick={() => router.push("/gifts", { transitionTypes: ["page-peel-forward"] })} seed="continue-wishlist">Continue to my wishlist</JournalButton>
            <button className="welcome-text-button" type="button" onClick={resetLetter}>Read the letter again</button>
          </div>
        </aside>
      )}

      <section className={`welcome-letter-stage welcome-letter-stage--${stage}`} aria-labelledby="welcome-title">
        <div className="keepsake-decor" aria-hidden="true">
          <m.div className="keepsake-scrap keepsake-scrap--rose" custom={{ delay: 0.08, rotate: -7 }} variants={deskPropVariants} initial="hidden" animate="visible">
            <span>For my favorite person</span>
          </m.div>
          <m.div className="keepsake-scrap keepsake-scrap--sage" custom={{ delay: 0.16, rotate: 6 }} variants={deskPropVariants} initial="hidden" animate="visible">
            <Doodle kind="heart" tone="tomato" size={34} />
            <span>Made with love</span>
          </m.div>
          <m.div className="keepsake-paperclip keepsake-paperclip--left" custom={{ delay: 0.22, rotate: -12 }} variants={deskPropVariants} initial="hidden" animate="visible" />
          <m.div className="keepsake-paperclip keepsake-paperclip--right" custom={{ delay: 0.28, rotate: 14 }} variants={deskPropVariants} initial="hidden" animate="visible" />
          <m.div className="keepsake-tape keepsake-tape--top" custom={{ delay: 0.12, rotate: -4 }} variants={deskPropVariants} initial="hidden" animate="visible" />
        </div>

        <m.div className="welcome-intro" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <JournalHeading level={1} size="page" id="welcome-title">Your wish is my command</JournalHeading>
          <p>I put together a little surprise just for you.</p>
        </m.div>

        <m.div className="welcome-ritual" layout data-step={step} data-transitioning={transitioning ? "true" : "false"}>
          <m.section
            className="welcome-panel welcome-panel--letter"
            data-position={currentStepIndex === 0 ? "current" : "past"}
            aria-hidden={step !== "letter"}
            inert={step !== "letter" ? true : undefined}
            variants={sceneVariants}
            initial={false}
            animate={currentStepIndex === 0 ? "current" : "past"}
            onAnimationComplete={() => step === "letter" && transitioning && finishStepMotion("letter")}
          >
            <div className="envelope-scene" data-stage={stage}>
              <div className="envelope">
                <div className="envelope__back" aria-hidden="true" />
                <m.article
                  ref={letterRef}
                  className="birthday-letter birthday-letter--physical"
                  aria-label="Love letter"
                  aria-hidden={!showLetter || step !== "letter"}
                  tabIndex={showLetter && step === "letter" ? -1 : undefined}
                  variants={letterVariants}
                  initial={false}
                  animate={stage === "sealed" ? "sealed" : "open"}
                >
                  <m.section
                    className="birthday-letter__panel birthday-letter__panel--top"
                    variants={foldTopVariants}
                    initial={false}
                    animate={stage === "sealed" ? "folded" : "open"}
                  >
                    <m.span className="birthday-letter__page-number" variants={copyVariants} custom={shouldReduceMotion ? -1 : 0.74} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"}>
                      Page {letterPage + 1} of 2
                    </m.span>
                    {content.isSample && (
                      <m.div className="birthday-letter__sample" variants={copyVariants} custom={shouldReduceMotion ? -1 : 0.72} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"}>
                        <JournalTag tone="mustard">Sample copy</JournalTag>
                        <small>Personalize this letter before sharing.</small>
                      </m.div>
                    )}
                    {letterPage === 0 && <m.p className="birthday-letter__salutation" variants={copyVariants} custom={shouldReduceMotion ? -1 : 0.78} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"}>{content.salutation}</m.p>}
                    {pageParagraphs[0] && <m.p variants={copyVariants} custom={shouldReduceMotion ? -1 : 0.84} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"}>{pageParagraphs[0]}</m.p>}
                  </m.section>
                  <m.section className="birthday-letter__panel birthday-letter__panel--middle">
                    {pageParagraphs[1] && <m.p variants={copyVariants} custom={shouldReduceMotion ? -1 : 0.9} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"}>{pageParagraphs[1]}</m.p>}
                  </m.section>
                  <m.section
                    className="birthday-letter__panel birthday-letter__panel--bottom"
                    variants={foldBottomVariants}
                    initial={false}
                    animate={stage === "sealed" ? "folded" : "open"}
                  >
                    {pageParagraphs.slice(2).map((paragraph, index) => <m.p variants={copyVariants} custom={shouldReduceMotion ? -1 : 0.94 + index * 0.04} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"} key={`${letterPage}-${paragraph}`}>{paragraph}</m.p>)}
                    {letterPage === 1 && <m.p className="birthday-letter__signature" variants={copyVariants} custom={shouldReduceMotion ? -1 : 1.02} initial="hidden" animate={stage === "sealed" ? "hidden" : "visible"}>{content.signature}</m.p>}
                  </m.section>
                </m.article>
                <div className="envelope__front" aria-hidden="true" />
                <m.div
                  className="envelope__flap"
                  aria-hidden="true"
                  initial={false}
                  animate={stage === "sealed" ? { rotateX: 0, opacity: 1 } : { rotateX: 162, opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.42, ease: keepsakeEase }}
                />
                <m.div
                  className="envelope__seal"
                  aria-hidden="true"
                  initial={false}
                  animate={stage === "sealed"
                    ? { x: "-50%", y: "-50%", rotate: -3, scale: 1, opacity: 1 }
                    : { x: "-50%", y: "-50%", rotate: 10, scale: 0.72, opacity: 0 }}
                  transition={stage === "sealed"
                    ? { duration: shouldReduceMotion ? 0 : 0.3, ease: keepsakeEase }
                    : { duration: shouldReduceMotion ? 0 : 0.24, ease: keepsakeEase }}
                >
                  <Doodle kind="heart" tone="tomato" size={46} />
                </m.div>
                {stage === "sealed" && (
                  <m.button className="envelope-open" type="button" onClick={openLetter} aria-label="Open your letter">
                    <span className="envelope-open__copy">
                      <span className="envelope-open__label">{content.envelopeLabel}</span>
                      <strong className="envelope-open__cta">Press the heart seal to open</strong>
                    </span>
                  </m.button>
                )}
              </div>
              <m.div
                className="welcome-letter-continue"
                initial={false}
                animate={stage === "sealed"
                  ? { opacity: 0, y: 12, scale: 0.96 }
                  : shouldReduceMotion
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: [0, 0, 1], y: [12, 12, 0], scale: [0.96, 0.96, 1] }}
                transition={{ duration: stage === "sealed" || shouldReduceMotion ? 0 : 1.32, times: [0, 0.78, 1], ease: keepsakeEase }}
                aria-hidden={stage === "sealed"}
                inert={stage === "sealed" ? true : undefined}
              >
                  {letterPage === 0 ? (
                    <JournalButton intent="romantic" onClick={() => showLetterPage(1)} seed="letter-page-next">
                      Next page
                    </JournalButton>
                  ) : (
                    <>
                      <button className="welcome-text-button" type="button" onClick={() => showLetterPage(0)}>Previous page</button>
                      <JournalButton intent="romantic" onClick={() => moveToStep("note")} seed="letter-next">
                        Next: add a little note
                      </JournalButton>
                    </>
                  )}
              </m.div>
            </div>
          </m.section>

          <m.section
            ref={noteRef}
            className="welcome-panel welcome-panel--note welcome-email"
            data-position={currentStepIndex < 1 ? "future" : currentStepIndex === 1 ? "current" : "past"}
            aria-labelledby="email-title"
            aria-hidden={step !== "note"}
            inert={step !== "note" ? true : undefined}
            tabIndex={-1}
            variants={sceneVariants}
            initial={false}
            animate={currentStepIndex < 1 ? "future" : currentStepIndex === 1 ? "current" : "past"}
            onAnimationComplete={() => step === "note" && transitioning && finishStepMotion("note")}
          >
            <div>
              <JournalHeading level={2} size="section" id="email-title">A note for later</JournalHeading>
              <p>Please enter your email for updates.</p>
            </div>

            {progress.email && !editingEmail ? (
              <div className="welcome-email__saved" role="status">
                <CheckIcon aria-hidden="true" />
                <div><strong>Got your email!</strong><span>{progress.email}</span></div>
                <button type="button" onClick={() => setEditingEmail(true)}>Edit</button>
                <button type="button" onClick={removeEmail}>Remove</button>
              </div>
            ) : (
              <form className="welcome-email__form" onSubmit={saveEmail} noValidate>
                <JournalTextField
                  className="welcome-email__field"
                  id="welcome-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  defaultValue={progress.email}
                  label="Email address"
                  placeholder="you@example.com"
                  error={emailError || undefined}
                />
                <div className="welcome-email__actions">
                  <JournalButton type="submit" intent="romantic" seed="save-email">Next: peel the seal</JournalButton>
                  <button className="welcome-text-button" type="button" onClick={skipEmail}>Skip for now</button>
                </div>
              </form>
            )}

            <div className="welcome-panel__navigation">
              <button className="welcome-text-button" type="button" onClick={() => moveToStep("letter")}>Back to letter</button>
              {progress.email && !editingEmail && (
                <JournalButton intent="romantic" onClick={() => moveToStep("reveal")} seed="continue-email">Next: peel the seal</JournalButton>
              )}
            </div>
          </m.section>

          <m.section
            ref={revealRef}
            className="welcome-panel welcome-panel--reveal welcome-unlock"
            data-position={currentStepIndex === 2 ? "current" : "future"}
            aria-labelledby="unlock-title"
            aria-hidden={step !== "reveal"}
            inert={step !== "reveal" ? true : undefined}
            tabIndex={-1}
            variants={sceneVariants}
            initial={false}
            animate={currentStepIndex === 2 ? "current" : "future"}
            onAnimationComplete={() => step === "reveal" && transitioning && finishStepMotion("reveal")}
          >
            <JournalHeading level={2} id="unlock-title">One last little seal</JournalHeading>
            <p>Peel (or tap!) the sticker to see what I picked out for you.</p>
            <m.div
              className="peel-card"
              animate={stage === "peeled" ? "revealed" : "covered"}
              variants={{
                covered: { boxShadow: "0 0 0 0 rgba(202, 111, 73, 0)" },
                revealed: shouldReduceMotion
                  ? { boxShadow: "0 0 0 8px rgba(235, 185, 88, 0.22)" }
                  : { boxShadow: ["0 0 0 0 rgba(202, 111, 73, 0)", "0 0 0 18px rgba(235, 185, 88, 0.3)", "0 0 0 8px rgba(202, 111, 73, 0.16)"] },
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: keepsakeEase }}
            >
              <m.span
                className="peel-card__message"
                aria-hidden={stage !== "peeled"}
                initial={false}
                animate={stage === "peeled" ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.94, filter: "blur(2px)" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.42, delay: shouldReduceMotion ? 0 : 0.2, ease: keepsakeEase }}
              >Your wish is my command!</m.span>
              <m.button
                className="peel-sticker"
                type="button"
                style={{ "--peel-x": `${drag}px` } as CSSProperties}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDrag(0)}
                onClick={() => {
                  if (suppressClick.current) { suppressClick.current = false; return; }
                  completePeel();
                }}
                disabled={stage === "peeled"}
                aria-label="Peel the sticker to reveal your wishlist"
                initial={false}
                animate={stage === "peeled"
                  ? (shouldReduceMotion ? { opacity: 0 } : { x: [drag, 34, 210, 520], y: [0, -10, -24, -42], rotate: [-1, 2, 7, 13], scaleY: [1, 0.94, 0.82, 0.72], opacity: [1, 1, 0.72, 0] })
                  : { x: drag, y: drag ? -Math.min(Math.abs(drag) * 0.045, 8) : 0, rotate: drag * 0.015 - 1, scaleY: 1, opacity: 1 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.7, times: [0, 0.22, 0.62, 1], ease: keepsakeEase }}
              >
                <Doodle kind="heart" tone="tomato" size={34} /> Peel me
                <span className="peel-sticker__curl" aria-hidden="true" />
              </m.button>
              <AnimatePresence>
                {stage === "peeled" && !shouldReduceMotion && (
                  <m.div className="peel-burst" initial="hidden" animate="visible" exit="hidden" aria-hidden="true">
                    {burstPieces.map((piece, index) => (
                      <m.span
                        className={`peel-burst__piece peel-burst__piece--${piece.tone}`}
                        key={`${piece.tone}-${index}`}
                        initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
                        animate={{ x: piece.x, y: piece.y, opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.8], rotate: piece.rotate }}
                        transition={{ duration: 0.78, delay: index * 0.025, ease: keepsakeEase }}
                      />
                    ))}
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
            <div className="welcome-panel__navigation welcome-panel__navigation--reveal">
              {stage !== "peeled" && <button className="welcome-text-button" type="button" onClick={() => moveToStep("note")}>Back to note</button>}
              <AnimatePresence>
                {stage === "peeled" && (
                  <m.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.44, ease: keepsakeEase }}>
                    <JournalButton intent="romantic" size="lg" buddy="peek" buddyMood="congrats" burst="hearts" onClick={enterWishlist} seed="open-wishlist">Open my wishlist</JournalButton>
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </m.section>
        </m.div>
        <StatusTimeline
          className="welcome-progress"
          steps={welcomeSteps.map((item) => item.label)}
          current={currentStepIndex}
          orientation="horizontal"
          label="Wish journal progress"
          statusText={{ done: "complete", current: "current step", pending: "not started" }}
        />
        <span className="welcome-live" aria-live="polite">
          {stage === "reading" && step === "letter" ? "Your letter is open" : `Now showing ${welcomeSteps[currentStepIndex].label}`}
        </span>
      </section>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
