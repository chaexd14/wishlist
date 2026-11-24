"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdminUser } from "@/lib/auth/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const giftSchema = z.object({
  id: z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2).max(120), category: z.enum(["Accessories", "Keepsakes", "Cozy things", "Creative"]),
  description: z.string().trim().min(5).max(500), availability: z.enum(["available", "limited", "planned"]),
  maxQuantity: z.coerce.number().int().min(1).max(99), sortOrder: z.coerce.number().int().min(0).max(9999),
  doodle: z.string().min(1), tone: z.string().min(1), details: z.array(z.string().min(1)).max(20),
  gallery: z.array(z.object({ id: z.string(), label: z.string(), caption: z.string(), doodle: z.string(), tone: z.string(), imageUrl: z.union([z.literal(""), z.url()]).optional() })).max(20),
  optionGroups: z.array(z.object({ key: z.string().min(1), label: z.string().min(1), required: z.boolean(), options: z.array(z.object({ value: z.string().min(1), label: z.string().min(1), swatch: z.string().nullable() })) })).max(20),
  customizations: z.array(z.object({ key: z.string().min(1), label: z.string().min(1), hint: z.string(), placeholder: z.string(), required: z.boolean(), maxLength: z.number().int().min(1).max(500) })).max(20),
});

export async function saveGift(formData: FormData) {
  await requireAdminUser();
  const parsed = giftSchema.parse(JSON.parse(String(formData.get("payload") ?? "{}")));
  const supabase = createAdminClient();
  const { error } = await supabase.from("gifts").upsert({
    id: parsed.id, title: parsed.title, category: parsed.category, description: parsed.description,
    details: parsed.details, availability: parsed.availability, customizable: parsed.customizations.length > 0,
    max_quantity: parsed.maxQuantity, doodle: parsed.doodle, tone: parsed.tone, gallery: parsed.gallery,
    sort_order: parsed.sortOrder, active: true, is_sample: false, updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  const { data: oldGroups } = await supabase.from("gift_option_groups").select("id").eq("gift_id", parsed.id);
  if (oldGroups?.length) await supabase.from("gift_option_groups").delete().eq("gift_id", parsed.id);
  await supabase.from("gift_customization_fields").delete().eq("gift_id", parsed.id);
  for (const [groupIndex, group] of parsed.optionGroups.entries()) {
    const { data: savedGroup, error: groupError } = await supabase.from("gift_option_groups").insert({ gift_id: parsed.id, key: group.key, label: group.label, required: group.required, sort_order: groupIndex * 10 }).select("id").single();
    if (groupError) throw new Error(groupError.message);
    if (group.options.length) {
      const { error: optionError } = await supabase.from("gift_option_values").insert(group.options.map((option, optionIndex) => ({ option_group_id: savedGroup.id, value: option.value, label: option.label, swatch: option.swatch || null, sort_order: optionIndex * 10 })));
      if (optionError) throw new Error(optionError.message);
    }
  }
  if (parsed.customizations.length) {
    const { error: customizationError } = await supabase.from("gift_customization_fields").insert(parsed.customizations.map((field, index) => ({ gift_id: parsed.id, key: field.key, label: field.label, hint: field.hint, placeholder: field.placeholder, required: field.required, max_length: field.maxLength, sort_order: index * 10 })));
    if (customizationError) throw new Error(customizationError.message);
  }
  revalidatePath("/gifts"); revalidatePath(`/gifts/${parsed.id}`); revalidatePath("/admin/gifts");
  redirect("/admin/gifts");
}

export async function archiveGift(formData: FormData) {
  await requireAdminUser();
  const id = z.string().min(1).parse(formData.get("id"));
  const { error } = await createAdminClient().from("gifts").update({ active: false, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gifts"); revalidatePath("/admin/gifts");
}

export async function updateSubmissionStatus(formData: FormData) {
  await requireAdminUser();
  const id = z.uuid().parse(formData.get("id"));
  const status = z.enum(["submitted", "reviewing", "purchased", "gifted"]).parse(formData.get("status"));
  const { error } = await createAdminClient().from("submissions").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/submissions"); revalidatePath(`/admin/submissions/${id}`);
}

export async function updatePurchaseStatus(formData: FormData) {
  await requireAdminUser();
  const submissionId = z.uuid().parse(formData.get("submissionId"));
  const itemId = z.uuid().parse(formData.get("itemId"));
  const purchaseStatus = z.enum(["pending", "purchased", "gifted"]).parse(formData.get("purchaseStatus"));
  const { error } = await createAdminClient().from("submission_items").update({ purchase_status: purchaseStatus }).eq("id", itemId).eq("submission_id", submissionId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/submissions"); revalidatePath(`/admin/submissions/${submissionId}`);
}
