import { Skeleton, Spinner } from "@plop-ui/react";

import { JournalHeading } from "@/components/journal";

const rows = [0, 1, 2, 3, 4, 5] as const;

export default function AdminGiftsLoading() {
  return (
    <main className="admin-page" aria-busy="true">
      <div className="admin-page-heading">
        <div>
          <JournalHeading level={1} size="section">Manage gifts</JournalHeading>
          <div className="skeleton-status-row">
            <Spinner kind="ink" size="sm" label="Loading gift catalog…" showLabel seed="admin-gifts-spinner" />
          </div>
        </div>
        <Skeleton shape="block" width={132} height={44} seed="admin-gifts-cta" />
      </div>

      <div className="admin-table-wrap" aria-hidden="true">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Gift</th>
              <th>Status</th>
              <th>Limit</th>
              <th>Order</th>
              <th>Visibility</th>
              <th><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td>
                  <div className="admin-skeleton-cell-stack">
                    <Skeleton shape="line" width={164} height={16} seed={`ag-title-${row}`} />
                    <Skeleton shape="line" width={92} height={12} seed={`ag-cat-${row}`} />
                  </div>
                </td>
                <td><Skeleton shape="pill" width={86} height={26} seed={`ag-status-${row}`} /></td>
                <td><Skeleton shape="line" width={28} height={16} seed={`ag-limit-${row}`} /></td>
                <td><Skeleton shape="line" width={28} height={16} seed={`ag-order-${row}`} /></td>
                <td><Skeleton shape="line" width={76} height={16} seed={`ag-vis-${row}`} /></td>
                <td><Skeleton shape="line" width={56} height={16} seed={`ag-act-${row}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
