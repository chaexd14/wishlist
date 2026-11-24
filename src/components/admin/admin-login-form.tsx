"use client";

import { Callout } from "@plop-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { JournalButton, JournalTextField } from "@/components/journal";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
    if (signInError) { setError("The email or password was not accepted."); setLoading(false); return; }
    const next = searchParams.get("next");
    router.replace(next?.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return <form className="admin-login-form" onSubmit={submit}>
    <JournalTextField label="Admin email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
    <JournalTextField label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
    {error && <Callout tone="error" title="Could not sign in">{error}</Callout>}
    <JournalButton type="submit" intent="romantic" disabled={loading}>{loading ? "Opening workspace…" : "Open admin workspace"}</JournalButton>
  </form>;
}
