import type { TagTone } from "@plop-ui/react";

export type LuckyDrawPrize = {
  id: string;
  title: string;
  shortLabel: string;
  description: string;
  sliceColor: string;
  tone: TagTone;
  /** Optional photo shown in a circular frame on the wheel slice and winner card (e.g. "/images/lucky-draw/prize-1.png"). */
  imageUrl?: string;
};

// Edit these 3 prizes anytime! Drop photos into public/images/lucky-draw/ and uncomment imageUrl below.
export const LUCKY_DRAW_PRIZES: readonly [LuckyDrawPrize, LuckyDrawPrize, LuckyDrawPrize] = [
  {
    id: "coffee-boba-date",
    title: "Cozy Coffee or Boba Date",
    shortLabel: "Coffee Date",
    description: "My treat to your favorite café or boba shop whenever you say the word!",
    sliceColor: "#e9a7b8",
    tone: "bubblegum",
    // imageUrl: "/images/lucky-draw/prize-1.png",
  },
  {
    id: "movie-night-pick",
    title: "Movie Night, Your Pick",
    shortLabel: "Movie Night",
    description: "You pick the movie, snacks, and cozy blanket fort—no vetoes allowed!",
    sliceColor: "#f0c85e",
    tone: "mustard",
    // imageUrl: "/images/lucky-draw/prize-2.png",
  },
  {
    id: "mystery-bonus-surprise",
    title: "Mystery Bonus Surprise",
    shortLabel: "Mystery Gift",
    description: "One extra handpicked little surprise tucked in just because I love you!",
    sliceColor: "#a8d5b5",
    tone: "mint",
    // imageUrl: "/images/lucky-draw/prize-3.png",
  },
];

export function getLuckyDrawPrize(id?: string): LuckyDrawPrize | undefined {
  if (!id) return undefined;
  return LUCKY_DRAW_PRIZES.find((prize) => prize.id === id);
}
