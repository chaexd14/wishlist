import type { ComponentPropsWithoutRef } from "react";

type JournalContainerProps = ComponentPropsWithoutRef<"div"> & {
  width?: "standard" | "narrow" | "full";
};

export function JournalContainer({ width = "standard", className = "", ...props }: JournalContainerProps) {
  return (
    <div
      className={`journal-container journal-container--${width} ${className}`.trim()}
      {...props}
    />
  );
}
