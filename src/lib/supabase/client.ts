import { createBrowserClient } from "@supabase/ssr";

import { clientEnvironment } from "@/lib/env/client";

export function createClient() {
  return createBrowserClient(
    clientEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    clientEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
