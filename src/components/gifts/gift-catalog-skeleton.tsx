import { Skeleton, SkeletonText, Spinner } from "@plop-ui/react";

import { JournalContainer, JournalHeading } from "@/components/journal";

const filterPillWidths = [64, 114, 108, 118, 96] as const;

const skeletonCards = [
  { id: "card-1", titleWidth: "68%", hasSecondTag: true },
  { id: "card-2", titleWidth: "74%", hasSecondTag: false },
  { id: "card-3", titleWidth: "62%", hasSecondTag: true },
  { id: "card-4", titleWidth: "78%", hasSecondTag: false },
  { id: "card-5", titleWidth: "66%", hasSecondTag: true },
  { id: "card-6", titleWidth: "70%", hasSecondTag: false },
] as const;

export function GiftCatalogSkeleton() {
  return (
    <main className="catalog-page" aria-busy="true">
      <JournalContainer>
        <header className="catalog-intro">
          <div>
            <Skeleton shape="pill" width={148} height={28} seed="catalog-tag-sk" />
            <JournalHeading level={1} size="page">Pick what you truly love</JournalHeading>
          </div>
          <div className="catalog-intro__skeleton-copy" aria-hidden="true">
            <SkeletonText lines={2} seed="catalog-intro-sk" />
          </div>
        </header>

        <div className="gift-catalog">
          <div className="gift-catalog__tools" aria-hidden="true">
            <div className="gift-catalog-skeleton__search">
              <Skeleton shape="line" width="52%" height={14} seed="catalog-search-label" />
              <Skeleton shape="block" height={44} seed="catalog-search-input" />
            </div>
            <div className="gift-catalog__filters">
              {filterPillWidths.map((width, index) => (
                <Skeleton
                  key={index}
                  shape="pill"
                  width={width}
                  height={40}
                  seed={`catalog-filter-sk-${index}`}
                />
              ))}
            </div>
          </div>

          <div className="skeleton-status-row">
            <Spinner
              kind="scribble"
              size="sm"
              label="Unwrapping your gift ideas…"
              showLabel
              seed="catalog-loading-spinner"
            />
          </div>

          <div className="gift-grid" aria-hidden="true">
            {skeletonCards.map((card) => (
              <article key={card.id} className="gift-card gift-card--skeleton">
                <div className="gift-card__art gift-card__art--skeleton">
                  <Skeleton shape="circle" width={86} height={86} seed={`${card.id}-art`} />
                  <Skeleton shape="line" width={108} height={14} seed={`${card.id}-caption`} />
                </div>
                <div className="gift-card__body">
                  <div className="gift-card__tags">
                    <Skeleton shape="pill" width={92} height={26} seed={`${card.id}-tag-a`} />
                    {card.hasSecondTag && (
                      <Skeleton shape="pill" width={108} height={26} seed={`${card.id}-tag-b`} />
                    )}
                  </div>
                  <div className="gift-card-skeleton__copy">
                    <Skeleton shape="title" width={card.titleWidth} height={26} seed={`${card.id}-title`} />
                    <SkeletonText lines={2} seed={`${card.id}-desc`} />
                  </div>
                  <div className="gift-card__meta">
                    <div>
                      <Skeleton shape="line" width="56%" height={12} seed={`${card.id}-meta-l1`} />
                      <Skeleton shape="line" width="76%" height={16} seed={`${card.id}-meta-v1`} />
                    </div>
                    <div>
                      <Skeleton shape="line" width="52%" height={12} seed={`${card.id}-meta-l2`} />
                      <Skeleton shape="line" width="38%" height={16} seed={`${card.id}-meta-v2`} />
                    </div>
                  </div>
                  <Skeleton shape="block" height={46} seed={`${card.id}-cta`} className="gift-card-skeleton__cta" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </JournalContainer>
    </main>
  );
}
