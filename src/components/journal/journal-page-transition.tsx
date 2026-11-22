import { ViewTransition, type ReactNode } from "react";

export type JournalTransitionType =
  | "page-peel-forward"
  | "page-peel-back"
  | "page-turn-forward"
  | "page-turn-back";

export function JournalPageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{
        "page-peel-forward": "none",
        "page-peel-back": "none",
        "page-turn-forward": "page-turn-forward",
        "page-turn-back": "page-turn-back",
        default: "page-soft-swap",
      }}
      exit={{
        "page-peel-forward": "none",
        "page-peel-back": "none",
        "page-turn-forward": "page-turn-forward",
        "page-turn-back": "page-turn-back",
        default: "page-soft-swap",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
