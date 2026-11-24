import { notFound } from "next/navigation";

import { GiftAdminForm, type GiftAdminValue } from "@/components/admin/gift-admin-form";
import { JournalHeading } from "@/components/journal";
import { getAdminGift } from "@/data/admin-repository";

export default async function EditGiftPage({ params }: { params: Promise<{ giftId: string }> }) {
  const gift = await getAdminGift((await params).giftId);
  if (!gift) notFound();
  const groups = [...(gift.gift_option_groups ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const value: GiftAdminValue = { id: gift.id, title: gift.title, category: gift.category, description: gift.description, availability: gift.availability, maxQuantity: gift.max_quantity, sortOrder: gift.sort_order, doodle: gift.doodle, tone: gift.tone, details: gift.details, gallery: Array.isArray(gift.gallery) ? gift.gallery as GiftAdminValue["gallery"] : [], optionGroups: groups.map((group) => ({ key: group.key, label: group.label, required: group.required, options: [...(group.gift_option_values ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((option) => ({ value: option.value, label: option.label, swatch: option.swatch })) })), customizations: [...(gift.gift_customization_fields ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((field) => ({ key: field.key, label: field.label, hint: field.hint, placeholder: field.placeholder, required: field.required, maxLength: field.max_length })) };
  return <main className="admin-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">Catalog editor</span><JournalHeading level={1} size="section">Edit {gift.title}</JournalHeading></div></div><GiftAdminForm initialValue={value} /></main>;
}
