import { Doodle, Skeleton, SkeletonText, Spinner } from "@plop-ui/react";

import { JournalSheet } from "@/components/journal";

export function ConfirmationSkeleton() {
  return (
    <section className="confirmation-letter" aria-busy="true">
      <div className="confirmation-letter__hero">
        <Doodle kind="heart" tone="bubblegum" size={88} />
        <Spinner
          kind="scribble"
          size="sm"
          label="Opening your keepsake note…"
          showLabel
          seed="confirmation-spinner"
        />
        <Skeleton shape="title" width="min(100%, 26rem)" height={44} seed="confirmation-title" />
        <Skeleton shape="line" width="min(100%, 22rem)" height={18} seed="confirmation-sub" />
      </div>

      <JournalSheet tape="bubblegum" spacing="roomy" className="confirmation-letter__paper" aria-hidden="true">
        <div className="confirmation-letter__meta">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <Skeleton shape="line" width={88} height={12} seed={`confirmation-meta-l-${index}`} />
              <Skeleton shape="line" width={128} height={20} seed={`confirmation-meta-v-${index}`} />
            </div>
          ))}
        </div>

        <div className="confirmation-letter__salutation">
          <Skeleton shape="line" width={180} height={22} seed="confirmation-salutation" />
          <SkeletonText lines={2} seed="confirmation-intro" />
        </div>

        <ol className="confirmation-gifts">
          {[1, 2].map((num) => (
            <li key={num} className="confirmation-gift">
              <Skeleton shape="circle" width={40} height={40} seed={`confirmation-num-${num}`} />
              <div className="confirmation-gift__content">
                <div className="confirmation-skeleton__item-head">
                  <div className="gift-card-skeleton__copy">
                    <Skeleton shape="line" width={92} height={12} seed={`confirmation-cat-${num}`} />
                    <Skeleton shape="title" width={200} height={24} seed={`confirmation-name-${num}`} />
                  </div>
                  <Skeleton shape="pill" width={72} height={26} seed={`confirmation-qty-${num}`} />
                </div>
                <SkeletonText lines={2} seed={`confirmation-desc-${num}`} />
                <div className="confirmation-skeleton__details">
                  <Skeleton shape="pill" width={110} height={28} seed={`confirmation-opt-a-${num}`} />
                  <Skeleton shape="pill" width={96} height={28} seed={`confirmation-opt-b-${num}`} />
                </div>
              </div>
            </li>
          ))}
        </ol>

        <footer className="confirmation-letter__footer">
          <div className="gift-card-skeleton__copy">
            <Skeleton shape="line" width={210} height={18} seed="confirmation-ref" />
            <Skeleton shape="line" width={250} height={14} seed="confirmation-ref-sub" />
          </div>
          <Skeleton shape="block" width={210} height={46} seed="confirmation-cta" />
        </footer>
      </JournalSheet>
    </section>
  );
}
