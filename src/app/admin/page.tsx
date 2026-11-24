import { JournalButtonLink, JournalHeading, JournalSheet } from "@/components/journal";
import { getAdminOverview } from "@/data/admin-repository";

export default async function AdminPage() {
  const overview = await getAdminOverview();
  return <main className="admin-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">Private workspace</span><JournalHeading level={1} size="page">Wishlist studio</JournalHeading><p>Prepare gifts and turn her submitted choices into a practical shopping plan.</p></div></div><section className="admin-stat-grid" aria-label="Workspace summary"><JournalSheet tape="bubblegum"><strong>{overview.giftCount}</strong><span>Active gifts</span></JournalSheet><JournalSheet tape="mint"><strong>{overview.submissionCount}</strong><span>Submitted wishlists</span></JournalSheet><JournalSheet tape="mustard"><strong>{overview.pendingCount}</strong><span>Items left to purchase</span></JournalSheet></section><div className="admin-dashboard-actions"><JournalButtonLink href="/admin/submissions">Open purchase checklists</JournalButtonLink><JournalButtonLink href="/admin/gifts" variant="mustard">Manage gift catalog</JournalButtonLink></div></main>;
}
