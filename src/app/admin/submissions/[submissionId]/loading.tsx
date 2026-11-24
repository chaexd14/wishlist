import { Skeleton, SkeletonText, Spinner } from "@plop-ui/react";

import { JournalHeading, JournalSheet } from "@/components/journal";

const checklistCards = [
  { id: "item-1", tape: "mustard" as const },
  { id: "item-2", tape: "periwinkle" as const },
  { id: "item-3", tape: "mint" as const },
];

export default function SubmissionDetailsLoading() {
  return (
    <main className="admin-page" aria-busy="true">
      <div className="admin-page-heading">
        <div>
          <JournalHeading level={1} size="section">Purchase checklist</JournalHeading>
          <div className="skeleton-status-row">
            <Spinner kind="ink" size="sm" label="Loading purchase checklist…" showLabel seed="admin-check-spinner" />
          </div>
        </div>
        <div className="admin-skeleton-status-form" aria-hidden="true">
          <Skeleton shape="block" width={164} height={44} seed="admin-check-select" />
          <Skeleton shape="block" width={104} height={44} seed="admin-check-update" />
        </div>
      </div>

      <ol className="admin-checklist" aria-hidden="true">
        {checklistCards.map((card) => (
          <li key={card.id}>
            <JournalSheet tape={card.tape} className="admin-checklist-item">
              <div className="admin-checklist-item__heading">
                <div className="admin-skeleton-cell-stack">
                  <Skeleton shape="line" width={110} height={12} seed={`${card.id}-cat`} />
                  <Skeleton shape="title" width={210} height={26} seed={`${card.id}-title`} />
                </div>
                <Skeleton shape="pill" width={90} height={26} seed={`${card.id}-status`} />
              </div>
              <SkeletonText lines={2} seed={`${card.id}-desc`} />
              <div className="admin-checklist-item__details">
                <Skeleton shape="block" width={144} height={54} seed={`${card.id}-d1`} />
                <Skeleton shape="block" width={144} height={54} seed={`${card.id}-d2`} />
                <Skeleton shape="block" width={144} height={54} seed={`${card.id}-d3`} />
              </div>
              <div className="admin-skeleton-status-form">
                <Skeleton shape="block" width={164} height={44} seed={`${card.id}-select`} />
                <Skeleton shape="block" width={128} height={44} seed={`${card.id}-save`} />
              </div>
            </JournalSheet>
          </li>
        ))}
      </ol>
    </main>
  );
}
