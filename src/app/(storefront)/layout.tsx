import type { ReactNode } from "react";

import { JournalThemeSwitcher } from "@/components/journal";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="storefront-theme-control">
        <JournalThemeSwitcher compact />
      </div>
      {children}
    </>
  );
}
