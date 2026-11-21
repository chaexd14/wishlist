"use client";

import { PlopProvider } from "@plop-ui/react";
import type { ReactNode } from "react";

export function JournalProvider({ children }: { children: ReactNode }) {
  return (
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
  );
}
