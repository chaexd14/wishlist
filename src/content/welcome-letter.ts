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
    "Happy birthday! I made this little journal so you can choose the gifts you genuinely love.",
    "Take your time, pick your favorite colors and sizes, and tell me every tiny detail that would make each one feel just right.",
    "There is no payment here—only a promise that I will turn your choices into real birthday gifts.",
  ],
  signature: "With love, [Your name]",
  envelopeLabel: "A birthday letter, made just for you",
  isSample: true,
};
