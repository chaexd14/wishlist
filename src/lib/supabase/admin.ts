import "server-only";

import { createClient } from "@supabase/supabase-js";

import { clientEnvironment } from "@/lib/env/client";
import { serverEnvironment } from "@/lib/env/server";

export function createAdminClient() {
  return createClient(
    clientEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    serverEnvironment.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
