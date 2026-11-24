import { Skeleton, SkeletonText, Spinner } from "@plop-ui/react";

import { JournalContainer, JournalSheet } from "@/components/journal";

export function GiftDetailsSkeleton() {
  return (
    <main className="gift-preview-page" aria-busy="true">
      <JournalContainer width="full">
        <div className="gift-detail-skeleton__bar">
          <Skeleton shape="pill" width={132} height={40} seed="gift-detail-back" />
          <Spinner
            kind="scribble"
            size="sm"
            label="Getting this gift ready for you…"
            showLabel
            seed="gift-detail-spinner"
          />
        </div>

        <div className="gift-detail-layout" aria-hidden="true">
          <div className="gift-gallery">
            <div className="gift-detail-skeleton__gallery-frame">
              <Skeleton shape="block" height="100%" seed="gift-detail-hero-photo" />
            </div>
          </div>

          <JournalSheet tape="bubblegum" spacing="comfortable" className="gift-preview__copy gift-detail-choice">
            <div className="gift-card__tags">
              <Skeleton shape="pill" width={96} height={26} seed="gift-detail-tag-a" />
              <Skeleton shape="pill" width={116} height={26} seed="gift-detail-tag-b" />
            </div>
            <Skeleton shape="title" width="76%" height={42} seed="gift-detail-title" />
            <SkeletonText lines={3} seed="gift-detail-desc" />
            <div className="gift-detail-meta">
              <div className="gift-detail-skeleton__meta-item">
                <Skeleton shape="line" width={72} height={12} seed="gift-detail-meta-l1" />
                <Skeleton shape="line" width={96} height={18} seed="gift-detail-meta-v1" />
              </div>
              <div className="gift-detail-skeleton__meta-item">
                <Skeleton shape="line" width={68} height={12} seed="gift-detail-meta-l2" />
                <Skeleton shape="line" width={40} height={18} seed="gift-detail-meta-v2" />
              </div>
            </div>
            <div className="gift-detail-skeleton__group">
              <Skeleton shape="line" width={90} height={14} seed="gift-detail-opt-l1" />
              <div className="gift-detail-skeleton__pills">
                <Skeleton shape="pill" width={88} height={40} seed="gift-detail-opt-1a" />
                <Skeleton shape="pill" width={96} height={40} seed="gift-detail-opt-1b" />
                <Skeleton shape="pill" width={84} height={40} seed="gift-detail-opt-1c" />
              </div>
            </div>
            <div className="gift-detail-skeleton__group">
              <Skeleton shape="line" width={76} height={14} seed="gift-detail-opt-l2" />
              <div className="gift-detail-skeleton__pills">
                <Skeleton shape="pill" width={92} height={40} seed="gift-detail-opt-2a" />
                <Skeleton shape="pill" width={104} height={40} seed="gift-detail-opt-2b" />
              </div>
            </div>
            <Skeleton shape="block" height={48} seed="gift-detail-cta" />
          </JournalSheet>

          <JournalSheet tape="mustard" spacing="comfortable" className="gift-about">
            <Skeleton shape="title" width={180} height={24} seed="gift-detail-about-title" />
            <SkeletonText lines={3} seed="gift-detail-about-body" />
          </JournalSheet>
        </div>
      </JournalContainer>
    </main>
  );
}
