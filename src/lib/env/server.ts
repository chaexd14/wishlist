import "server-only";

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const serverEnvironment = serverEnvironmentSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
