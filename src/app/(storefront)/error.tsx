"use client";

import { Doodle } from "@plop-ui/react";
import { useEffect } from "react";

import { JournalButton, JournalButtonLink, JournalHeading, JournalSheet } from "@/components/journal";

export default function StorefrontError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Storefront error", error); }, [error]);
  return <main className="journal-container resilient-error"><JournalSheet tape="mustard" spacing="roomy"><Doodle kind="heart" tone="mustard" size={78} /><JournalHeading level={1} size="section">Oops, this page had a tiny hiccup</JournalHeading><p>Don&apos;t worry—your favorite picks are still safe! Try refreshing, or hop back to the gifts.</p><div><JournalButton onClick={reset}>Try again</JournalButton><JournalButtonLink href="/gifts" variant="plain">Back to gifts</JournalButtonLink></div></JournalSheet></main>;
}
