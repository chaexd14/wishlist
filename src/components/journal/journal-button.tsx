"use client";

import { Button, type ButtonProps } from "@plop-ui/react";

type JournalButtonIntent = "primary" | "romantic" | "secondary" | "quiet" | "danger";

const variants: Record<JournalButtonIntent, ButtonProps["variant"]> = {
  primary: "ink",
  romantic: "periwinkle",
  secondary: "mustard",
  quiet: "plain",
  danger: "tomato",
};

type JournalButtonProps = Omit<ButtonProps, "variant"> & {
  intent?: JournalButtonIntent;
};

export function JournalButton({ intent = "primary", type = "button", className = "", ...props }: JournalButtonProps) {
  return (
    <Button
      type={type}
      variant={variants[intent]}
      className={`journal-button ${className}`.trim()}
      {...props}
    />
  );
}
