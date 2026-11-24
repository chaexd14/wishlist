import type { ReactNode } from "react";
import Link from "next/link";

import { AdminSignOut } from "@/components/admin/admin-sign-out";
import { requireAdminUser } from "@/lib/auth/admin";

export const instant = false;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();
  return <div className="admin-shell"><header className="admin-header"><Link className="admin-brand" href="/admin">Wishlist studio</Link><nav aria-label="Administration"><Link href="/admin/gifts">Gifts</Link><Link href="/admin/submissions">Wishlists</Link><Link href="/gifts">View storefront</Link></nav><div className="admin-account"><span>{user.email}</span><AdminSignOut /></div></header>{children}</div>;
}
