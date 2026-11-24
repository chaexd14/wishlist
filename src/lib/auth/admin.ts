import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { serverEnvironment } from "@/lib/env/server";

export async function getAdminUser() {
  const { data: { user }, error } = await (await createClient()).auth.getUser();
  if (error || !user?.email) return null;
  const allowed = serverEnvironment.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  return allowed.length === 0 || allowed.includes(user.email.toLowerCase()) ? user : null;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/auth/login?next=/admin");
  return user;
}
