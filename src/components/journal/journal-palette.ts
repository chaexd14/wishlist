export const JOURNAL_PALETTES = [
  { value: "coffee", label: "Coffee brown", description: "Warm kraft and espresso ink" },
  { value: "pink", label: "Light pink", description: "Blush paper and berry ink" },
  { value: "purple", label: "Light purple", description: "Lilac paper and plum ink" },
  { value: "sky", label: "Sky blue", description: "Blue paper and deep ocean ink" },
] as const;

export type JournalPalette = (typeof JOURNAL_PALETTES)[number]["value"];

export const DEFAULT_JOURNAL_PALETTE: JournalPalette = "coffee";

export function isJournalPalette(value: string | undefined): value is JournalPalette {
  return JOURNAL_PALETTES.some((palette) => palette.value === value);
}
