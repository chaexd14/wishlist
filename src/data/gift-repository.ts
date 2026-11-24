import "server-only";

import { cache } from "react";

import { getSampleGift, sampleGifts, type SampleGift } from "@/data/sample-gifts";
import { createAdminClient } from "@/lib/supabase/admin";

type GiftRow = {
  id: string;
  title: string;
  category: SampleGift["category"];
  description: string;
  details: string[];
  availability: SampleGift["availability"];
  customizable: boolean;
  max_quantity: number;
  doodle: SampleGift["doodle"];
  tone: SampleGift["tone"];
  gallery: SampleGift["gallery"];
  is_sample: boolean;
  gift_option_groups?: Array<{
    key: string;
    label: string;
    required: boolean;
    sort_order: number;
    gift_option_values?: Array<{ value: string; label: string; swatch: string | null; sort_order: number; available: boolean }>;
  }>;
  gift_customization_fields?: Array<{
    key: string;
    label: string;
    hint: string;
    placeholder: string;
    required: boolean;
    max_length: number;
    sort_order: number;
  }>;
};

function mapGift(row: GiftRow): SampleGift {
  const fallback = getSampleGift(row.id);
  const optionGroups = [...(row.gift_option_groups ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((group) => ({
      id: group.key,
      label: group.label,
      required: group.required,
      options: [...(group.gift_option_values ?? [])]
        .filter((option) => option.available)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((option) => ({ value: option.value, label: option.label, ...(option.swatch ? { swatch: option.swatch } : {}) })),
    }));
  const customizationFields = [...(row.gift_customization_fields ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((field) => ({ id: field.key, label: field.label, hint: field.hint, placeholder: field.placeholder, required: field.required, maxLength: field.max_length }));

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    details: row.details,
    availability: row.availability,
    customizable: row.customizable,
    maxQuantity: row.max_quantity,
    doodle: row.doodle,
    tone: row.tone,
    gallery: row.gallery?.length ? row.gallery : fallback?.gallery ?? [],
    optionGroups,
    customizationFields,
    isSample: row.is_sample,
  };
}

export const getCatalogGifts = cache(async (): Promise<SampleGift[]> => {
  try {
    const { data, error } = await createAdminClient()
      .from("gifts")
      .select("*, gift_option_groups(key,label,required,sort_order,gift_option_values(value,label,swatch,sort_order,available)), gift_customization_fields(key,label,hint,placeholder,required,max_length,sort_order)")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    return (data as GiftRow[]).map(mapGift);
  } catch (error) {
    console.warn("Using the illustrative catalog because Supabase gifts are unavailable.", error);
    return sampleGifts.map((gift) => ({ ...gift, isSample: true }));
  }
});

export const getCatalogGift = cache(async (id: string) => (await getCatalogGifts()).find((gift) => gift.id === id));
