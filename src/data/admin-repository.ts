import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminOverview() {
  const supabase = createAdminClient();
  const [{ count: giftCount }, { count: submissionCount }, { count: pendingCount }] = await Promise.all([
    supabase.from("gifts").select("id", { count: "exact", head: true }).eq("active", true),
    supabase.from("submissions").select("id", { count: "exact", head: true }),
    supabase.from("submission_items").select("id", { count: "exact", head: true }).eq("purchase_status", "pending"),
  ]);
  return { giftCount: giftCount ?? 0, submissionCount: submissionCount ?? 0, pendingCount: pendingCount ?? 0 };
}

export async function getAdminGifts() {
  const { data, error } = await createAdminClient().from("gifts")
    .select("id,title,category,availability,max_quantity,active,sort_order,is_sample")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getAdminGift(id: string) {
  const { data, error } = await createAdminClient().from("gifts")
    .select("*,gift_option_groups(id,key,label,required,sort_order,gift_option_values(id,value,label,swatch,available,sort_order)),gift_customization_fields(id,key,label,hint,placeholder,required,max_length,sort_order)")
    .eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAdminSubmissions() {
  const { data, error } = await createAdminClient().from("submissions")
    .select("id,public_reference,recipient_email,item_count,status,created_at,submission_items(purchase_status)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAdminSubmission(id: string) {
  const { data, error } = await createAdminClient().from("submissions")
    .select("id,public_reference,recipient_email,recipient_note,item_count,status,created_at,submission_items(id,quantity,purchase_status,snapshot)")
    .eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}
