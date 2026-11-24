import { Doodle, Skeleton, Spinner } from "@plop-ui/react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { JournalHeading, JournalSheet } from "@/components/journal";
import { getAdminUser } from "@/lib/auth/admin";

export const instant = false;

function LoginFormSkeleton() {
  return (
    <div className="admin-skeleton-form" aria-busy="true">
      <div className="skeleton-status-row">
        <Spinner kind="ink" size="sm" label="Preparing sign in…" showLabel seed="login-spinner" />
      </div>
      <div className="admin-skeleton-field" aria-hidden="true">
        <Skeleton shape="line" width="36%" height={12} seed="login-email-label" />
        <Skeleton shape="block" height={44} seed="login-email-input" />
      </div>
      <div className="admin-skeleton-field" aria-hidden="true">
        <Skeleton shape="line" width="32%" height={12} seed="login-pass-label" />
        <Skeleton shape="block" height={44} seed="login-pass-input" />
      </div>
      <Skeleton shape="block" height={46} seed="login-submit" />
    </div>
  );
}

export default async function LoginPage() {
  if (await getAdminUser()) redirect("/admin");
  return (
    <main className="admin-login-page">
      <JournalSheet tape="bubblegum" spacing="roomy" className="admin-login-card">
        <Doodle kind="heart" tone="bubblegum" size={76} />
        <span className="admin-eyebrow">Creator only</span>
        <JournalHeading level={1} size="section">Open the wishlist studio</JournalHeading>
        <p>Sign in to manage gifts and see the shopping checklist.</p>
        <Suspense fallback={<LoginFormSkeleton />}>
          <AdminLoginForm />
        </Suspense>
      </JournalSheet>
    </main>
  );
}
