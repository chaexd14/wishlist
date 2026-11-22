import type { PlopProviderProps } from "@plop-ui/react";

export type JournalSurface = NonNullable<PlopProviderProps["surface"]>;

export const DEFAULT_JOURNAL_SURFACE: JournalSurface = "kraft";

export function resolveJournalSurface(pathname: string | null | undefined): JournalSurface {
  if (pathname === "/") return "mat";
  if (
    pathname?.startsWith("/gifts") ||
    pathname === "/cart" ||
    pathname === "/checkout" ||
    pathname?.startsWith("/confirmation")
  ) {
    return "notebook";
  }
  return DEFAULT_JOURNAL_SURFACE;
}
