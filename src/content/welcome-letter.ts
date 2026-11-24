export type WelcomeLetterContent = {
  salutation: string;
  paragraphs: string[];
  signature: string;
  envelopeLabel: string;
  isSample: boolean;
};

export const welcomeLetter: WelcomeLetterContent = {
  salutation: "To my favorite person,",
  paragraphs: [
    "Your wish is my command! I made this little journal so you can pick the gifts you genuinely love.",
    "Take your time, pick your favorite colors and sizes, and tell me every tiny detail that would make each one feel just right.",
    "There is no payment here—only a promise that I will turn your wishes into real gifts.",
  ],
  signature: "With love, [Your name]",
  envelopeLabel: "A little letter, made just for you",
  isSample: true,
};
