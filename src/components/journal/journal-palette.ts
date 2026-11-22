export const JOURNAL_PALETTES = [
  { value: "coffee", label: "Warm confetti", description: "Terracotta actions with rose, lilac, sky, mint, and honey" },
  { value: "pink", label: "Rose garden", description: "Berry actions with the full birthday color collection" },
  { value: "purple", label: "Lilac wishes", description: "Violet actions with warm and cool paper accents" },
  { value: "sky", label: "Blue daydream", description: "Ocean actions with rose, lilac, mint, and honey" },
] as const;

export type JournalPalette = (typeof JOURNAL_PALETTES)[number]["value"];

export const DEFAULT_JOURNAL_PALETTE: JournalPalette = "coffee";

export function isJournalPalette(value: string | undefined): value is JournalPalette {
  return JOURNAL_PALETTES.some((palette) => palette.value === value);
}
