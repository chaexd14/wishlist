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
    id: "sticker-book-design-1",
    title: "Sticker Book Design 1",
    shortLabel: "Sticker Book 1",
    description: "A handpicked sticker book design to fill with your favorite little treasures!",
    sliceColor: "#e9a7b8",
    tone: "bubblegum",
    imageUrl: "/images/price1.png",
  },
  {
    id: "sticker-book-design-2",
    title: "Sticker Book Design 2",
    shortLabel: "Sticker Book 2",
    description: "Another charming sticker book design ready for your creative journaling days!",
    sliceColor: "#f0c85e",
    tone: "mustard",
    imageUrl: "/images/price2.png",
  },
  {
    id: "books-set",
    title: "Books Set",
    shortLabel: "Books Set",
    description: "A cozy set of books picked out just for your reading nook!",
    sliceColor: "#a8d5b5",
    tone: "mint",
    imageUrl: "/images/price3.png",
  },
];

export function getLuckyDrawPrize(id?: string): LuckyDrawPrize | undefined {
  if (!id) return undefined;
  return LUCKY_DRAW_PRIZES.find((prize) => prize.id === id);
}
