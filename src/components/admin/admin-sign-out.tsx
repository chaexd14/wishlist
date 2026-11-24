"use client";

import { useRouter } from "next/navigation";

import { JournalButton } from "@/components/journal";
import { createClient } from "@/lib/supabase/client";

export function AdminSignOut() {
  const router = useRouter();
  return <JournalButton intent="quiet" onClick={async () => { await createClient().auth.signOut(); router.replace("/auth/login"); router.refresh(); }}>Sign out</JournalButton>;
}
