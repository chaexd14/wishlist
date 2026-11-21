import { Sheet, type SheetProps } from "@plop-ui/react";

type JournalSheetProps = SheetProps & {
  spacing?: "compact" | "comfortable" | "roomy";
};

export function JournalSheet({ spacing = "comfortable", className = "", tape = "mustard", ...props }: JournalSheetProps) {
  return (
    <Sheet
      tape={tape}
      className={`journal-sheet journal-sheet--${spacing} ${className}`.trim()}
      {...props}
    />
  );
}
