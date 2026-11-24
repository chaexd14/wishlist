"use client";

import { PlopProvider } from "@plop-ui/react";
import { usePathname } from "next/navigation";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

import { resolveJournalSurface, type JournalSurface } from "./journal-surface";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function JournalSurfaceSync({ onSurfaceChange }: { onSurfaceChange: (surface: JournalSurface) => void }) {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    const nextSurface = resolveJournalSurface(pathname);
    document.documentElement.dataset.plopSurface = nextSurface;
    onSurfaceChange(nextSurface);
  }, [pathname, onSurfaceChange]);

  return null;
}

export function JournalProvider({ children }: { children: ReactNode }) {
  const [surface, setSurface] = useState<JournalSurface | undefined>(undefined);

  return (
    <>
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
    </>
  );
}
