"use client";

import { PlopProvider } from "@plop-ui/react";
import { usePathname } from "next/navigation";
import {
  Suspense,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { DEFAULT_JOURNAL_PALETTE, isJournalPalette, type JournalPalette } from "./journal-palette";
import { resolveJournalSurface, type JournalSurface } from "./journal-surface";

export type ThemeTransitionOrigin = {
  x: number;
  y: number;
};

type JournalPaletteContextValue = {
  palette: JournalPalette;
  setPalette: (palette: JournalPalette, origin?: ThemeTransitionOrigin) => void;
};

type BrowserViewTransition = {
  finished: Promise<void>;
  skipTransition?: () => void;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => BrowserViewTransition;
};

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const JournalPaletteContext = createContext<JournalPaletteContextValue | null>(null);

export function useJournalPalette() {
  const context = useContext(JournalPaletteContext);
  if (!context) throw new Error("useJournalPalette must be used inside JournalProvider");
  return context;
}

function JournalSurfaceSync({ onSurfaceChange }: { onSurfaceChange: (surface: JournalSurface) => void }) {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const nextSurface = resolveJournalSurface(pathname);
    document.documentElement.dataset.plopSurface = nextSurface;
    onSurfaceChange(nextSurface);
  }, [pathname, onSurfaceChange]);

  return null;
}

export function JournalProvider({
  children,
  initialPalette = DEFAULT_JOURNAL_PALETTE,
}: {
  children: ReactNode;
  initialPalette?: JournalPalette;
}) {
  const [surface, setSurface] = useState<JournalSurface | undefined>(undefined);
  const activeThemeTransition = useRef<BrowserViewTransition | null>(null);
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
    setPalette(nextPalette, origin) {
      const root = document.documentElement;
      const applyPalette = () => {
        root.dataset.journalPalette = nextPalette;
        document.cookie = `journal-palette=${nextPalette}; path=/; max-age=31536000; samesite=lax`;
        window.dispatchEvent(new Event("journal-palette-change"));
      };

      if (root.dataset.journalPalette === nextPalette) return;

      const doc = document as DocumentWithViewTransition;
      if (typeof doc.startViewTransition !== "function") {
        applyPalette();
        return;
      }

      const originX = origin ? `${Math.round(origin.x)}px` : `${Math.round(window.innerWidth * 0.88)}px`;
      const originY = origin ? `${Math.round(origin.y)}px` : "44px";
      root.style.setProperty("--theme-origin-x", originX);
      root.style.setProperty("--theme-origin-y", originY);

      activeThemeTransition.current?.skipTransition?.();
      root.dataset.themeTransition = "true";

      try {
        const transition = doc.startViewTransition(() => {
          applyPalette();
        });
        activeThemeTransition.current = transition;
        void transition.finished
          .catch(() => {})
          .finally(() => {
            if (activeThemeTransition.current === transition) {
              activeThemeTransition.current = null;
              delete root.dataset.themeTransition;
            }
          });
      } catch {
        delete root.dataset.themeTransition;
        applyPalette();
      }
    },
  }), [palette]);

  return (
    <JournalPaletteContext.Provider value={value}>
      <Suspense fallback={null}>
        <JournalSurfaceSync onSurfaceChange={setSurface} />
      </Suspense>
      <PlopProvider
        className="journal-app"
        surface={surface}
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
