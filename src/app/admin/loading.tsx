import { Skeleton, Spinner } from "@plop-ui/react";

import { JournalHeading, JournalSheet } from "@/components/journal";

export default function AdminLoading() {
  return (
    <main className="admin-page" aria-busy="true">
      <div className="admin-page-heading">
        <div>
          <JournalHeading level={1} size="page">Wishlist studio</JournalHeading>
          <div className="skeleton-status-row">
            <Spinner kind="ink" size="sm" label="Loading workspace…" showLabel seed="admin-overview-spinner" />
          </div>
        </div>
      </div>

      <section className="admin-stat-grid" aria-hidden="true">
        <JournalSheet tape="bubblegum">
          <Skeleton shape="title" width={64} height={48} seed="admin-stat-1" />
          <Skeleton shape="line" width={110} height={16} seed="admin-stat-1-label" />
        </JournalSheet>
        <JournalSheet tape="mint">
          <Skeleton shape="title" width={64} height={48} seed="admin-stat-2" />
          <Skeleton shape="line" width={148} height={16} seed="admin-stat-2-label" />
        </JournalSheet>
        <JournalSheet tape="mustard">
          <Skeleton shape="title" width={64} height={48} seed="admin-stat-3" />
          <Skeleton shape="line" width={160} height={16} seed="admin-stat-3-label" />
        </JournalSheet>
      </section>

      <div className="admin-dashboard-actions" aria-hidden="true">
        <Skeleton shape="block" width={220} height={46} seed="admin-action-1" />
        <Skeleton shape="block" width={200} height={46} seed="admin-action-2" />
      </div>
    </main>
  );
}
