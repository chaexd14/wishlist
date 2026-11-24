import type { DoodleKind, DoodleTone, TagTone } from "@plop-ui/react";

export type GiftAvailability = "available" | "limited" | "planned";
export type GiftCategory = "Journaling" | "Reading Accessories" | "Bookmarks" | "Keepsakes";
export type GiftOption = { value: string; label: string; swatch?: string };
export type GiftOptionGroup = { id: string; label: string; required?: boolean; options: GiftOption[] };
export type GiftCustomization = { id: string; label: string; hint: string; placeholder: string; required?: boolean; maxLength: number };
export type GiftGallerySlide = { id: string; label: string; caption: string; doodle: DoodleKind; tone: DoodleTone; imageUrl?: string };
export type SampleGift = {
  id: string;
  title: string;
  category: GiftCategory;
  description: string;
  details: string[];
  availability: GiftAvailability;
  customizable: boolean;
  maxQuantity: number;
  doodle: DoodleKind;
  tone: DoodleTone;
  gallery: GiftGallerySlide[];
  optionGroups: GiftOptionGroup[];
  customizationFields: GiftCustomization[];
  isSample?: boolean;
};

export const JOURNAL_COLORS: GiftOption[] = [
  { value: "black", label: "Black", swatch: "#231f20" },
  { value: "navy-blue", label: "Navy Blue", swatch: "#1f305e" },
  { value: "tan", label: "Tan", swatch: "#d2b48c" },
  { value: "tan-brown", label: "Tan Brown", swatch: "#a67b5b" },
  { value: "old-rose", label: "Old Rose", swatch: "#c08081" },
  { value: "brown", label: "Brown", swatch: "#6f4e37" },
  { value: "light-beige", label: "Light Beige", swatch: "#f2e6d0" },
  { value: "white", label: "White", swatch: "#ffffff" },
  { value: "cream", label: "Cream", swatch: "#fff8e1" },
  { value: "maroon", label: "Maroon", swatch: "#6b1d2f" },
  { value: "red", label: "Red", swatch: "#c82333" },
  { value: "fuchsia", label: "Fuchsia", swatch: "#d9387d" },
  { value: "royal-blue", label: "Royal Blue", swatch: "#2b50aa" },
  { value: "mango", label: "Mango", swatch: "#f4a825" },
  { value: "orange", label: "Orange", swatch: "#e86f2c" },
  { value: "mint-green", label: "Mint Green", swatch: "#98d8b7" },
  { value: "baby-blue", label: "Baby Blue", swatch: "#a2d2ff" },
  { value: "lavender", label: "Lavender", swatch: "#c3b1e1" },
  { value: "french-pink", label: "French Pink", swatch: "#f6adc6" },
  { value: "silver", label: "Silver", swatch: "#c4c8cc" },
  { value: "gold", label: "Gold", swatch: "#d4af37" },
];

export const JOURNAL_SIZES: GiftOption[] = [
  { value: "a4", label: "A4" },
  { value: "a5", label: "A5" },
  { value: "a6", label: "A6" },
  { value: "b5", label: "B5" },
  { value: "b6", label: "B6" },
];

function journalOptionGroups(): GiftOptionGroup[] {
  return [
    { id: "color-1", label: "Primary color", required: true, options: JOURNAL_COLORS },
    { id: "color-2", label: "2nd color", required: false, options: JOURNAL_COLORS },
    { id: "color-3", label: "3rd color", required: false, options: JOURNAL_COLORS },
    { id: "color-4", label: "4th color", required: false, options: JOURNAL_COLORS },
    { id: "size", label: "Size", required: true, options: JOURNAL_SIZES },
  ];
}

export const sampleGifts: SampleGift[] = [
  {
    id: "journal-cover-3-pouches",
    title: "Journal Cover with 3 Pouches",
    category: "Journaling",
    description: "A cozy, handmade home for your favorite notebook—complete with 3 handy pouches to tuck away pens, stickers, and little keepsakes wherever you go.",
    details: [
      "Includes 3 built-in pouches for pens, stickers, and tiny treasures",
      "Mix and match 1 to 4 colors from 21 gorgeous shades",
      "Available in A4, A5, A6, B5, and B6 notebook sizes",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 1,
    doodle: "heart",
    tone: "mint",
    gallery: [
      { id: "view-1", label: "Front look", caption: "Handmade journal cover with 3 cozy pouches", doodle: "heart", tone: "mint", imageUrl: "/images/journal%201/Cozy%20Forest%20Green%20Leather%20Journal%20Scrapbook-1.png" },
      { id: "view-2", label: "Open layout", caption: "Room for your notebook, pens, and favorite stickers", doodle: "sparkle", tone: "mint", imageUrl: "/images/journal%201/Forest%20Green%20Leather%20Journal%20Scrapbook-2.png" },
      { id: "view-3", label: "Close-up", caption: "Neat pouch details ready for everyday journaling", doodle: "star", tone: "mint", imageUrl: "/images/journal%201/Scrapbook%20Leather%20Journal%20Organizer-3.png" },
    ],
    optionGroups: journalOptionGroups(),
    customizationFields: [],
    isSample: false,
  },
  {
    id: "journal-cover-4-pockets",
    title: "Journal Cover with 4 Pockets",
    category: "Journaling",
    description: "Thoughtfully stitched with 4 neat pockets for all your journaling treasures—washi cards, sticky notes, and sweet little mementos right at your fingertips.",
    details: [
      "4 organized pockets for washi samples, sticky notes, and cards",
      "Create your own 1 to 4 color combination from 21 shades",
      "Sized to fit A4, A5, A6, B5, or B6 notebooks",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 1,
    doodle: "sparkle",
    tone: "mustard",
    gallery: [
      { id: "view-1", label: "Showcase", caption: "Handmade journal cover with 4 stitched pockets", doodle: "sparkle", tone: "mustard", imageUrl: "/images/journal%202/Olive%20Leather%20Journal%20Scrapbook%20Showcase-1.png" },
      { id: "view-2", label: "Inside pockets", caption: "Four neat spots for your favorite stationery bits", doodle: "heart", tone: "mustard", imageUrl: "/images/journal%202/Scrapbook-Style%20Olive%20Leather%20Journal-2.png" },
      { id: "view-3", label: "Flat lay", caption: "Ready for cozy café writing and scrapbooking days", doodle: "star", tone: "mustard", imageUrl: "/images/journal%202/Cozy%20Olive%20Leather%20Journal%20Flat%20Lay-3.png" },
    ],
    optionGroups: journalOptionGroups(),
    customizationFields: [],
    isSample: false,
  },
  {
    id: "journal-cover-5-pockets",
    title: "Journal Cover with 5 Pockets",
    category: "Journaling",
    description: "The ultimate organizer for a happy journaling session! Five roomy pockets keep every sticker sheet, pen, and scrapbooking favorite tucked safely inside.",
    details: [
      "5 roomy pockets for maximum stationery & sticker storage",
      "Pick 1 to 4 colors from 21 shades for your dream palette",
      "Tailored for A4, A5, A6, B5, or B6 journals",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 1,
    doodle: "star",
    tone: "periwinkle",
    gallery: [
      { id: "view-1", label: "Organizer view", caption: "Five-pocket journal cover for all your creative essentials", doodle: "star", tone: "periwinkle", imageUrl: "/images/journal%203/Olive%20Green%20Leather%20Journal%20Organizer-1.png" },
      { id: "view-2", label: "Detail collage", caption: "Handcrafted pockets built for stickers, tabs, and notes", doodle: "sparkle", tone: "periwinkle", imageUrl: "/images/journal%203/Handcrafted%20Olive%20Green%20Journal%20Collage-2.png" },
      { id: "view-3", label: "Flat lay", caption: "Your whole cozy journaling desk wrapped in one cover", doodle: "heart", tone: "periwinkle", imageUrl: "/images/journal%203/Cozy%20Olive%20Green%20Journal%20Flat%20Lay-3.png" },
    ],
    optionGroups: journalOptionGroups(),
    customizationFields: [],
    isSample: false,
  },
  {
    id: "envelope-kindle-cover",
    title: "Envelope-Style Kindle Cover",
    category: "Reading Accessories",
    description: "A soft, snuggly felt envelope made to hug your Kindle safely in your bag—so every cozy reading break feels like opening a little love letter.",
    details: [
      "Soft, protective envelope-style sleeve for stress-free reading on the go",
      "Charming letter-inspired silhouette that slips easily into any tote",
      "Let me know your Kindle model or favorite pastel shade if you have one in mind",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 1,
    doodle: "heart",
    tone: "bubblegum",
    gallery: [
      { id: "view-1", label: "Envelope front", caption: "Sweet pastel felt envelope sleeve for your Kindle", doodle: "heart", tone: "bubblegum", imageUrl: "/images/Kindle%20Cover/Pastel%20Felt%20Envelope%20Sleeve%20Display-1.png" },
      { id: "view-2", label: "Cozy styling", caption: "Softly padded to keep your e-reader safe in your bag", doodle: "sparkle", tone: "bubblegum", imageUrl: "/images/Kindle%20Cover/Scrapbook%20Felt%20Envelope%20E-Reader%20Sleeve-2.png" },
      { id: "view-3", label: "Handmade detail", caption: "Tactile felt finish made for slow, happy reading afternoons", doodle: "star", tone: "bubblegum", imageUrl: "/images/Kindle%20Cover/Handmade%20Felt%20Kindle%20Sleeve%20Scrapbook-3.png" },
    ],
    optionGroups: [],
    customizationFields: [
      {
        id: "kindle-note",
        label: "Kindle model or color preference",
        hint: "Optional—tell me your Kindle model or a favorite shade you'd love!",
        placeholder: "e.g. Kindle Paperwhite, soft pastel pink",
        required: false,
        maxLength: 120,
      },
    ],
    isSample: false,
  },
  {
    id: "assorted-cute-bookmarks",
    title: "Assorted Cute-Style Bookmarks",
    category: "Bookmarks",
    description: "Sweet, cheerful little bookmarks to hold your spot and make you smile every single time you open your book—pick up to 3 favorites!",
    details: [
      "Adorable pastel & kawaii-inspired designs to brighten every chapter",
      "Pick up to 3 bookmarks for your current reads",
      "Leave an optional note if there's a cute vibe or animal you adore",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 3,
    doodle: "sparkle",
    tone: "bubblegum",
    gallery: [
      { id: "view-1", label: "Bookmark collage", caption: "Cute pastel bookmarks ready to save your favorite pages", doodle: "sparkle", tone: "bubblegum", imageUrl: "/images/Assorted%20Bookmarks/Kawaii%20Bookmark%20Scrapbook%20Collage-1.png" },
      { id: "view-2", label: "Scrapbook flat lay", caption: "Playful illustrations that make every reading break happier", doodle: "heart", tone: "bubblegum", imageUrl: "/images/Assorted%20Bookmarks/Pastel%20Bookmarks%20on%20a%20Cozy%20Scrapbook%20Flat%20Lay-2.png" },
      { id: "view-3", label: "Stationery pairing", caption: "Pick up to 3 sweet styles for your bookshelf", doodle: "star", tone: "bubblegum", imageUrl: "/images/Assorted%20Bookmarks/Cozy%20Pastel%20Bookish%20Stationery%20Flatlay-3.png" },
    ],
    optionGroups: [],
    customizationFields: [
      {
        id: "style-note",
        label: "Favorite cute vibe or style",
        hint: "Optional—cats, florals, pastels, cozy cafés, or surprise me!",
        placeholder: "e.g. Pastel bunnies, cozy coffee cups, florals",
        required: false,
        maxLength: 120,
      },
    ],
    isSample: false,
  },
  {
    id: "marvel-fan-art-bookmarks",
    title: "Hand-Drawn Marvel Fan Art Bookmarks",
    category: "Bookmarks",
    description: "One-of-a-kind hand-drawn Marvel bookmarks full of hero energy and personality—pick up to 3 to guard your favorite chapters!",
    details: [
      "Hand-drawn fan art designs bursting with Marvel charm",
      "Pick up to 3 bookmarks for your reading stack",
      "Tell me your favorite Marvel heroes so I pick ones you'll love most",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 3,
    doodle: "burst",
    tone: "tomato",
    gallery: [
      { id: "view-1", label: "Hero collage", caption: "Hand-drawn Marvel fan art bookmarks with bold comic charm", doodle: "burst", tone: "tomato", imageUrl: "/images/Marvel%20Bookmarks/Marvel-Inspired%20Bookmark%20Collage-1.png" },
      { id: "view-2", label: "Still life", caption: "Cozy bookish vibes meets your favorite superheroes", doodle: "star", tone: "tomato", imageUrl: "/images/Marvel%20Bookmarks/Cozy%20Scrapbook%20Bookmark%20Still%20Life-2.png" },
      { id: "view-3", label: "Flat lay", caption: "Pick up to 3 to keep your favorite stories safe", doodle: "sparkle", tone: "tomato", imageUrl: "/images/Marvel%20Bookmarks/Superhero%20Bookmark%20Scrapbook%20Flat%20Lay.png" },
    ],
    optionGroups: [],
    customizationFields: [
      {
        id: "character-note",
        label: "Favorite Marvel characters",
        hint: "Optional—who are your top heroes or favorites?",
        placeholder: "e.g. Spider-Man, Wanda, Iron Man, Loki",
        required: false,
        maxLength: 120,
      },
    ],
    isSample: false,
  },
  {
    id: "surprise-snail-mail",
    title: "Surprise Snail Mail",
    category: "Keepsakes",
    description: "A happy little envelope packed with handpicked paper goodies and sweet surprises—let me surprise you completely, or whisper a favorite theme!",
    details: [
      "Curated snail mail bundle filled with charming paper keepsakes and stickers",
      "Choose between a total mystery surprise or requesting your own theme",
      "Feels like receiving a joyful little treasure chest in the mail",
    ],
    availability: "available",
    customizable: true,
    maxQuantity: 1,
    doodle: "heart",
    tone: "mustard",
    gallery: [
      { id: "view-1", label: "Mystery parcel", caption: "A joyful snail mail package packed with paper surprises", doodle: "heart", tone: "mustard", imageUrl: "/images/Snail%20Mail/Snail%20Mail%20Mystery%20Keepsake%20Package-1.png" },
      { id: "view-2", label: "Keepsake goodies", caption: "Curated stickers, notes, and sweet little ephemera inside", doodle: "sparkle", tone: "mustard", imageUrl: "/images/Snail%20Mail/Mystery%20Snail%20Mail%20Keepsake-2.png" },
      { id: "view-3", label: "Cozy snail mail set", caption: "Keep it a mystery or pick any theme your heart desires", doodle: "star", tone: "mustard", imageUrl: "/images/Snail%20Mail/Cozy%20Snail%20Mail%20Surprise%20Keepsake%20Set-3.png" },
    ],
    optionGroups: [
      {
        id: "style",
        label: "Snail mail vibe",
        required: true,
        options: [
          { value: "surprise", label: "Keep it a surprise" },
          { value: "request-theme", label: "Request a theme" },
        ],
      },
    ],
    customizationFields: [
      {
        id: "theme",
        label: "Requested theme",
        hint: "If you'd like a theme, tell me what vibe would make you smile!",
        placeholder: "e.g. Studio Ghibli, cozy café, vintage botanicals, cute cats",
        required: false,
        maxLength: 160,
      },
    ],
    isSample: false,
  },
];

export const availabilityLabel: Record<GiftAvailability, string> = { available: "Ready for you", limited: "Just a few", planned: "Coming soon" };
export const availabilityTone: Record<GiftAvailability, TagTone> = { available: "mint", limited: "mustard", planned: "periwinkle" };
export function getSampleGift(id: string) { return sampleGifts.find((gift) => gift.id === id); }
