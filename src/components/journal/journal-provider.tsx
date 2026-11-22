"use client";

import { PlopProvider } from "@plop-ui/react";
import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { DEFAULT_JOURNAL_PALETTE, isJournalPalette, type JournalPalette } from "./journal-palette";

type JournalPaletteContextValue = {
  palette: JournalPalette;
  setPalette: (palette: JournalPalette) => void;
};

const JournalPaletteContext = createContext<JournalPaletteContextValue | null>(null);

export function useJournalPalette() {
  const context = useContext(JournalPaletteContext);
  if (!context) throw new Error("useJournalPalette must be used inside JournalProvider");
  return context;
}

export function JournalProvider({
  children,
  initialPalette = DEFAULT_JOURNAL_PALETTE,
}: {
  children: ReactNode;
  initialPalette?: JournalPalette;
}) {
  const palette = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("journal-palette-change", onStoreChange);
      return () => window.removeEventListener("journal-palette-change", onStoreChange);
    },
    () => {
      const current = document.documentElement.dataset.journalPalette;
      return isJournalPalette(current) ? current : DEFAULT_JOURNAL_PALETTE;
    },
    () => initialPalette,
  );
  const value = useMemo<JournalPaletteContextValue>(() => ({
    palette,
    setPalette(nextPalette) {
      document.documentElement.dataset.journalPalette = nextPalette;
      document.cookie = `journal-palette=${nextPalette}; path=/; max-age=31536000; samesite=lax`;
      window.dispatchEvent(new Event("journal-palette-change"));
    },
  }), [palette]);

  return (
    <JournalPaletteContext.Provider value={value}>
      <PlopProvider
        className="journal-app"
        surface="kraft"
        theme="light"
        paint={false}
        sound={false}
        reducedMotion="system"
        stickerShadow="soft"
        roundness={0.9}
        toastBackdrop="dots"
      >
        {children}
      </PlopProvider>
    </JournalPaletteContext.Provider>
  );
}
