"use client";

import { ButtonLink, type ButtonLinkProps } from "@plop-ui/react";
import Link from "next/link";
import type { ComponentProps } from "react";

import type { JournalTransitionType } from "./journal-page-transition";

type NextLinkPassthroughProps = Pick<ComponentProps<typeof Link>, "prefetch" | "replace" | "scroll">;

export type JournalButtonLinkProps = Omit<ButtonLinkProps, "as"> &
  NextLinkPassthroughProps & {
    transitionTypes?: JournalTransitionType[];
  };

export function JournalButtonLink({ transitionTypes, ...props }: JournalButtonLinkProps) {
  const linkProps = transitionTypes ? { transitionTypes } : {};
  return <ButtonLink as={Link} {...(linkProps as Record<string, unknown>)} {...props} />;
}
