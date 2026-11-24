import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ADMIN_EMAILS: z.string().optional().default(""),
  LUCKY_DRAW_CODE: z.string().trim().min(1).optional(),
});

export const serverEnvironment = serverEnvironmentSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  LUCKY_DRAW_CODE: process.env.LUCKY_DRAW_CODE,
});
