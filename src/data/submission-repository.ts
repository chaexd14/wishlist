import "server-only";

import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";

const snapshotSchema = z.object({
  giftId: z.string(), title: z.string(), category: z.string(), description: z.string(),
  availability: z.string(), selections: z.record(z.string(), z.string()),
  customizations: z.record(z.string(), z.string()), submittedAt: z.string(),
});

const submissionSchema = z.object({
  id: z.uuid(), public_reference: z.string(), recipient_note: z.string().nullable(),
  item_count: z.number().int().positive(), created_at: z.string(),
  submission_items: z.array(z.object({ id: z.uuid(), quantity: z.number().int().positive(), snapshot: snapshotSchema })),
});

export type SubmissionConfirmation = z.infer<typeof submissionSchema>;

export async function getSubmissionConfirmation(id: string): Promise<SubmissionConfirmation | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await createAdminClient()
    .from("submissions")
    .select("id,public_reference,recipient_note,item_count,created_at,submission_items(id,quantity,snapshot)")
    .eq("id", id)
    .order("created_at", { referencedTable: "submission_items", ascending: true })
    .maybeSingle();
  if (error) {
    console.error("Confirmation lookup failed", { code: error.code, message: error.message });
    throw new Error("The confirmation could not be loaded.");
  }
  if (!data) return null;
  const parsed = submissionSchema.safeParse(data);
  if (!parsed.success) {
    console.error("Confirmation data was invalid", parsed.error.flatten());
    throw new Error("The confirmation data was incomplete.");
  }
  return parsed.data;
}
