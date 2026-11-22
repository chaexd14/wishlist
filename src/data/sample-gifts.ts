import type { DoodleKind, DoodleTone, TagTone } from "@plop-ui/react";

export type GiftAvailability = "available" | "limited" | "planned";
export type GiftOption = { value: string; label: string; swatch?: string };
export type GiftOptionGroup = { id: string; label: string; options: GiftOption[] };
export type GiftCustomization = { id: string; label: string; hint: string; placeholder: string; required?: boolean; maxLength: number };
export type GiftGallerySlide = { id: string; label: string; caption: string; doodle: DoodleKind; tone: DoodleTone };
export type SampleGift = {
  id: string; title: string; category: "Accessories" | "Keepsakes" | "Cozy things" | "Creative";
  description: string; details: string[]; availability: GiftAvailability; customizable: boolean;
  maxQuantity: number; doodle: DoodleKind; tone: DoodleTone; gallery: GiftGallerySlide[];
  optionGroups: GiftOptionGroup[]; customizationFields: GiftCustomization[];
};

const gallery = (title: string, doodle: DoodleKind, tone: DoodleTone): GiftGallerySlide[] => [
  { id: "front", label: "Front view", caption: `${title}, seen from the front`, doodle, tone },
  { id: "side", label: "Side view", caption: "A closer look at the side and shape", doodle: "sparkle", tone },
  { id: "detail", label: "Favorite detail", caption: "The little detail worth noticing", doodle: "burst", tone },
  { id: "lifestyle", label: "In her journal", caption: "How it might feel in everyday life", doodle: "heart", tone },
];

export const sampleGifts: SampleGift[] = [
  { id: "everyday-bag", title: "Everyday bag", category: "Accessories", description: "A practical favorite with color and size choices.", details: ["Easy everyday shape", "Room for daily essentials", "Pick the color and size that feels most like you"], availability: "available", customizable: false, maxQuantity: 1, doodle: "heart", tone: "bubblegum", gallery: gallery("Everyday bag", "heart", "bubblegum"), optionGroups: [
    { id: "color", label: "Color", options: [{ value: "mocha", label: "Mocha", swatch: "#8a6048" }, { value: "rose", label: "Rose", swatch: "#d58b8b" }, { value: "black", label: "Black", swatch: "#34221c" }] },
    { id: "size", label: "Size", options: [{ value: "mini", label: "Mini" }, { value: "regular", label: "Regular" }] },
  ], customizationFields: [] },
  { id: "initial-necklace", title: "Initial necklace", category: "Keepsakes", description: "A small keepsake with a preferred finish and initial.", details: ["Simple initial pendant", "Choose the metal finish", "One-letter personalization"], availability: "available", customizable: true, maxQuantity: 1, doodle: "sparkle", tone: "mustard", gallery: gallery("Initial necklace", "sparkle", "mustard"), optionGroups: [
    { id: "finish", label: "Finish", options: [{ value: "gold", label: "Gold" }, { value: "silver", label: "Silver" }, { value: "rose-gold", label: "Rose gold" }] },
  ], customizationFields: [{ id: "initial", label: "Initial", hint: "One letter for the pendant.", placeholder: "e.g. A", required: true, maxLength: 1 }] },
  { id: "soft-cardigan", title: "Soft cardigan", category: "Cozy things", description: "A cozy layer with exact color and sizing details.", details: ["Soft everyday layer", "Relaxed, cozy silhouette", "Choose the most comfortable size"], availability: "limited", customizable: false, maxQuantity: 2, doodle: "star", tone: "mint", gallery: gallery("Soft cardigan", "star", "mint"), optionGroups: [
    { id: "color", label: "Color", options: [{ value: "cream", label: "Cream", swatch: "#fff8e8" }, { value: "cocoa", label: "Cocoa", swatch: "#68493d" }, { value: "dusty-rose", label: "Dusty rose", swatch: "#d58b8b" }] },
    { id: "size", label: "Size", options: ["XS", "S", "M", "L", "XL"].map((label) => ({ value: label.toLowerCase(), label })) },
  ], customizationFields: [] },
  { id: "journal-set", title: "Journal set", category: "Creative", description: "Paper, pens, and stickers for making another keepsake.", details: ["A journal with matching creative extras", "Paper style chosen by you", "Optional note written inside"], availability: "available", customizable: true, maxQuantity: 2, doodle: "burst", tone: "periwinkle", gallery: gallery("Journal set", "burst", "periwinkle"), optionGroups: [
    { id: "cover", label: "Cover color", options: [{ value: "coffee", label: "Coffee" }, { value: "pink", label: "Pink" }, { value: "purple", label: "Purple" }, { value: "sky", label: "Sky" }] },
    { id: "paper", label: "Paper", options: [{ value: "lined", label: "Lined" }, { value: "dotted", label: "Dotted" }, { value: "blank", label: "Blank" }] },
  ], customizationFields: [{ id: "inscription", label: "Inside inscription", hint: "Optional, up to 60 characters.", placeholder: "A short note for the first page", maxLength: 60 }] },
  { id: "photo-book", title: "Photo book", category: "Keepsakes", description: "A customizable book for favorite memories.", details: ["A collection of favorite moments", "Cover and page choices will be added later", "Preview only while the idea is being prepared"], availability: "planned", customizable: true, maxQuantity: 1, doodle: "heart", tone: "tomato", gallery: gallery("Photo book", "heart", "tomato"), optionGroups: [], customizationFields: [] },
  { id: "weekend-tote", title: "Weekend tote", category: "Accessories", description: "A roomy tote with an optional embroidered name.", details: ["Roomy carry-all shape", "Useful for weekends and busy days", "Optional embroidered name"], availability: "available", customizable: true, maxQuantity: 1, doodle: "star", tone: "mustard", gallery: gallery("Weekend tote", "star", "mustard"), optionGroups: [
    { id: "color", label: "Color", options: [{ value: "natural", label: "Natural" }, { value: "espresso", label: "Espresso" }, { value: "rose", label: "Rose" }] },
  ], customizationFields: [{ id: "embroidered-name", label: "Embroidered name", hint: "Optional, up to 20 characters.", placeholder: "Name or nickname", maxLength: 20 }] },
];

export const availabilityLabel: Record<GiftAvailability, string> = { available: "Available", limited: "Limited", planned: "Coming later" };
export const availabilityTone: Record<GiftAvailability, TagTone> = { available: "mint", limited: "mustard", planned: "periwinkle" };
export function getSampleGift(id: string) { return sampleGifts.find((gift) => gift.id === id); }
