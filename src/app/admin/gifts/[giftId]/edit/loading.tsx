import { Skeleton, Spinner } from "@plop-ui/react";

import { JournalSheet } from "@/components/journal";

export default function EditGiftLoading() {
  return (
    <main className="admin-page" aria-busy="true">
      <div className="admin-page-heading">
        <div>
          <Skeleton shape="title" width={260} height={38} seed="edit-gift-heading" />
          <div className="skeleton-status-row">
            <Spinner kind="ink" size="sm" label="Loading gift editor…" showLabel seed="edit-gift-spinner" />
          </div>
        </div>
      </div>

      <JournalSheet tape="mustard" spacing="comfortable" aria-hidden="true">
        <div className="admin-form-grid">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="admin-skeleton-field">
              <Skeleton shape="line" width="38%" height={12} seed={`eg-label-${index}`} />
              <Skeleton shape="block" height={44} seed={`eg-input-${index}`} />
            </div>
          ))}
          <div className="admin-skeleton-field admin-form-grid__wide">
            <Skeleton shape="line" width="24%" height={12} seed="eg-desc-label" />
            <Skeleton shape="block" height={108} seed="eg-desc-input" />
          </div>
        </div>
        <div className="admin-skeleton-submit">
          <Skeleton shape="block" width={180} height={46} seed="eg-save" />
        </div>
      </JournalSheet>
    </main>
  );
}
