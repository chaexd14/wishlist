"use client";

import { Doodle } from "@plop-ui/react";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

import { JournalButton, JournalHeading, JournalSheet } from "@/components/journal";

const STORAGE_KEY = "wish-journal-handmade-notice-v1";
const CHANGE_EVENT = "wish-journal-handmade-notice-change";

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "seen";
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function HandmadeNoticeModal() {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const open = status !== "seen";
  const buttonRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "seen");
    } catch {
      // Ignore storage errors if blocked.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => {
      buttonRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="handmade-notice-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handmade-notice-title"
    >
      <JournalSheet tape="bubblegum" spacing="roomy" className="handmade-notice-dialog">
        <Doodle kind="heart" tone="bubblegum" size={76} />
        <JournalHeading id="handmade-notice-title" level={2} size="section">
          Handmade with lots of love
        </JournalHeading>
        <p>
          Every single gift in here is lovingly handmade—not factory-made—so expect tiny quirks, gentle stitches, and sweet little imperfections here and there.
        </p>
        <p className="handmade-notice-dialog__sweet">
          That&apos;s what makes each piece one of a kind, just like you!
        </p>
        <div ref={buttonRef} className="handmade-notice-dialog__action">
          <JournalButton
            intent="romantic"
            size="md"
            buddy="peek"
            buddyMood="congrats"
            burst="hearts"
            onClick={dismiss}
            seed="handmade-notice-ok"
          >
            I understand, let&apos;s browse!
          </JournalButton>
        </div>
      </JournalSheet>
    </div>
  );
}
