import { Doodle } from "@plop-ui/react";

import { JournalButtonLink, JournalTag } from "@/components/journal";
import { availabilityLabel, availabilityTone, type SampleGift } from "@/data/sample-gifts";

export function GiftCard({ gift }: { gift: SampleGift }) {
  return (
    <article className="gift-card">
      <div className={`gift-card__art gift-card__art--${gift.tone}`} aria-hidden="true">
        <Doodle kind={gift.doodle} tone={gift.tone} size={86} tilt={-6} />
        <span>Illustrative gift</span>
      </div>
      <div className="gift-card__body">
        <div className="gift-card__tags">
          <JournalTag tone={availabilityTone[gift.availability]} seed={`${gift.id}-availability`}>{availabilityLabel[gift.availability]}</JournalTag>
          {gift.customizable && <JournalTag tone="bubblegum" seed={`${gift.id}-custom`}>Customizable</JournalTag>}
        </div>
        <div>
          <h2>{gift.title}</h2>
          <p>{gift.description}</p>
        </div>
        <dl className="gift-card__meta">
          <div><dt>Category</dt><dd>{gift.category}</dd></div>
          <div><dt>Maximum</dt><dd>{gift.maxQuantity}</dd></div>
        </dl>
        <JournalButtonLink
          href={`/gifts/${gift.id}`}
          transitionTypes={["page-turn-forward"]}
          variant={gift.availability === "planned" ? "plain" : "periwinkle"}
          seed={`${gift.id}-open`}
        >
          {gift.availability === "planned" ? "Preview gift" : "Choose details"}
        </JournalButtonLink>
      </div>
    </article>
  );
}
