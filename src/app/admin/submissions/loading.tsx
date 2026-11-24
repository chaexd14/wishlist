import { Skeleton, Spinner } from "@plop-ui/react";

import { JournalHeading } from "@/components/journal";

const rows = [0, 1, 2, 3] as const;

export default function AdminSubmissionsLoading() {
  return (
    <main className="admin-page" aria-busy="true">
      <div className="admin-page-heading">
        <div>
          <JournalHeading level={1} size="section">Submitted wishlists</JournalHeading>
          <div className="skeleton-status-row">
            <Spinner kind="ink" size="sm" label="Loading submitted wishlists…" showLabel seed="admin-sub-spinner" />
          </div>
        </div>
      </div>

      <div className="admin-table-wrap" aria-hidden="true">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Sent</th>
              <th>Gifts</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td>
                  <div className="admin-skeleton-cell-stack">
                    <Skeleton shape="line" width={132} height={16} seed={`as-ref-${row}`} />
                    <Skeleton shape="line" width={170} height={12} seed={`as-email-${row}`} />
                  </div>
                </td>
                <td><Skeleton shape="line" width={104} height={16} seed={`as-date-${row}`} /></td>
                <td><Skeleton shape="line" width={28} height={16} seed={`as-count-${row}`} /></td>
                <td><Skeleton shape="line" width={42} height={16} seed={`as-prog-${row}`} /></td>
                <td><Skeleton shape="pill" width={92} height={26} seed={`as-status-${row}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
