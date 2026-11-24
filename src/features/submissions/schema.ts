import { z } from "zod";

const choiceRecord = z.record(z.string().min(1).max(80), z.string().max(500));

export const submissionRequestSchema = z.object({
  email: z.union([z.literal(""), z.email().max(254)]).optional().default(""),
  note: z.string().trim().max(500, "Keep your note under 500 characters.").optional().default(""),
  items: z.array(z.object({
    giftId: z.string().min(1).max(120),
    quantity: z.number().int().positive().max(99),
    selections: choiceRecord,
    customizations: choiceRecord,
  })).min(1, "Choose at least one gift before submitting.").max(50),
});

export type SubmissionRequest = z.infer<typeof submissionRequestSchema>;
